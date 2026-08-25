-- DFP CLIENT PORTAL — RLS recognition of portal_access membership
-- Additive only. Does not remove or weaken any existing policy.
--
-- Background: the portal data tables (projects, invoices, messages, support,
-- websites, clients) were historically scoped exclusively by `clients.user_id`.
-- Prompt 01/02 introduced `portal_access` as the new membership model, so a user
-- invited through the new flow has a `portal_access` row (with `user_id`) but no
-- `clients.user_id`. Those users passed the new access gate but saw empty data
-- because RLS still only recognised `clients.user_id`.
--
-- This migration adds a shared, security-definer helper that recognises BOTH the
-- legacy `clients.user_id` link AND an active (non-revoked, unexpired, accepted)
-- `portal_access` membership, then wires it into the client-facing SELECT policies.

-- ---------------------------------------------------------------------------
-- 1. can_access_client — true if the caller is internal, is the legacy linked
--    clients.user_id, or holds an active portal_access membership for the client.
-- ---------------------------------------------------------------------------
create or replace function app_private.can_access_client(target_client_id uuid)
returns boolean
language sql
stable security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null and (
    app_private.is_internal()
    or exists (
      select 1 from public.clients c
      where c.id = target_client_id
        and c.user_id = (select auth.uid())
    )
    or exists (
      select 1 from public.portal_access pa
      where pa.client_id = target_client_id
        and pa.user_id = (select auth.uid())
        and coalesce(pa.is_revoked, false) = false
        and (pa.expires_at is null or pa.expires_at > now())
        and pa.invitation_state in ('pending','sent','accepted')
        and exists (
          select 1 from public.clients c2
          where c2.id = pa.client_id
            and c2.status = 'active'
            and c2.archived_at is null
            and c2.offboarding_state is null
        )
    )
  );
$$;

-- ---------------------------------------------------------------------------
-- 2. can_access_project — add the portal_access membership path so the same
--    helper now covers projects (and everything derived from it: files, messages,
--    approvals).
-- ---------------------------------------------------------------------------
create or replace function app_private.can_access_project(target_project_id uuid)
returns boolean
language sql
stable security definer
set search_path = ''
as $function$
  select (select auth.uid()) is not null and (
    app_private.is_internal()
    or exists (
      select 1 from public.projects p
      join public.clients c on c.id = p.client_id
      where p.id = target_project_id and c.user_id = (select auth.uid())
    )
    or exists (
      select 1 from public.project_access pa
      left join public.clients c on c.id = pa.client_id
      where pa.project_id = target_project_id
        and (pa.user_id = (select auth.uid()) or c.user_id = (select auth.uid()))
    )
    or exists (
      select 1 from public.projects p
      where p.id = target_project_id
        and app_private.can_access_client(p.client_id)
    )
  );
$function$;

-- ---------------------------------------------------------------------------
-- 3. Rewire the client-facing SELECT policies to use can_access_client.
--    Each preserves the original `is_internal()` access and simply swaps the
--    `clients.user_id` EXISTS subquery for the broader helper.
-- ---------------------------------------------------------------------------
alter policy "clients_select" on public.clients
  to authenticated
  using (app_private.can_access_client(id));

alter policy "websites_select_client" on public.client_websites
  using ((client_visible = true) and app_private.can_access_client(client_id));

alter policy "invoices_select" on public.invoices
  to authenticated
  using (
    app_private.can_access_client(client_id)
    or ((project_id is not null) and app_private.can_access_project(project_id))
  );

alter policy "threads_select_client" on public.message_threads
  using ((auth.uid() is not null) and (client_visible = true) and app_private.can_access_client(message_threads.client_id));

alter policy "threads_update_client" on public.message_threads
  using ((auth.uid() is not null) and app_private.can_access_client(message_threads.client_id));

alter policy "tickets_select_client" on public.support_tickets
  using ((auth.uid() is not null) and app_private.can_access_client(support_tickets.client_id));