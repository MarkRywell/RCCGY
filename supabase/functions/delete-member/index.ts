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
  // CORS
  // =========================================

  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    // =========================================
    // AUTHENTICATED CALLER CLIENT
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
    // VERIFY CALLER IS ADMIN
    // =========================================

    const { data: callerMember } =
      await callerSupabase
        .from("members")
        .select("role")
        .eq("user_id", user.id)
        .single();

    if (callerMember?.role !== "admin") {
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
    // REQUEST BODY
    // =========================================

    const { user_id } = await req.json();

    if (!user_id) {
      return new Response(
        JSON.stringify({
          error: "user_id is required",
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // =========================================
    // PREVENT SELF DELETE
    // =========================================

    if (user_id === user.id) {
      return new Response(
        JSON.stringify({
          error: "You cannot delete yourself",
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // =========================================
    // ADMIN CLIENT
    // =========================================

    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // =========================================
    // GET TARGET MEMBER
    // =========================================

    const { data: targetMember } =
      await adminSupabase
        .from("members")
        .select("role")
        .eq("id", user_id)
        .single();

    console.log("Target member:", user_id, targetMember);

    if (!targetMember) {
      return new Response(
        JSON.stringify({
          error: "Member not found",
        }),
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    // =========================================
    // PREVENT DELETING LAST ADMIN
    // =========================================

    if (targetMember.role === "admin") {
      const { count } = await adminSupabase
        .from("members")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("role", "admin");

      if ((count ?? 0) <= 1) {
        return new Response(
          JSON.stringify({
            error:
              "Cannot delete the last admin",
          }),
          {
            status: 400,
            headers: corsHeaders,
          }
        );
      }
    }

    // =========================================
    // DELETE AUTH USER
    // =========================================
    // members row auto-deletes via
    // ON DELETE CASCADE
    // =========================================


    // Check if member has user_id value before attempting to delete auth user
    if (!targetMember.user_id) {

      await adminSupabase
        .from("members")
        .delete()
        .eq("id", user_id);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Member deleted, but no associated auth user to delete.",
        }),
        {
          status: 200,
          headers: corsHeaders,
        }
      );
    }

    const { error: deleteError } =
      await adminSupabase.auth.admin.deleteUser(
        user_id
      );

    if (deleteError) {
      return new Response(
        JSON.stringify({
          error: deleteError.message,
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // =========================================
    // SUCCESS
    // =========================================

    return new Response(
      JSON.stringify({
        success: true,
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