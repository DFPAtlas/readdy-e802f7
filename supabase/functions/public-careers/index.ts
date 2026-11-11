import { sendFormEmail } from "../_shared/send-form-email.ts";
import { emailPattern, publicFormBody, publicFormResponse, publicFormServices, siteUrl } from "../_shared/public-form-mail.ts";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type WithdrawalLink = {
  token: string;
  vacancy_title: string | null;
  submitted_at: string | null;
};

Deno.serve(async (request) => {
  const { allowed, headers, json } = publicFormResponse(request);
  if (!allowed) return json(403, { ok: false });
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (request.method !== "POST") return json(405, { ok: false });

  const body = await publicFormBody(request);
  if (!body) return json(400, { ok: false });
  const action = body.action;
  if (action !== "request" && action !== "withdraw" && action !== "receipt") return json(400, { ok: false });

  try {
    const { admin, ip, hitLimit } = await publicFormServices(request);
    if (await hitLimit(`careers_${action}_net`, ip, 12)) return json(429, { ok: false });

    if (action === "withdraw") {
      const token = typeof body.token === "string" ? body.token : "";
      if (!/^[0-9a-f]{64}$/.test(token)) return json(400, { ok: false });
      const { data, error } = await admin.rpc("redeem_career_withdrawal_link", { p_token: token });
      if (error) return json(503, { ok: false });
      return json(200, { ok: true, withdrawn: data === true });
    }

    const emailKey = Deno.env.get("RESEND_API_KEY");
    if (!emailKey) return json(503, { ok: false });
    if (action === "receipt") {
      const applicationId = typeof body.applicationId === "string" ? body.applicationId : "";
      if (!uuidPattern.test(applicationId)) return json(400, { ok: false });
      const { data: app, error } = await admin.from("career_applications")
        .select("candidate_email").eq("id", applicationId)
        .gte("submitted_at", new Date(Date.now() - 15 * 60 * 1000).toISOString())
        .maybeSingle();
      if (error) return json(503, { ok: false });
      if (app && !(await hitLimit("careers_receipt_email", app.candidate_email.toLowerCase(), 3))) {
        const sent = await sendFormEmail(emailKey, "Digital Footprint Careers", app.candidate_email, "Digital Footprint application received",
          `Thank you for applying. The careers team has received your application.\n\nTo request a withdrawal link, visit ${siteUrl}/careers/withdraw.`,
          `career-receipt/${applicationId}`);
        if (!sent) return json(503, { ok: false });
      }
      return json(202, { ok: true });
    }

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (email.length > 254 || !emailPattern.test(email)) return json(400, { ok: false });
    if (typeof body.websiteAlt === "string" && body.websiteAlt.trim()) return json(202, { ok: true });
    if (await hitLimit("careers_request_email", email, 3)) return json(202, { ok: true });

    const { data: links, error } = await admin.rpc("issue_career_withdrawal_links", { p_email: email });
    if (error) return json(503, { ok: false });
    const issued = (links ?? []) as WithdrawalLink[];
    if (issued.length > 0) {
      const body = issued.map(({ token, vacancy_title, submitted_at }) => {
        const title = vacancy_title || "Digital Footprint application";
        const date = submitted_at ? ` (submitted ${new Date(submitted_at).toLocaleDateString("en-GB", { timeZone: "Europe/London" })})` : "";
        return `${title}${date}\n${siteUrl}/careers/withdraw#token=${token}`;
      }).join("\n\n");
      try {
        const sent = await sendFormEmail(emailKey, "Digital Footprint Careers", email, "Confirm your application withdrawal",
          `Choose the application you want to withdraw below, then confirm on the website. These links expire in 30 minutes.\n\n${body}\n\nIf you did not request this, you can ignore this email.`,
          `career-withdrawal/${crypto.randomUUID()}`);
        if (!sent) console.error("Career withdrawal email rejected by provider");
      } catch {
        console.error("Career withdrawal email provider unavailable");
      }
    }
    return json(202, { ok: true });
  } catch {
    return json(503, { ok: false });
  }
});
