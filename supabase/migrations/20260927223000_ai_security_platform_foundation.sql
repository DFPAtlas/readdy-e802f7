-- DFP AI Security Platform foundation
-- Defensive control-plane only. No scanner/exploit execution is implemented here.

create schema if not exists app_private;

create or replace function app_private.is_active_admin()
returns boolean
language sql
stable
security definer
set search_path = public, app_private
as $$
  select exists (
    select 1
    from public.admin_profiles ap
    where ap.id = auth.uid()
      and ap.active = true
      and ap.suspended_at is null
      and ap.archived_at is null
  );
$$;

revoke all on function app_private.is_active_admin() from public, anon;
grant execute on function app_private.is_active_admin() to authenticated, service_role;

create table if not exists public.security_engagements (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  customer_name text not null,
  customer_contact_name text,
  customer_contact_email text,
  status text not null default 'draft' check (status in (
    'draft','awaiting_authorisation','approved','active','paused','reporting',
    'remediation','retest','completed','cancelled'
  )),
  service_tier text not null default 'assessment' check (service_tier in ('scan','assessment','watch')),
  authorised_by_name text,
  authorised_by_email text,
  authorised_at timestamptz,
  written_authorisation_reference text,
  testing_window_start timestamptz,
  testing_window_end timestamptz,
  emergency_stop boolean not null default false,
  emergency_stop_at timestamptz,
  emergency_stop_by uuid references auth.users(id),
  max_requests_per_minute integer not null default 30 check (max_requests_per_minute between 1 and 600),
  allowed_test_categories text[] not null default array[
    'dns','tls','email_posture','public_asset_discovery','technology_fingerprinting',
    'known_vulnerability_correlation'
  ]::text[],
  notes text,
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (testing_window_end is null or testing_window_start is null or testing_window_end > testing_window_start)
);

create table if not exists public.security_scope_assets (
  id uuid primary key default gen_random_uuid(),
  engagement_id uuid not null references public.security_engagements(id) on delete cascade,
  asset_type text not null check (asset_type in ('domain','subdomain','ip','cidr','url','application','api','cloud_tenant','email_domain','ai_system')),
  target text not null,
  normalized_target text not null,
  scope_state text not null default 'included' check (scope_state in ('included','excluded')),
  environment text check (environment is null or environment in ('production','staging','development','test','other')),
  notes text,
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  unique (engagement_id, normalized_target, scope_state)
);

create table if not exists public.security_approvals (
  id uuid primary key default gen_random_uuid(),
  engagement_id uuid not null references public.security_engagements(id) on delete cascade,
  approval_type text not null check (approval_type in (
    'scope','active_testing','elevated_testing','critical_escalation','retest'
  )),
  status text not null default 'approved' check (status in ('approved','revoked','expired')),
  approved_by uuid not null default auth.uid() references auth.users(id),
  approved_by_name text,
  reason text,
  valid_from timestamptz not null default now(),
  valid_until timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  check (valid_until is null or valid_until > valid_from)
);

create table if not exists public.security_jobs (
  id uuid primary key default gen_random_uuid(),
  engagement_id uuid not null references public.security_engagements(id) on delete cascade,
  scope_asset_id uuid not null references public.security_scope_assets(id) on delete restrict,
  requested_target text not null,
  agent_key text not null check (agent_key in (
    'recon','web_security','cloud_security','identity','email_security',
    'vulnerability_intelligence','ai_llm_security','evidence','risk_correlation',
    'remediation','report'
  )),
  test_category text not null,
  risk_class text not null default 'passive' check (risk_class in ('passive','authenticated_review','active_test','elevated_test','retest')),
  status text not null default 'queued' check (status in ('queued','assigned','running','blocked','completed','failed','cancelled')),
  approval_id uuid references public.security_approvals(id) on delete set null,
  executor text check (executor is null or executor in ('cloud','hal','tron','human')),
  external_job_reference text,
  requested_by uuid not null default auth.uid() references auth.users(id),
  queued_at timestamptz not null default now(),
  started_at timestamptz,
  finished_at timestamptz,
  failure_reason text,
  safe_metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.security_findings (
  id uuid primary key default gen_random_uuid(),
  engagement_id uuid not null references public.security_engagements(id) on delete cascade,
  job_id uuid references public.security_jobs(id) on delete set null,
  finding_reference text not null,
  title text not null,
  severity text not null check (severity in ('critical','high','medium','low','informational')),
  confidence numeric(5,2) check (confidence is null or (confidence >= 0 and confidence <= 100)),
  affected_asset text not null,
  description text,
  business_impact text,
  remediation text,
  validation_state text not null default 'needs_validation' check (validation_state in ('needs_validation','validated','false_positive')),
  remediation_state text not null default 'open' check (remediation_state in ('open','in_progress','ready_for_retest','resolved','accepted_risk')),
  validated_by uuid references auth.users(id),
  validated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (engagement_id, finding_reference)
);

create table if not exists public.security_evidence (
  id uuid primary key default gen_random_uuid(),
  engagement_id uuid not null references public.security_engagements(id) on delete cascade,
  job_id uuid references public.security_jobs(id) on delete set null,
  finding_id uuid references public.security_findings(id) on delete set null,
  source_agent text not null,
  affected_asset text not null,
  evidence_type text not null,
  storage_reference text,
  summary text,
  source_metadata jsonb not null default '{}'::jsonb,
  sha256 text,
  captured_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.security_audit_log (
  id bigint generated always as identity primary key,
  engagement_id uuid references public.security_engagements(id) on delete cascade,
  actor_user_id uuid references auth.users(id),
  action text not null,
  entity_type text not null,
  entity_id text,
  safe_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists security_scope_assets_engagement_idx on public.security_scope_assets(engagement_id);
create index if not exists security_jobs_engagement_status_idx on public.security_jobs(engagement_id, status);
create index if not exists security_findings_engagement_severity_idx on public.security_findings(engagement_id, severity);
create index if not exists security_evidence_engagement_idx on public.security_evidence(engagement_id);
create index if not exists security_approvals_engagement_type_idx on public.security_approvals(engagement_id, approval_type, status);
create index if not exists security_audit_log_engagement_created_idx on public.security_audit_log(engagement_id, created_at desc);

alter table public.security_engagements enable row level security;
alter table public.security_scope_assets enable row level security;
alter table public.security_approvals enable row level security;
alter table public.security_jobs enable row level security;
alter table public.security_findings enable row level security;
alter table public.security_evidence enable row level security;
alter table public.security_audit_log enable row level security;

revoke all on public.security_engagements from anon;
revoke all on public.security_scope_assets from anon;
revoke all on public.security_approvals from anon;
revoke all on public.security_jobs from anon;
revoke all on public.security_findings from anon;
revoke all on public.security_evidence from anon;
revoke all on public.security_audit_log from anon;

grant select, insert, update on public.security_engagements to authenticated;
grant select, insert, update, delete on public.security_scope_assets to authenticated;
grant select, insert, update on public.security_approvals to authenticated;
grant select on public.security_jobs to authenticated;
grant select, insert, update on public.security_findings to authenticated;
grant select, insert on public.security_evidence to authenticated;
grant select on public.security_audit_log to authenticated;
grant all on public.security_engagements, public.security_scope_assets, public.security_approvals,
  public.security_jobs, public.security_findings, public.security_evidence, public.security_audit_log to service_role;
grant usage, select on sequence public.security_audit_log_id_seq to authenticated, service_role;

do $$
declare
  t text;
begin
  foreach t in array array[
    'security_engagements','security_scope_assets','security_approvals','security_jobs',
    'security_findings','security_evidence','security_audit_log'
  ]
  loop
    execute format('drop policy if exists %I on public.%I', t || '_admin_select', t);
    execute format(
      'create policy %I on public.%I for select to authenticated using (app_private.is_active_admin())',
      t || '_admin_select', t
    );
  end loop;
end $$;

create policy security_engagements_admin_insert on public.security_engagements
for insert to authenticated with check (app_private.is_active_admin());
create policy security_engagements_admin_update on public.security_engagements
for update to authenticated using (app_private.is_active_admin()) with check (app_private.is_active_admin());

create policy security_scope_assets_admin_insert on public.security_scope_assets
for insert to authenticated with check (app_private.is_active_admin());
create policy security_scope_assets_admin_update on public.security_scope_assets
for update to authenticated using (app_private.is_active_admin()) with check (app_private.is_active_admin());
create policy security_scope_assets_admin_delete on public.security_scope_assets
for delete to authenticated using (app_private.is_active_admin());

create policy security_approvals_admin_insert on public.security_approvals
for insert to authenticated with check (app_private.is_active_admin());
create policy security_approvals_admin_update on public.security_approvals
for update to authenticated using (app_private.is_active_admin()) with check (app_private.is_active_admin());

create policy security_findings_admin_insert on public.security_findings
for insert to authenticated with check (app_private.is_active_admin());
create policy security_findings_admin_update on public.security_findings
for update to authenticated using (app_private.is_active_admin()) with check (app_private.is_active_admin());

create policy security_evidence_admin_insert on public.security_evidence
for insert to authenticated with check (app_private.is_active_admin());

create or replace function public.queue_security_job(
  p_engagement_id uuid,
  p_scope_asset_id uuid,
  p_agent_key text,
  p_test_category text,
  p_risk_class text default 'passive',
  p_safe_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public, app_private
as $$
declare
  v_eng public.security_engagements%rowtype;
  v_asset public.security_scope_assets%rowtype;
  v_approval_id uuid;
  v_required_approval text;
  v_job_id uuid;
begin
  if not app_private.is_active_admin() then
    raise exception 'Admin access required';
  end if;

  select * into v_eng from public.security_engagements where id = p_engagement_id;
  if not found then raise exception 'Engagement not found'; end if;

  if v_eng.emergency_stop then raise exception 'Engagement is stopped'; end if;
  if v_eng.status not in ('approved','active','retest') then
    raise exception 'Engagement status % does not permit jobs', v_eng.status;
  end if;
  if v_eng.authorised_at is null then raise exception 'Written authorisation has not been recorded'; end if;
  if v_eng.testing_window_start is not null and now() < v_eng.testing_window_start then
    raise exception 'Testing window has not started';
  end if;
  if v_eng.testing_window_end is not null and now() > v_eng.testing_window_end then
    raise exception 'Testing window has ended';
  end if;
  if not (p_test_category = any(v_eng.allowed_test_categories)) then
    raise exception 'Test category is not allowed by engagement scope';
  end if;
  if p_risk_class not in ('passive','authenticated_review','active_test','elevated_test','retest') then
    raise exception 'Invalid risk class';
  end if;

  select * into v_asset
  from public.security_scope_assets
  where id = p_scope_asset_id
    and engagement_id = p_engagement_id
    and scope_state = 'included';
  if not found then raise exception 'Target is not an included scope asset'; end if;

  if exists (
    select 1 from public.security_scope_assets x
    where x.engagement_id = p_engagement_id
      and x.scope_state = 'excluded'
      and x.normalized_target = v_asset.normalized_target
  ) then
    raise exception 'Target is explicitly excluded';
  end if;

  v_required_approval := case p_risk_class
    when 'passive' then 'scope'
    when 'authenticated_review' then 'active_testing'
    when 'active_test' then 'active_testing'
    when 'elevated_test' then 'elevated_testing'
    when 'retest' then 'retest'
  end;

  select a.id into v_approval_id
  from public.security_approvals a
  where a.engagement_id = p_engagement_id
    and a.approval_type = v_required_approval
    and a.status = 'approved'
    and a.valid_from <= now()
    and (a.valid_until is null or a.valid_until > now())
    and a.revoked_at is null
  order by a.created_at desc
  limit 1;

  if v_approval_id is null then
    raise exception 'Required approval % is not active', v_required_approval;
  end if;

  insert into public.security_jobs (
    engagement_id, scope_asset_id, requested_target, agent_key, test_category,
    risk_class, approval_id, safe_metadata
  ) values (
    p_engagement_id, p_scope_asset_id, v_asset.target, p_agent_key, p_test_category,
    p_risk_class, v_approval_id, coalesce(p_safe_metadata, '{}'::jsonb)
  )
  returning id into v_job_id;

  insert into public.security_audit_log (
    engagement_id, actor_user_id, action, entity_type, entity_id, safe_metadata
  ) values (
    p_engagement_id, auth.uid(), 'security_job_queued', 'security_job', v_job_id::text,
    jsonb_build_object(
      'agent_key', p_agent_key,
      'test_category', p_test_category,
      'risk_class', p_risk_class,
      'scope_asset_id', p_scope_asset_id
    )
  );

  return v_job_id;
end;
$$;

revoke all on function public.queue_security_job(uuid,uuid,text,text,text,jsonb) from public, anon;
grant execute on function public.queue_security_job(uuid,uuid,text,text,text,jsonb) to authenticated, service_role;

create or replace function public.set_security_emergency_stop(
  p_engagement_id uuid,
  p_stop boolean,
  p_reason text default null
)
returns boolean
language plpgsql
security definer
set search_path = public, app_private
as $$
begin
  if not app_private.is_active_admin() then
    raise exception 'Admin access required';
  end if;

  update public.security_engagements
  set emergency_stop = p_stop,
      emergency_stop_at = case when p_stop then now() else null end,
      emergency_stop_by = case when p_stop then auth.uid() else null end,
      status = case when p_stop and status = 'active' then 'paused' else status end,
      updated_at = now()
  where id = p_engagement_id;

  if not found then raise exception 'Engagement not found'; end if;

  if p_stop then
    update public.security_jobs
    set status = 'cancelled',
        finished_at = now(),
        failure_reason = coalesce(failure_reason, 'Emergency stop activated')
    where engagement_id = p_engagement_id
      and status in ('queued','assigned');

    update public.security_jobs
    set status = 'blocked',
        failure_reason = coalesce(failure_reason, 'Emergency stop activated; executor must halt safely')
    where engagement_id = p_engagement_id
      and status = 'running';
  end if;

  insert into public.security_audit_log (
    engagement_id, actor_user_id, action, entity_type, entity_id, safe_metadata
  ) values (
    p_engagement_id, auth.uid(),
    case when p_stop then 'emergency_stop_enabled' else 'emergency_stop_cleared' end,
    'security_engagement', p_engagement_id::text,
    jsonb_build_object('reason', coalesce(p_reason, ''))
  );

  return true;
end;
$$;

revoke all on function public.set_security_emergency_stop(uuid,boolean,text) from public, anon;
grant execute on function public.set_security_emergency_stop(uuid,boolean,text) to authenticated, service_role;

comment on table public.security_jobs is
  'Authorised security work queue. Creation must go through queue_security_job so scope and approval gates are enforced.';
