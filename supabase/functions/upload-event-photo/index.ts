import { serve } from 'https://deno.land/std/http/server.ts'
import { v2 as cloudinary } from 'cloudinary'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Buffer } from 'node:buffer'

// =========================================
// CLOUDINARY CONFIG
// =========================================

cloudinary.config({
  cloud_name: Deno.env.get(
    'CLOUDINARY_CLOUD_NAME'
  ),
  api_key: Deno.env.get(
    'CLOUDINARY_API_KEY'
  ),
  api_secret: Deno.env.get(
    'CLOUDINARY_API_SECRET'
  ),
})

// =========================================
// CORS
// =========================================

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
}

// =========================================
// EDGE FUNCTION
// =========================================

serve(async (req) => {
  // =========================================
  // HANDLE PREFLIGHT
  // =========================================

  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    })
  }

  try {
    // =========================================
    // ONLY ALLOW POST
    // =========================================

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({
          error: 'Method not allowed',
        }),
        {
          status: 405,
          headers: corsHeaders,
        }
      )
    }

    // =========================================
    // AUTHENTICATED CLIENT
    // =========================================

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      {
        global: {
          headers: {
            Authorization:
              req.headers.get(
                'Authorization'
              ) ?? '',
          },
        },
      }
    )

    // =========================================
    // GET CURRENT USER
    // =========================================

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return new Response(
        JSON.stringify({
          error: 'Unauthorized',
        }),
        {
          status: 401,
          headers: corsHeaders,
        }
      )
    }

    // =========================================
    // VERIFY ADMIN ROLE
    // =========================================

    const { data: member, error: memberError } =
      await supabase
        .from('members')
        .select('role')
        .eq('user_id', user.id)
        .single()

    if (memberError || !member) {
      return new Response(
        JSON.stringify({
          error: 'Member not found',
        }),
        {
          status: 404,
          headers: corsHeaders,
        }
      )
    }

    if (member.role !== 'admin') {
      return new Response(
        JSON.stringify({
          error:
            'Only admins can upload event photos',
        }),
        {
          status: 403,
          headers: corsHeaders,
        }
      )
    }

    // =========================================
    // PARSE FORM DATA
    // =========================================

    const formData = await req.formData()

    const file = formData.get('file') as File

    const eventId = formData.get(
      'eventId'
    ) as string

    if (!file || !eventId) {
      return new Response(
        JSON.stringify({
          error:
            'file and eventId are required',
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      )
    }

    // =========================================
    // OPTIONAL FILE VALIDATION
    // =========================================

    if (!file.type.startsWith('image/')) {
      return new Response(
        JSON.stringify({
          error: 'Only image files allowed',
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      )
    }

    // 5MB LIMIT
    const maxSize = 5 * 1024 * 1024

    if (file.size > maxSize) {
      return new Response(
        JSON.stringify({
          error:
            'Image size must be below 5MB',
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      )
    }

    // =========================================
    // CONVERT TO BASE64
    // =========================================

    const bytes = await file.arrayBuffer()

    const base64 = Buffer.from(bytes).toString(
      'base64'
    )

    // =========================================
    // UPLOAD TO CLOUDINARY
    // =========================================

    const result =
      await cloudinary.uploader.upload(
        `data:${file.type};base64,${base64}`,
        {
          public_id: `rccgy/events/${eventId}/banner`,

          overwrite: true,
          invalidate: true,

          resource_type: 'image',

          folder: 'rccgy/events',
        }
      )

    // =========================================
    // SUCCESS
    // =========================================

    return new Response(
      JSON.stringify({
        secure_url: result.secure_url,
        public_id: result.public_id,
        version: result.version,
      }),
      {
        status: 200,
        headers: corsHeaders,
      }
    )
  } catch (error) {
    console.error(
      'Error in upload-event-photo:',
      error
    )

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error',
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    )
  }
})