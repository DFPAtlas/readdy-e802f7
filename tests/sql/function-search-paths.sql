-- Read-only smoke checks. Run on the intended project after this migration.
-- Expected: eight rows with pinned=true and six rows with passed=true.
SELECT p.oid::regprocedure::text AS signature,
       coalesce(p.proconfig @> ARRAY['search_path=""'], false) AS pinned
FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public' AND p.proname IN (
  'internal_set_updated_at', 'set_updated_at', 'handle_ticket_timestamps',
  'set_ticket_sla_state', 'ai_agents_prevent_parent_cycle',
  'bs_dfp_preflight_checks', 'bs_demo_hygiene_scan', 'compute_ticket_sla_state'
)
ORDER BY p.proname;

WITH cases(label, actual, expected) AS (VALUES
  ('resolved', public.compute_ticket_sla_state('resolved','normal',null,null,null,null,60,120), 'completed'),
  ('paused', public.compute_ticket_sla_state('open','normal',now(),null,null,null,60,120), 'paused'),
  ('no_due_date', public.compute_ticket_sla_state('open','normal',null,null,null,null,60,120), 'paused'),
  ('first_response_breached', public.compute_ticket_sla_state('open','normal',null,null,now()-interval '1 minute',null,60,120), 'first_response_breached'),
  ('resolution_breached', public.compute_ticket_sla_state('open','normal',null,now(),null,now()-interval '1 minute',60,120), 'resolution_breached'),
  ('on_track', public.compute_ticket_sla_state('open','normal',null,null,now()+interval '7 days',null,60,120), 'on_track')
)
SELECT label, actual, expected, actual = expected AS passed FROM cases;
