export async function sendFormEmail(apiKey: string, sender: string, to: string, subject: string, content: string, idempotencyKey: string) {
  const domain = Deno.env.get("RESEND_FROM_DOMAIN") || "digital-footprint.uk";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({ from: `${sender} <noreply@${domain}>`, to, subject, text: content }),
    signal: AbortSignal.timeout(10_000),
  });
  return response.ok;
}
