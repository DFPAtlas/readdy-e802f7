# Secrets Reminder

Keep all real secret values out of `.env` and out of the browser.

## What belongs where

- **Supabase URL** and **Supabase anon/publishable key** — safe in `.env`. These are public by design and their power is limited by Row Level Security.
- **Stripe keys, Resend API key, service role key, AI provider keys, webhook secrets** — never in `.env` or any client code. Store them as Supabase edge-function secrets and read them with the "grab from environment" call inside edge functions only.

## Rule of thumb

If a value is secret, it lives in the Supabase Dashboard as an edge-function secret — never in `.env`, never in a committed file, never in browser-facing code.