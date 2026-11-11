import { createClient } from "npm:@supabase/supabase-js@2.110.8";

export const siteUrl = "https://digital-footprint.uk";
export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedOrigins = new Set([siteUrl, "https://www.digital-footprint.uk"]);

export function publicFormResponse(request: Request) {
  const origin = request.headers.get("origin");
  const allowed = !!origin && allowedOrigins.has(origin);
  const headers = new Headers({ "Cache-Control": "no-store", Vary: "Origin" });
  if (allowed && origin) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "authorization, x-client-info, apikey, content-type");
  }
  return { allowed, headers, json: (status: number, body: Record<string, unknown>) => Response.json(body, { status, headers }) };
}

export async function publicFormBody(request: Request): Promise<Record<string, unknown> | null> {
  if (Number(request.headers.get("content-length")) > 4096) return null;
  try {
    const rawBody = await request.text();
    if (rawBody.length > 4096) return null;
    const value: unknown = JSON.parse(rawBody);
    return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

export async function publicFormServices(request: Request) {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const pepper = Deno.env.get("TICKET_HASH_PEPPER");
  if (!url || !serviceKey || !pepper) throw new Error("Form service unavailable");

  const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: site, error } = await admin.from("internal_support_sites")
    .select("id").eq("site_slug", "digital-footprint").eq("is_active", true).single();
  if (error || !site) throw new Error("Form site unavailable");

  const siteId = site.id;
  const encoder = new TextEncoder();
  const hashKey = await crypto.subtle.importKey(
    "raw", encoder.encode(pepper), { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const ip = request.headers.get("cf-connecting-ip")
    ?? request.headers.get("x-real-ip")
    ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? "unknown";

  async function hitLimit(bucket: string, subject: string, max: number) {
    const signature = await crypto.subtle.sign("HMAC", hashKey, encoder.encode(subject));
    const subjectHash = Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
    const window = 15 * 60 * 1000;
    const { data, error } = await admin.rpc("internal_ticket_rate_limit_hit", {
      p_site_id: siteId, p_bucket: bucket, p_subject_hash: subjectHash,
      p_window_start: new Date(Math.floor(Date.now() / window) * window).toISOString(), p_max: max,
    });
    if (error || typeof data?.count !== "number") throw new Error("Rate limit unavailable");
    return data.count > max;
  }

  return { admin, ip, hitLimit };
}
