import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { email, name, slug } = await req.json();

  const adminSupabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data, error } =
    await adminSupabase.auth.admin.inviteUserByEmail(email);

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 400 });
  }

  await adminSupabase.from("members").insert({
    user_id: data.user.id,
    name,
    slug,
    role: "member",
  });

  return new Response(
    JSON.stringify({ success: true }),
    { headers: corsHeaders }
  );
});