# Function search-path repair — 31 October 2026

Scope: Digital Footprint's shared Supabase project, `zjqftnkrmqhmbrtkvafy`.

Migration `20261031131912_dfp_pin_remaining_function_search_paths.sql` was applied live on 31 October 2026. The source filename matches the actual server migration-history version. Do not manually reapply it to that project.

Eight functions flagged by the live security advisor now have `search_path = ''`. Their tables and application functions were already schema-qualified. All eight retain their prior SECURITY INVOKER setting, function-body hashes and EXECUTE ACLs. No table policies, function ownership or business logic changed.

Verification after applying:

- Security Advisor mutable-search-path findings: 8 → 0.
- Catalog comparison: 8/8 paths pinned; all body hashes, SECURITY flags and ACLs unchanged.
- Six read-only SLA cases passed: resolved, paused, missing due dates, first-response breach, resolution breach and on-track.
- Both Both-Sides diagnostic functions rejected a call without an application identity with their existing `insufficient_privilege` exception. This is a guard smoke check, not signed-in or cross-tenant certification.
- A proposed temporary-table trigger fixture test was not executed because its tool confirmation expired. No temporary fixture test is claimed as passed. Timestamp/cycle trigger bodies and their trigger attachments were inspected, but write-path behavior still needs application testing.

The UAT submission migration `20260915080215` is already present; it was not reapplied. The deployed UAT sandbox email function still contains the old signing fallback: the PR #7 Edge Function changes still require deployment and secret configuration verification.

Remaining advisor findings are separate work: 176 anon-callable and 239 authenticated-callable SECURITY DEFINER functions require per-function authorization review; 40 RLS-without-policy entries are informational and may be intentional service-only tables; pg_net schema placement and leaked-password protection also remain. These inventory counts do not prove every function is exploitable.

Reference: https://supabase.com/docs/guides/observability/advisors?queryGroups=lint&lint=0011_function_search_path_mutable

Rollback, if a confirmed regression requires it: use ALTER FUNCTION with each exact signature from the migration followed by RESET search_path. This restores the prior unset configuration and reintroduces the warnings; it should not be performed routinely.
