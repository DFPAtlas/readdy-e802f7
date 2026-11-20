-- Pin the eight functions flagged by the live security advisor.
-- Their application tables/functions are schema-qualified. Preserve bodies,
-- SECURITY INVOKER semantics, ownership and existing EXECUTE grants.
ALTER FUNCTION public.internal_set_updated_at() SET search_path = '';
ALTER FUNCTION public.set_updated_at() SET search_path = '';
ALTER FUNCTION public.handle_ticket_timestamps() SET search_path = '';
ALTER FUNCTION public.set_ticket_sla_state() SET search_path = '';
ALTER FUNCTION public.ai_agents_prevent_parent_cycle() SET search_path = '';
ALTER FUNCTION public.bs_dfp_preflight_checks() SET search_path = '';
ALTER FUNCTION public.bs_demo_hygiene_scan() SET search_path = '';
ALTER FUNCTION public.compute_ticket_sla_state(text, text, timestamptz, timestamptz, timestamptz, timestamptz, integer, integer) SET search_path = '';
