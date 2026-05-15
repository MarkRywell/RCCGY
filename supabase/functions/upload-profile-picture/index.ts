import { serve } from 'https://deno.land/std/http/server.ts'
import { v2 as cloudinary } from 'cloudinary'
import { Buffer } from 'node:buffer'

cloudinary.config({
  cloud_name: Deno.env.get('CLOUDINARY_CLOUD_NAME'),
  api_key: Deno.env.get('CLOUDINARY_API_KEY'),
  api_secret: Deno.env.get('CLOUDINARY_API_SECRET'),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({
          error: 'Method not allowed',
        }),
        {
          status: 405,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      )
    }

    const formData = await req.formData()

    const file = formData.get('file') as File
    const memberId = formData.get('memberId') as string

    if (!file || !memberId) {
      return new Response(
        JSON.stringify({
          error: 'file and memberId are required',
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      )
    }

    const bytes = await file.arrayBuffer()

    const base64 = Buffer.from(bytes).toString('base64')

    const result = await cloudinary.uploader.upload(
      `data:${file.type};base64,${base64}`,
      {
        public_id: `rccgy/members/${memberId}/profile`,
        overwrite: true,
        invalidate: true,
      }
    )

    return new Response(
      JSON.stringify({
        secure_url: result.secure_url,
        public_id: result.public_id,
        version: result.version,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Error in upload-profile-picture function:', error)
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }
})