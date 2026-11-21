# Digital Footprint audit repairs — 21 November 2026

Repository: `DFPAtlas/readdy-e802f7`. Base: `0cdb32c821a10cdd8b71adc75432772f509f628a`. Branch: `fix/audit-repairs-20261121`.

## Outcome and limits

Implemented confirmed source, authorization, schema, payment and SEO repairs. The input audit was the 20 November live SEO crawl, not a complete authenticated/payment audit; additional repairs below are based on source inspection, linked-schema reads and regression tests.

**These changes are not deployed. The migration has not been applied to the hosted database.** No live payment, refund, price-ID change, destructive reset or production data update was performed. Strict TypeScript/build checking remains enabled. No type-error suppressions, `any` casts or lint-disable directives were added.

The website service CTA and six-part wizard were already correct in merged source. Their live mismatch needs publishing and response verification. The source returns real 404 responses locally; a live host that serves a fallback page with HTTP 200 still needs its routing corrected.

Supabase is accessed over HTTP in this app; no Prisma client, raw SQL interpolation or direct connection pool requiring repair was found in the reviewed payment paths. The generated database type file records schema, not customer data. The new migration must be applied before its matching functions are deployed.

## Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit` | PASS |
| `npm run lint` | PASS with 1,411 existing warnings; no errors |
| `npm run build` | PASS on Next.js 15.5.29 with the final locked dependencies |
| `npm test` | 37 PASS, including isolated SQL and signed Stripe webhook tests |
| `npm run test:http` | 20 PASS against the final patched production build |
| Deno typechecking | Six payment/status Edge Functions and reconciliation script PASS |
| `npm audit` (including dev dependencies) | PASS: zero known vulnerabilities |
| GitHub CI | TypeScript, lint and regression tests PASS; initial production builds failed because the public Supabase repository variables were empty. Workflows now also accept same-named secrets; otherwise configure the two settings and rerun. |
| Browser smoke suite | INCOMPLETE: Chromium could not start because the environment denied its process socket. The connected browser was unavailable and the remote browser could not reach workspace localhost. No interactive UAT pass is claimed. |
| Browser secret exposure scan | No `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` or `SUPABASE_SERVICE_ROLE_KEY` references in emitted browser JS |
| Literal internal link scan | No unmatched literal `href` routes found against the source route inventory; dynamic links/authenticated flows still need browser UAT |

The SQL tests use isolated PostgreSQL fixtures, not the entire production schema and trigger set. Auth tests exercise the middleware decisions with test clients; real password, magic-link, recovery and MFA sessions require staging UAT. No successful live Stripe payment test or public launch certification is claimed.

## File-by-file change log

### Phase 1 — Build, types and environment

| File | Repair |
|---|---|
| `.github/workflows/build-certification.yml` | Read public Supabase repository variables (or same-named secrets) and run the new payment/route tests. |
| `.github/workflows/stripe-pr-validation.yml` | Read public Supabase variables/secrets; use Node 22, required by the installed Supabase SDK. |
| `eslint.config.mjs` | Exclude generated Playwright reports and traces from source linting. |
| `next.config.ts` | Validate production auth configuration; redirect www and legacy social-image URLs; extend noindex headers. |
| `package-lock.json` | Lock security updates and test dependencies; update vulnerable tooling transitive dependencies. |
| `package.json` | Patch Next.js and matching ESLint config; add compatible cookie utilities and regression-test dependencies/scripts. |

### Phase 2 — Server authorization and session storage

| File | Repair |
|---|---|
| `lib/auth-storage.ts` | Migrate legacy local sessions into SSR-compatible cookie chunks; remove all chunks on sign-out. |
| `lib/route-access.ts` | Define protected prefixes and exact public auth paths. |
| `lib/supabase.ts` | Use typed storage and shared session cookies, retaining singleton browser behaviour and missing-config guards. |
| `middleware.ts` | Verify users server-side; enforce admin role/MFA, staff role and portal membership; preserve refresh cookies; prevent public-path redirect loops. |

### Phase 3 — Database integrity and schema types

| File | Repair |
|---|---|
| `supabase/functions/_shared/payment-database.ts` | Generate a schema subset from the actual linked database and type the additive RPCs/fields; fix relation/nullability inference. |
| `supabase/migrations/20261121005544_repair_stripe_atomicity_and_staff_roles.sql` | Add missing Checkout fields, service-only website receipt/refund ledgers, atomic payment/refund RPCs, recoverable event leases and staff authorization protection. Ensure logical payment/refund uniqueness. No existing rows are deleted. |

### Phase 4 — Stripe endpoints and reconciliation

| File | Repair |
|---|---|
| `app/checkout/CheckoutClient.tsx` | Generate a stable random guest-checkout request ID on submission. |
| `app/checkout/SubscriptionCheckout.tsx` | Reuse a random subscription request ID across retries. |
| `supabase/config.toml` | Keep public subscription Checkout/status endpoints reachable without gateway JWT redirects. |
| `supabase/functions/create-checkout/index.ts` | Use schema-typed ownership/customer lookup; validate object bodies; recover/reuse invoice sessions safely and permit a fresh session after expiry/refund reconciliation. |
| `supabase/functions/create-subscription-checkout/index.ts` | Validate the existing recurring price against the published plan; stop creating catalog entries during checkout; add stable request idempotency and object validation. |
| `supabase/functions/dfp-subscription-checkout-status/index.ts` | Verify subscription payment/status directly with Stripe; expose no customer details and grant no access from URL parameters. |
| `supabase/functions/dfp-website-checkout/index.ts` | Use an unguessable guest request ID instead of email alone to recover a checkout; validate object bodies. |
| `supabase/functions/milestone-checkout/index.ts` | Use schema-typed ownership/customer lookup, object-body validation nullable-project checks, expired-session recovery and prevention of charging an already paid/refunded milestone again. |
| `supabase/functions/stripe-webhook/index.ts` | Preserve raw-body signature verification; use claim leases and atomic RPCs; deduplicate logical payments; propagate DB failures; paginate refunds and refresh current Stripe resources for reconciliation. |
| `supabase/scripts/reconcile-website-payments.ts` | Default to dry-run; verify historical paid orders against Stripe before idempotent receipt/refund backfill. |

### Phase 5 — Client state, metadata, images and links

| File | Repair |
|---|---|
| `app/account/layout.tsx` | Apply an explicit noindex policy to this private, login, form or utility area. |
| `app/admin/layout.tsx` | Apply an explicit noindex policy to this private, login, form or utility area. |
| `app/auth/layout.tsx` | Apply an explicit noindex policy to this private, login, form or utility area. |
| `app/careers/[slug]/page.tsx` | Await route params and emit a self-canonical vacancy URL. |
| `app/careers/apply/[slug]/page.tsx` | Await route params and emit the application URL; inherit noindex from the application layout. |
| `app/careers/apply/layout.tsx` | Apply an explicit noindex policy to this private, login, form or utility area. |
| `app/careers/early-careers/layout.tsx` | Add route-specific public title, description, canonical and social metadata. |
| `app/careers/withdraw/layout.tsx` | Apply an explicit noindex policy to this private, login, form or utility area. |
| `app/case-studies/layout.tsx` | Add route-specific public title, description, canonical and social metadata. |
| `app/checkout/layout.tsx` | Apply an explicit noindex policy to this private, login, form or utility area. |
| `app/checkout/subscription-success/SubscriptionStatus.tsx` | Check server-verified Stripe status with bounded polling, cancellation and explicit unavailable/pending states. |
| `app/checkout/subscription-success/page.tsx` | Replace unconditional active-subscription claims with verified status; clarify that service starts after confirmation. |
| `app/cookie-policy/layout.tsx` | Add route-specific public title, description, canonical and social metadata. |
| `app/cookie-preferences/layout.tsx` | Apply an explicit noindex policy to this private, login, form or utility area. |
| `app/demos/ai-lead-system/page.tsx` | Provide stable OG/Twitter images for this demo page. |
| `app/demos/business-command-centre/page.tsx` | Provide stable OG/Twitter images for this demo page. |
| `app/demos/customer-portal/page.tsx` | Provide stable OG/Twitter images for this demo page. |
| `app/demos/guardianhub-preview/page.tsx` | Provide stable OG/Twitter images for this demo page. |
| `app/demos/layout.tsx` | Provide stable OG/Twitter images for demo metadata. |
| `app/demos/lethub-lettings-tour/page.tsx` | Provide stable OG/Twitter images for this demo page. |
| `app/demos/page.tsx` | Provide stable OG/Twitter images for this demo page. |
| `app/demos/quickguard-walkthrough/components/ClientDashboard.tsx` | Correct the nested demo heading to H2, retaining the page H1. |
| `app/demos/quickguard-walkthrough/page.tsx` | Provide stable OG/Twitter images for this demo page. |
| `app/demos/synqoro-event-demo/page.tsx` | Provide stable OG/Twitter images for this demo page. |
| `app/email/layout.tsx` | Apply an explicit noindex policy to this private, login, form or utility area. |
| `app/help/[category]/page.tsx` | Emit category-specific title, description and self-canonical URL. |
| `app/help/article/[slug]/page.tsx` | Emit article-specific title, description and self-canonical URL. |
| `app/help/layout.tsx` | Add route-specific public title, description, canonical and social metadata. |
| `app/industries/layout.tsx` | Add route-specific public title, description, canonical and social metadata. |
| `app/layout.tsx` | Use the static social image; remove inherited explicit index directives that conflict with noindex/not-found pages. |
| `app/login/layout.tsx` | Apply an explicit noindex policy to this private, login, form or utility area. |
| `app/opengraph-image.tsx` | Remove the generated-image route; retain legacy URL compatibility through redirects. |
| `app/partners/apply/layout.tsx` | Apply an explicit noindex policy to this private, login, form or utility area. |
| `app/partners/layout.tsx` | Add route-specific public title, description, canonical and social metadata. |
| `app/partners/referrals/layout.tsx` | Add route-specific public title, description, canonical and social metadata. |
| `app/partners/suppliers/layout.tsx` | Add route-specific public title, description, canonical and social metadata. |
| `app/partners/technology/layout.tsx` | Add route-specific public title, description, canonical and social metadata. |
| `app/pbx/layout.tsx` | Apply an explicit noindex policy to this private, login, form or utility area. |
| `app/portal/invoices/page.tsx` | Fix the functions URL/import-time env crash; reload when membership resolves; refresh DB state after returning from Stripe; omit untrusted amount/email fields. |
| `app/portal/layout.tsx` | Apply an explicit noindex policy to this private, login, form or utility area. |
| `app/privacy/layout.tsx` | Add route-specific public title, description, canonical and social metadata. |
| `app/products/guardianhub/layout.tsx` | Add route-specific public title, description, canonical and social metadata. |
| `app/products/layout.tsx` | Add route-specific public title, description, canonical and social metadata. |
| `app/products/lethub/layout.tsx` | Add route-specific public title, description, canonical and social metadata. |
| `app/products/quickguard/layout.tsx` | Add route-specific public title, description, canonical and social metadata. |
| `app/products/synqoro/layout.tsx` | Add route-specific public title, description, canonical and social metadata. |
| `app/request-demo/layout.tsx` | Add route-specific public title, description, canonical and social metadata. |
| `app/security/layout.tsx` | Add route-specific public title, description, canonical and social metadata. |
| `app/staff/layout.tsx` | Apply an explicit noindex policy to this private, login, form or utility area. |
| `app/support/layout.tsx` | Add route-specific public title, description, canonical and social metadata. |
| `app/support/request/layout.tsx` | Apply an explicit noindex policy to this private, login, form or utility area. |
| `app/support/status/layout.tsx` | Add route-specific public title, description, canonical and social metadata. |
| `app/terms/layout.tsx` | Add route-specific public title, description, canonical and social metadata. |
| `app/uat-testing/application-complete/layout.tsx` | Apply an explicit noindex policy to this private, login, form or utility area. |
| `app/uat-testing/apply/layout.tsx` | Apply an explicit noindex policy to this private, login, form or utility area. |
| `app/uat-testing/layout.tsx` | Add route-specific public title, description, canonical and social metadata. |
| `app/uat-testing/portal/layout.tsx` | Apply an explicit noindex policy to this private, login, form or utility area. |
| `app/uat-testing/terms/complete/layout.tsx` | Apply an explicit noindex policy to this private, login, form or utility area. |
| `app/uat-testing/terms/layout.tsx` | Apply an explicit noindex policy to this private, login, form or utility area. |
| `app/uat-testing/track/layout.tsx` | Apply an explicit noindex policy to this private, login, form or utility area. |
| `app/uat/layout.tsx` | Apply an explicit noindex policy to this private, login, form or utility area. |
| `components/JsonLdScript.tsx` | Render escaped JSON-LD in server HTML instead of injecting it only after mount. |
| `lib/seo.ts` | Add per-route canonicals, stable static social images and shared noindex metadata. |
| `public/og-image.png` | Render the existing brand card as a stable 1200×630 PNG asset. |
| `public/robots.txt` | Allow crawlers to read noindex directives; retain API crawl exclusion. |
| `public/sitemap.xml` | Include missing public services/pricing/wizard routes; exclude utility/login/completion URLs; remove unverified lastmod timestamps. |

### Regression tests

| File | Repair |
|---|---|
| `tests/checkout-validation.test.cjs` | Verify body/catalog validation, fixed quantity, existing-price reuse and guest request isolation. |
| `tests/route-security.test.cjs` | Verify server gates, public callbacks, MFA, forged-session rejection and cookie migration/removal. |
| `tests/smoke/audit-repairs.spec.mjs` | Add response-level SEO/404/image/redirect checks and a browser check for fabricated subscription success URLs. |
| `tests/stripe-database.test.cjs` | Run the additive SQL against an isolated PostgreSQL engine; verify atomic writes, duplicates, refunds, lease recovery, permissions and staff-role protection. |
| `tests/stripe-webhook.test.cjs` | Use real Stripe SDK signatures to verify raw-body handling, duplicate acknowledgement and retryable DB failures. |

This report, `docs/audit-repairs-2026-11-21.md`, is also added as the deployment and verification record.

## Manual actions and deployment order

1. Configure GitHub repository **Actions variables** `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` with the public URL/anon key for the intended DFP verification environment, or configure same-named Actions secrets. Empty configuration intentionally blocks the production build; CI cannot complete browser checks until these inputs are available. Both CI workflows now require them. Never use a service-role or Stripe secret in either variable. Use Node 22 for build/CI.
2. Test the migration on a representative isolated DFP database. Apply **only** `supabase/migrations/20261121005544_repair_stripe_atomicity_and_staff_roles.sql` to the intended project using its SQL editor, or the one-line PowerShell command below with a securely configured DFP connection string. The file has its own transaction. If pre-existing duplicate payment/refund identifiers prevent a unique index from being added, stop and investigate them; do not delete or merge financial records automatically. Do not run the historical migration directory wholesale or reset any database.

   ```powershell
   psql "$env:DFP_DATABASE_URL" -X -v ON_ERROR_STOP=1 -f supabase/migrations/20261121005544_repair_stripe_atomicity_and_staff_roles.sql
   ```

3. Deploy the six changed/new Edge Functions after the migration. The existing `supabase/config.toml` sets JWT verification appropriately. These commands use the inspected Supabase CLI v3 syntax; v2 uses different remote-target flags. The production project ref is `zjqftnkrmqhmbrtkvafy`.

   ```powershell
   supabase functions deploy create-checkout milestone-checkout --remote=zjqftnkrmqhmbrtkvafy
   ```

   ```powershell
   supabase functions deploy stripe-webhook dfp-website-checkout create-subscription-checkout dfp-subscription-checkout-status --remote=zjqftnkrmqhmbrtkvafy --no-verify-jwt
   ```

   The public endpoints validate their own inputs; `stripe-webhook` requires a valid Stripe signature. Protected invoice/milestone endpoints also verify the user inside the handler.

4. Confirm backend secrets `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` and `SITE_URL` are correct for the same environment/account. The Supabase-prefixed secrets are normally provisioned by the platform. Retain any existing UAT Connect keys/secrets. **The Digital Footprint Stripe account/mode and its deployed secrets were not independently verified.** No connected-account settings were changed.
5. Confirm the **existing** active price with lookup key `starter_plan_monthly` is GBP 2,000 minor units (£20), recurring monthly, interval count 1, per-unit billing. Checkout no longer creates Products/Prices on demand. Do not replace live/test price IDs blindly; if the catalogue is absent or different, review/configure it in the correct account before enabling checkout.
6. On the billing webhook destination `https://zjqftnkrmqhmbrtkvafy.supabase.co/functions/v1/stripe-webhook`, confirm snapshot events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, **`checkout.session.expired`**, `payment_intent.payment_failed`, `charge.refunded`. Retain existing UAT Connect account/capability/transfer events and thin-v2 destinations. This patch does not introduce a new subscription-entitlement product or a customer-portal API; subscription confirmation reads current verified Stripe state.
7. Reconcile historical website orders that were marked paid before a receipt insert failed. The script defaults to dry-run and verifies current Stripe payment and amount/currency/reference before writing. Run it with backend credentials for the **same DFP project and Stripe account**, never in a browser. It paginates orders, skips unverified payments, and returns nonzero for failures. Review the dry-run before adding `--apply`.

   ```powershell
   deno run --allow-env --allow-net --env-file=.env.edge.local --node-modules-dir=auto supabase/scripts/reconcile-website-payments.ts
   ```

   ```powershell
   deno run --allow-env --allow-net --env-file=.env.edge.local --node-modules-dir=auto supabase/scripts/reconcile-website-payments.ts --apply
   ```

8. Pull the approved source into the intended hosting release and publish. Verify Next.js middleware, redirects, headers and the new public asset are actually honored. The prior live crawl did not match merged source. Test www redirection, private noindex and unknown-path HTTP 404 on the deployed host; local success alone does not establish hosting parity. If the publish target ignores Next.js server middleware, protected-page server checks must be deployed on a supported Next.js runtime before release.
9. Run browser UAT and Stripe test-mode acceptance below. Keep this work in draft until those checks and deployment parity are verified.

## Exact verification commands

From the repository root, with Node 22 and the public Supabase env vars configured:

```powershell
npm ci
```

```powershell
npx tsc --noEmit
```

```powershell
npm run lint
```

```powershell
npm test
```

```powershell
npm run build
```

```powershell
npm run test:http
```

```powershell
npm audit
```

On a machine that permits a browser to launch:

```powershell
npx playwright install chromium
```

```powershell
npm run test:smoke
```

The payment Edge Functions are Deno code and intentionally excluded from the frontend TypeScript project. Typecheck them separately:

```powershell
deno check --node-modules-dir=auto --no-lock supabase/functions/create-checkout/index.ts supabase/functions/milestone-checkout/index.ts supabase/functions/stripe-webhook/index.ts supabase/functions/dfp-website-checkout/index.ts supabase/functions/create-subscription-checkout/index.ts supabase/functions/dfp-subscription-checkout-status/index.ts supabase/scripts/reconcile-website-payments.ts
```

This workspace verified identical copies of those source files with the exact pinned npm SDKs in a separate tooling directory because Deno's direct registry download was unavailable; no source types were suppressed.

### Stripe listener and test flows

Use an isolated DFP test database with the relevant schema plus this migration. Use the existing safe local-stack/restore procedure; do not run `db reset` or bulk-apply legacy SQL. Point the test frontend and local function configuration to that same database. Configure a **test-mode** Stripe CLI account and `sk_test_...` backend secret; no live card is needed for these checks.

In one terminal:

```powershell
stripe listen --forward-to http://127.0.0.1:54321/functions/v1/stripe-webhook --events checkout.session.completed,checkout.session.async_payment_succeeded,checkout.session.expired,payment_intent.payment_failed,charge.refunded
```

Put the listener's emitted `whsec_...` into the **local test** function env file as `STRIPE_WEBHOOK_SECRET`, retaining the production secret unchanged. In another terminal:

```powershell
supabase functions serve --env-file .env.edge.test.local --no-verify-jwt
```

Then exercise the real app checkout against Stripe test mode. Generic `stripe trigger` fixtures do not contain the invoice/order metadata required for DFP reconciliation, so they do not replace app-created checkout tests.

| Flow | Expected result |
|---|---|
| Guest website checkout, Launch/Growth/Commerce | Server charges the published 50% amount; repeated submission reuses the same logical request; another request with only the same email cannot recover it. |
| Tampered package/amount/quantity/customer IDs | Invalid package rejected; server catalog/DB amount and fixed quantity win; no client-provided Stripe customer ID is trusted. |
| Invoice/milestone with no session or another user's record | 401/403; no Stripe customer/session is created. |
| Successful invoice payment | One successful payment; zero outstanding; a second event ID for the same PaymentIntent does not add another payment. |
| Invoice session expires or invoice is refunded | Expired session can be replaced; a completed unreconciled payment cannot be charged again; after a verified refund the outstanding amount may be paid with a new session. |
| Successful website deposit | One receipt and paid order state commit atomically. |
| Repeat the same event; replay async-success after completed | Acknowledged without a duplicate payment. Use Stripe Dashboard resend in the test destination; verify ledger/receipt counts and balances. |
| Database failure, including receipt insert failure | Webhook returns 500; retry can complete; no orphan paid state from a failed transaction. |
| Refund before payment success; then retry; repeat refund | First delivery retries; eventual one refund/balance adjustment; no duplicate deduction. |
| Partial/full website or milestone refund; late success event | Refunded amounts/status do not regress or reset to paid. |
| Missing/wrong signature | 400; no privileged database mutation. |
| Interrupted webhook invocation | Retry after the five-minute lease can reclaim the event; active duplicate delivery requests retry. |
| Starter subscription Checkout | Existing validated £20 monthly price, quantity 1; a retry uses the same idempotency key. |
| Fabricated `/checkout/subscription-success?session_id=...` | No active-subscription claim; no access or entitlement granted from navigation. |

### Browser and deployment acceptance

- Sign in/out for admin, staff, portal and UAT; verify password recovery, existing magic links and MFA setup/challenge. Confirm legacy local sessions migrate and logout clears the server session. Try unauthorized roles, inactive staff and a forged cookie; server access must fail before protected content renders.
- Navigate directly and through client-side links to protected pages, including invoice routes. Test refreshed/expired sessions and page prefetches. Public login, auth callback, health and Stripe callback routes must remain reachable.
- Open the website service page, follow **Plan Your Website**, complete/review/edit all six parts, and verify the existing mocked submission/error-retry tests before making a real authorized submission.
- Return from invoice checkout while delaying webhook delivery. The UI must refresh from DB state and show paid only after the verified server update.
- Check desktop/mobile forms and demos, browser console hydration/runtime errors, cookie consent and analytics. The existing Playwright suite covers these routes; it still requires a browser-capable runner.
- On the live host, fetch `/og-image.png` and both legacy image paths, `/robots.txt`, `/sitemap.xml`, `/contact?utm_source=check`, login/private entry pages and a nonexistent URL. Expect a decodable PNG, correct self-canonicals/noindex, www 308, real 404 and the published wizard. Submit/inspect representative URLs in Search Console after deployment.

## References

- [Next.js 15.5.29 security release](https://github.com/vercel/next.js/releases/tag/v15.5.29)
- [Supabase server-side session guidance](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Stripe webhook verification, ordering and retries](https://docs.stripe.com/webhooks)
- [Next.js not-found response behaviour](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)
