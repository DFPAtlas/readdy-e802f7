import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function corsHeaders(origin: string | null): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

function generateTempPassword(): string {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const arr = new Uint8Array(12);
  crypto.getRandomValues(arr);
  let pwd = "";
  for (const n of arr) pwd += chars[n % chars.length];
  return `Dfp-${pwd}!`;
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(origin) });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401,
        headers: corsHeaders(origin),
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: authUser, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !authUser?.user) {
      return new Response(JSON.stringify({ error: "Invalid authentication" }), {
        status: 401,
        headers: corsHeaders(origin),
      });
    }

    const callerId = authUser.user.id;
    const { data: callerProfile } = await supabaseAdmin
      .from("admin_profiles")
      .select("role, active")
      .eq("id", callerId)
      .eq("active", true)
      .maybeSingle();

    if (!callerProfile || !["owner", "super_admin", "admin"].includes(callerProfile.role)) {
      return new Response(JSON.stringify({ error: "You do not have permission to create tester accounts" }), {
        status: 403,
        headers: corsHeaders(origin),
      });
    }

    const body = await req.json();
    const rawEmail = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!rawEmail || !rawEmail.includes("@")) {
      return new Response(JSON.stringify({ error: "A valid email is required" }), {
        status: 400,
        headers: corsHeaders(origin),
      });
    }

    const providedPassword = typeof body?.password === "string" && body.password.length >= 8 ? body.password : null;
    const passwordToUse = providedPassword || generateTempPassword();
    const tempPassword = providedPassword ? null : passwordToUse;

    let userId: string | null = null;
    let createdAccount = false;

    const { data: createdUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: rawEmail,
      password: passwordToUse,
      email_confirm: true,
    });

    if (createError) {
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existing = existingUsers?.users?.find((u: any) => (u.email || "").toLowerCase() === rawEmail);
      if (existing) {
        userId = existing.id;
      } else {
        return new Response(JSON.stringify({ error: createError.message || "Failed to create account" }), {
          status: 500,
          headers: corsHeaders(origin),
        });
      }
    } else {
      userId = createdUser.user.id;
      createdAccount = true;
    }

    const { data: application } = await supabaseAdmin
      .from("uat_tester_applications")
      .select("legal_name, display_name, email, town_city, country, experience_level")
      .ilike("email", rawEmail)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const fullName = application?.legal_name || application?.display_name || rawEmail;

    const { data: existingProfile } = await supabaseAdmin
      .from("uat_testers")
      .select("id")
      .ilike("email", rawEmail)
      .limit(1)
      .maybeSingle();

    if (existingProfile) {
      await supabaseAdmin.from("uat_testers").update({
        user_id: userId,
        full_name: fullName,
        status: "active",
        updated_at: new Date().toISOString(),
      }).eq("id", existingProfile.id);
    } else {
      await supabaseAdmin.from("uat_testers").insert({
        user_id: userId,
        full_name: fullName,
        email: rawEmail,
        display_name: application?.display_name || null,
        town_city: application?.town_city || null,
        country: application?.country || "United Kingdom",
        experience_level: application?.experience_level || "beginner",
        status: "active",
      });
    }

    return new Response(JSON.stringify({
      message: createdAccount
        ? "Login account and active tester profile created"
        : "Login account already existed — tester profile linked and activated",
      user_id: userId,
      email: rawEmail,
      password: tempPassword,
    }), { status: 200, headers: corsHeaders(origin) });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: corsHeaders(origin),
    });
  }
});
