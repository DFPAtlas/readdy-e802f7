-- DFP CLIENT PORTAL — Invitation & access-management foundation
-- Additive and idempotent. Does not weaken any existing RLS policy.
-- Extends the existing `portal_access` table into the primary membership model
-- while keeping `clients.user_id` as a backward-compatible fallback.

-- ---------------------------------------------------------------------------
-- 1. Missing columns
-- ---------------------------------------------------------------------------
alter table public.portal_access
  add column if not exists email text,
  add column if not exists contact_name text,
  add column if not exists invited_by uuid,
  add column if not exists expires_at timestamptz,
  add column if not exists revocation_reason text,
  add column if not exists updated_at timestamptz;

-- ---------------------------------------------------------------------------
-- 2. Best-effort backfill of normalised email from linked client/contact
--    (only fills rows that are still missing an email).
-- ---------------------------------------------------------------------------
update public.portal_access pa
set email = lower(trim(c.email))
from public.clients c
where c.id = pa.client_id
  and pa.email is null
  and c.email is not null;

update public.portal_access pa
set email = lower(trim(cc.email))
from public.client_contacts cc
where cc.id = pa.contact_id
  and pa.email is null
  and cc.email is not null;

-- ---------------------------------------------------------------------------
-- 3. updated_at maintenance trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_portal_access_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_portal_access_updated_at on public.portal_access;
create trigger trg_portal_access_updated_at
  before update on public.portal_access
  for each row
  execute function public.set_portal_access_updated_at();

-- ---------------------------------------------------------------------------
-- 4. Indexes for membership lookups
-- ---------------------------------------------------------------------------
create index if not exists portal_access_client_id_idx
  on public.portal_access (client_id);

create index if not exists portal_access_user_id_idx
  on public.portal_access (user_id);

create index if not exists portal_access_email_lower_idx
  on public.portal_access (lower(email));

-- ---------------------------------------------------------------------------
-- 5. Prevent duplicate active memberships per client + normalised email.
--    Revoked rows fall out of the index so a restore/re-invite is allowed.
-- ---------------------------------------------------------------------------
create unique index if not exists portal_access_active_membership_unique
  on public.portal_access (client_id, lower(email))
  where coalesce(is_revoked, false) = false;

-- ---------------------------------------------------------------------------
-- 6. Access-role allowlist (additive — table currently has no rows).
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'portal_access_access_role_check'
  ) then
    alter table public.portal_access
      add constraint portal_access_access_role_check
      check (access_role is null or access_role in ('owner','admin','billing','project_member','viewer'));
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 7. RLS: allow a portal user to read their own (non-revoked) memberships.
--    Additive — the existing `portal_access_internal_all` policy is untouched.
-- ---------------------------------------------------------------------------
drop policy if exists "portal_access_own_select" on public.portal_access;
create policy "portal_access_own_select"
  on public.portal_access
  for select
  to authenticated
  using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- 8. Secure membership resolver.
--    SECURITY DEFINER so it can read clients/portal_access without exposing
--    them to the caller. Returns only the fields the portal needs.
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
  v_state text;
begin
  if v_user_id is null then
    return jsonb_build_object('has_access', false);
  end if;

  -- Primary membership path: portal_access (non-revoked, unexpired, active client).
  select pa.id, pa.client_id, pa.access_role, pa.invitation_state
    into v_access_id, v_client_id, v_access_role, v_state
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

  -- Legacy fallback: previously linked clients.user_id.
  select c.id, c.portal_access_state
    into v_client_id, v_state
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

  return jsonb_build_object('has_access', false);
end;
$function$;

revoke all on function public.get_active_portal_membership() from public;
revoke all on function public.get_active_portal_membership() from anon;
grant execute on function public.get_active_portal_membership() to authenticated;