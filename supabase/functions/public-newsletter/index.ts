import { sendFormEmail } from "../_shared/send-form-email.ts";
import { emailPattern, publicFormBody, publicFormResponse, publicFormServices, siteUrl } from "../_shared/public-form-mail.ts";

const newsletterSegment = Deno.env.get("DFP_NEWSLETTER_SEGMENT_ID") || "9c39b053-d27f-4b0f-ab45-1fea3cd93563";

function resendContactRequest(apiKey: string, path: string, options: RequestInit = {}) {
  return fetch(`https://api.resend.com${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    signal: AbortSignal.timeout(8_000),
  });
}

async function addNewsletterSubscriber(apiKey: string, email: string): Promise<boolean> {
  const contactPath = `/contacts/${encodeURIComponent(email)}`;
  let lookup = await resendContactRequest(apiKey, contactPath);
  if (lookup.status === 404) {
    const created = await resendContactRequest(apiKey, "/contacts", {
      method: "POST",
      body: JSON.stringify({ email, segments: [{ id: newsletterSegment }] }),
    });
    if (created.ok) return true;
    lookup = await resendContactRequest(apiKey, contactPath);
  }
  if (!lookup.ok) throw new Error("Could not read newsletter contact");
  const contact = await lookup.json();
  if (contact.unsubscribed === true) return false;

  const added = await resendContactRequest(apiKey, `${contactPath}/segments/${newsletterSegment}`, { method: "POST" });
  if (added.ok) return true;
  const segments = await resendContactRequest(apiKey, `${contactPath}/segments`);
  const membership = segments.ok ? await segments.json() : null;
  if (Array.isArray(membership?.data) && membership.data.some((segment: { id: string }) => segment.id === newsletterSegment)) {
    return true;
  }
  throw new Error("Could not add contact to newsletter");
}

Deno.serve(async (request) => {
  const { allowed, headers, json } = publicFormResponse(request);
  if (!allowed) return json(403, { ok: false });
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (request.method !== "POST") return json(405, { ok: false });

  const body = await publicFormBody(request);
  if (!body) return json(400, { ok: false });
  const action = body.action;
  if (action !== "subscribe" && action !== "confirm") return json(400, { ok: false });

  const emailKey = Deno.env.get("RESEND_API_KEY");
  const contactsKey = Deno.env.get("RESEND_CONTACTS_API_KEY") || emailKey;
  if (!emailKey || !contactsKey) return json(503, { ok: false });

  try {
    const { admin, ip, hitLimit } = await publicFormServices(request);
    if (await hitLimit(`newsletter_${action}_net`, ip, 12)) return json(429, { ok: false });
    if (action === "subscribe") {
      const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
      if (email.length > 254 || !emailPattern.test(email) || body.marketingConsent !== true) {
        return json(400, { ok: false });
      }
      if (typeof body.websiteAlt === "string" && body.websiteAlt.trim()) return json(202, { ok: true });
      if (await hitLimit("newsletter_signup_email", email, 3)) return json(202, { ok: true });

      const segment = await resendContactRequest(contactsKey, `/segments/${newsletterSegment}`);
      if (!segment.ok) return json(503, { ok: false });
      const { data: token, error } = await admin.rpc("issue_newsletter_confirmation", { p_email: email });
      if (error) return json(503, { ok: false });
      if (typeof token === "string") {
        const sent = await sendFormEmail(emailKey, "Digital Footprint", email, "Confirm your newsletter subscription",
          `Confirm that you want to receive the Digital Footprint newsletter. This link expires in 24 hours.\n\n${siteUrl}/blog#newsletter-token=${token}\n\nIf you did not sign up, ignore this email.`,
          `newsletter-confirmation/${token.slice(0, 24)}`);
        if (!sent) return json(503, { ok: false });
      }
      return json(202, { ok: true });
    }

    const token = typeof body.token === "string" ? body.token : "";
    if (!/^[0-9a-f]{64}$/.test(token)) return json(400, { ok: false });
    const { data: signup, error } = await admin.rpc("confirm_newsletter_signup", { p_token: token }).maybeSingle<{
      email: string; confirmed_at: string; completed_at: string | null;
    }>();
    if (error) return json(503, { ok: false });
    if (!signup) return json(200, { ok: true, confirmed: false });
    if (!signup.completed_at) {
      const subscribed = await addNewsletterSubscriber(contactsKey, signup.email);
      if (subscribed) {
        const { error: leadError } = await admin.rpc("submit_lead", { p_payload: {
          name: "Newsletter Subscriber", email: signup.email, enquiry_type: "newsletter", source: "blog",
          consent_marketing: true, enquiry_data: { confirmed_at: signup.confirmed_at },
          idempotency_key: `newsletter:${signup.email}`,
        } });
        if (leadError && leadError.code !== "23505") throw new Error("Could not record newsletter consent in CRM");
      }
      if (!subscribed) return json(200, { ok: true, confirmed: false, unsubscribed: true });
      const { error: completedError } = await admin.from("newsletter_signups")
        .update({ completed_at: new Date().toISOString() }).eq("email", signup.email);
      if (completedError) throw new Error("Could not record newsletter subscription");
    }
    return json(200, { ok: true, confirmed: true });
  } catch {
    return json(503, { ok: false });
  }
});
