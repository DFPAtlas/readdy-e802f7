-- DFP CLIENT PORTAL — Invitation acceptance, last-login tracking and access-gate resolution
-- Additive and idempotent. Extends Prompt 01/02 without weakening existing RLS.
-- All functions are SECURITY DEFINER and self-scoped to auth.uid(); they never accept
-- a client id or membership id from the caller, so cross-tenant access is impossible.

-- ---------------------------------------------------------------------------
-- 1. Reason-aware membership resolver (replaces Prompt 01's resolver in place).
--    Keeps the exact same happy-path shape (has_access, client_id, access_role,
--    membership_id) and adds a `reason` field only when access is denied, so the
--    portal gate can render the right branded screen.
-- ---------------------------------------------------------------------------
create or replace function public.get_active_portal_membership()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_user_id uuid := auth.uid();
  v_access_id uuid;
  v_client_id uuid;
  v_access_role text;
  v_reason text := 'none';
begin
  if v_user_id is null then
    return jsonb_build_object('has_access', false, 'reason', 'unauthenticated');
  end if;

  -- Primary membership path: portal_access (non-revoked, unexpired, active client).
  select pa.id, pa.client_id, pa.access_role
    into v_access_id, v_client_id, v_access_role
  from public.portal_access pa
  where pa.user_id = v_user_id
    and coalesce(pa.is_revoked, false) = false
    and (pa.expires_at is null or pa.expires_at > now())
    and pa.invitation_state in ('pending','sent','accepted')
    and exists (
      select 1 from public.clients c
      where c.id = pa.client_id
        and c.status = 'active'
        and c.archived_at is null
        and c.offboarding_state is null
    )
  order by
    case pa.invitation_state when 'accepted' then 0 else 1 end,
    pa.created_at desc
  limit 1;

  if v_access_id is not null then
    return jsonb_build_object(
      'has_access', true,
      'client_id', v_client_id,
      'access_role', coalesce(v_access_role, 'viewer'),
      'membership_id', v_access_id
    );
  end if;

  -- Legacy fallback: previously linked clients.user_id (temporary compatibility).
  select c.id
    into v_client_id
  from public.clients c
  where c.user_id = v_user_id
    and c.status = 'active'
    and c.archived_at is null
    and c.offboarding_state is null
  order by c.updated_at desc
  limit 1;

  if v_client_id is not null then
    return jsonb_build_object(
      'has_access', true,
      'client_id', v_client_id,
      'access_role', 'viewer',
      'membership_id', null
    );
  end if;

  -- Determine the most specific denial reason (do not reveal other clients).
  select pa.id
    into v_access_id
  from public.portal_access pa
  where pa.user_id = v_user_id
    and coalesce(pa.is_revoked, false) = true
  order by pa.updated_at desc
  limit 1;
  if v_access_id is not null then
    return jsonb_build_object('has_access', false, 'reason', 'revoked');
  end if;

  select pa.id
    into v_access_id
  from public.portal_access pa
  where pa.user_id = v_user_id
    and coalesce(pa.is_revoked, false) = false
    and pa.expires_at is not null
    and pa.expires_at <= now()
  order by pa.updated_at desc
  limit 1;
  if v_access_id is not null then
    return jsonb_build_object('has_access', false, 'reason', 'expired');
  end if;

  select pa.id
    into v_access_id
  from public.portal_access pa
  where pa.user_id = v_user_id
    and coalesce(pa.is_revoked, false) = false
    and exists (
      select 1 from public.clients c
      where c.id = pa.client_id
        and (c.status <> 'active' or c.archived_at is not null or c.offboarding_state is not null)
    )
  limit 1;
  if v_access_id is not null then
    return jsonb_build_object('has_access', false, 'reason', 'inactive_client');
  end if;

  return jsonb_build_object('has_access', false, 'reason', 'none');
end;
$function$;

revoke all on function public.get_active_portal_membership() from public;
revoke all on function public.get_active_portal_membership() from anon;
grant execute on function public.get_active_portal_membership() to authenticated;

-- ---------------------------------------------------------------------------
-- 2. record_portal_login — called once after a successful authenticated portal
--    entry. Marks a pending/sent invitation accepted (with audit), sets
--    accepted_at, and always touches last_login_at. Self-scoped to auth.uid().
-- ---------------------------------------------------------------------------
create or replace function public.record_portal_login()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_user_id uuid := auth.uid();
  v_access_id uuid;
  v_client_id uuid;
  v_access_role text;
  v_state text;
  v_now timestamptz := now();
begin
  if v_user_id is null then
    return jsonb_build_object('ok', false);
  end if;

  select pa.id, pa.client_id, pa.access_role, pa.invitation_state
    into v_access_id, v_client_id, v_access_role, v_state
  from public.portal_access pa
  where pa.user_id = v_user_id
    and coalesce(pa.is_revoked, false) = false
    and (pa.expires_at is null or pa.expires_at > v_now)
    and pa.invitation_state in ('pending','sent','accepted')
    and exists (
      select 1 from public.clients c
      where c.id = pa.client_id
        and c.status = 'active'
        and c.archived_at is null
        and c.offboarding_state is null
    )
  order by
    case pa.invitation_state when 'accepted' then 0 else 1 end,
    pa.created_at desc
  limit 1;

  if v_access_id is null then
    return jsonb_build_object('ok', false);
  end if;

  if v_state in ('pending','sent') then
    update public.portal_access
      set invitation_state = 'accepted',
          accepted_at = coalesce(accepted_at, v_now),
          last_login_at = v_now,
          updated_at = v_now
    where id = v_access_id;

    update public.clients
      set portal_access_state = 'active',
          updated_at = v_now
    where id = v_client_id;

    insert into public.operational_audit_events
      (event_type, entity_type, entity_id, actor_user_id, safe_metadata, created_at)
    values
      ('portal.access_accepted', 'portal_access', v_access_id, v_user_id,
       jsonb_build_object('client_id', v_client_id, 'result', 'accepted'),
       v_now);
  else
    update public.portal_access
      set last_login_at = v_now,
          updated_at = v_now
    where id = v_access_id;
  end if;

  return jsonb_build_object(
    'ok', true,
    'client_id', v_client_id,
    'access_role', coalesce(v_access_role, 'viewer'),
    'membership_id', v_access_id
  );
end;
$function$;

revoke all on function public.record_portal_login() from public;
revoke all on function public.record_portal_login() from anon;
grant execute on function public.record_portal_login() to authenticated;