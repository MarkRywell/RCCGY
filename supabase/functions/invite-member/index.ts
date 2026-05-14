import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

serve(async (req: Request) => {
  // =========================================
  // HANDLE CORS PREFLIGHT
  // =========================================
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    // =========================================
    // CREATE CLIENT USING CALLER SESSION
    // =========================================
    const callerSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        global: {
          headers: {
            Authorization:
              req.headers.get("Authorization") ?? "",
          },
        },
      }
    );

    // =========================================
    // GET AUTHENTICATED USER
    // =========================================
    const {
      data: { user },
      error: authError,
    } = await callerSupabase.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized",
        }),
        {
          status: 401,
          headers: corsHeaders,
        }
      );
    }

    // =========================================
    // VERIFY ADMIN ROLE
    // =========================================
    const { data: member, error: memberError } =
      await callerSupabase
        .from("members")
        .select("role")
        .eq("user_id", user.id)
        .single();

    if (memberError || !member) {
      return new Response(
        JSON.stringify({
          error: "Member profile not found",
        }),
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    if (member.role !== "admin") {
      return new Response(
        JSON.stringify({
          error: "Forbidden",
        }),
        {
          status: 403,
          headers: corsHeaders,
        }
      );
    }

    // =========================================
    // PARSE REQUEST BODY
    // =========================================
    const { email, name, slug } = await req.json();

    // =========================================
    // BASIC VALIDATION
    // =========================================
    if (!email || !email.includes("@")) {
      return new Response(
        JSON.stringify({
          error: "Invalid email",
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    if (!name || name.trim().length < 2) {
      return new Response(
        JSON.stringify({
          error: "Invalid name",
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    if (!slug || slug.trim().length < 2) {
      return new Response(
        JSON.stringify({
          error: "Invalid slug",
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // =========================================
    // CREATE ADMIN CLIENT
    // =========================================
    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // =========================================
    // CHECK FOR DUPLICATE SLUG
    // =========================================
    const { data: existingSlug } = await adminSupabase
      .from("members")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existingSlug) {
      return new Response(
        JSON.stringify({
          error: "Slug already exists",
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // =========================================
    // CHECK FOR DUPLICATE EMAIL
    // =========================================
    const {
      data: { users },
    } = await adminSupabase.auth.admin.listUsers();

    const existingUser = users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      return new Response(
        JSON.stringify({
          error: "Email already exists",
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // =========================================
    // SEND INVITE EMAIL
    // =========================================
    const { data, error: inviteError } =
      await adminSupabase.auth.admin.inviteUserByEmail(
        email,
        {
          redirectTo: `${
            Deno.env.get("PUBLIC_SITE_URL") ??
            "http://localhost:5173"
          }/set-password`,
        }
      );

    if (inviteError || !data.user) {
      return new Response(
        JSON.stringify({
          error:
            inviteError?.message ??
            "Failed to invite user",
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // =========================================
    // CREATE MEMBER PROFILE
    // =========================================
    const { error: insertError } =
      await adminSupabase.from("members").insert({
        user_id: data.user.id,
        email,
        name,
        slug,
        role: "member",
      });

    if (insertError) {
      return new Response(
        JSON.stringify({
          error: insertError.message,
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // =========================================
    // SUCCESS RESPONSE
    // =========================================
    return new Response(
      JSON.stringify({
        success: true,
        invitedUserId: data.user.id,
      }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});