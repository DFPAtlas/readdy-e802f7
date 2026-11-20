-- DFP AI SECURITY — Control-plane foundation
-- Internal-only foundation for authorised security assessments.
-- No autonomous intrusive execution is introduced by this migration.
-- Public/client access is intentionally denied by default.

create extension if not exists pgcrypto;

create table if not exists public.security_engagements (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete restrict,
  name text not null,
  service_type text not null check (service_type in ('ai_security_scan','ai_security_assessment','security_watch')),
  status text not null default 'draft' check (status in (
    'draft','pending_authorisation','authorised','discovery','assessment','validation',
    'reporting','remediation','retest','monitoring','paused','stopped','closed'
  )),
  testing_starts_at timestamptz,
  testing_ends_at timestamptz,
  written_authorisation_at timestamptz,
  authorised_by_user_id uuid,
  emergency_stop boolean not null default false,
  emergency_stop_reason text,
  emergency_stopped_at timestamptz,
  emergency_stopped_by uuid,
  notes text,
  created_by uuid not null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint security_engagement_window_check check (
    testing_starts_at is null or testing_ends_at is null or testing_ends_at > testing_starts_at
  ),
  constraint security_engagement_authorisation_check check (
    status in ('draft','pending_authorisation')
    or written_authorisation_at is not null
  )
);

create table if not exists public.security_scope_assets (
  id uuid primary key default gen_random_uuid(),
  engagement_id uuid not null references public.security_engagements(id) on delete cascade,
  asset_type text not null check (asset_type in (
    'domain','subdomain','url','ip','cidr','api','application','cloud_account','email_domain','ai_system','other'
  )),
  asset_value text not null,
  permission text not null default 'permitted' check (permission in ('permitted','prohibited')),
  allowed_test_categories text[] not null default '{}',
  rate_limit_per_minute integer,
  notes text,
  created_by uuid not null default auth.uid(),
  created_at timestamptz not null default now(),
  unique (engagement_id, asset_type, asset_value)
);

create table if not exists public.security_approvals (
  id uuid primary key default gen_random_uuid(),
  engagement_id uuid not null references public.security_engagements(id) on delete cascade,
  gate text not null check (gate in (
    'scope','active_testing','elevated_testing','critical_finding','retest'
  )),
  state text not null default 'pending' check (state in ('pending','approved','rejected','revoked')),
  requested_by uuid default auth.uid(),
  requested_at timestamptz not null default now(),
  decided_by uuid,
  decided_at timestamptz,
  reason text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.security_jobs (
  id uuid primary key default gen_random_uuid(),
  engagement_id uuid not null references public.security_engagements(id) on delete cascade,
  scope_asset_id uuid references public.security_scope_assets(id) on delete restrict,
  agent_key text not null,
  job_type text not null,
  risk_level text not null default 'passive' check (risk_level in ('passive','active','elevated')),
  status text not null default 'queued' check (status in (
    'queued','blocked','approved','running','succeeded','failed','cancelled','stopped'
  )),
  requires_gate text check (requires_gate in ('scope','active_testing','elevated_testing','critical_finding','retest')),
  input jsonb not null default '{}'::jsonb,
  output_summary jsonb not null default '{}'::jsonb,
  assigned_runtime text check (assigned_runtime in ('cloud','hal','tron')),
  requested_by uuid default auth.uid(),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.security_findings (
  id uuid primary key default gen_random_uuid(),
  engagement_id uuid not null references public.security_engagements(id) on delete cascade,
  source_job_id uuid references public.security_jobs(id) on delete set null,
  scope_asset_id uuid references public.security_scope_assets(id) on delete set null,
  finding_key text,
  title text not null,
  severity text not null check (severity in ('critical','high','medium','low','info')),
  confidence numeric(5,2) check (confidence is null or (confidence >= 0 and confidence <= 100)),
  validation_state text not null default 'needs_validation' check (validation_state in (
    'discovered','needs_validation','validated','false_positive'
  )),
  workflow_state text not null default 'open' check (workflow_state in (
    'open','reported','remediation_in_progress','ready_for_retest','resolved','accepted_risk'
  )),
  description text,
  business_impact text,
  remediation text,
  validated_by uuid,
  validated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.security_evidence (
  id uuid primary key default gen_random_uuid(),
  engagement_id uuid not null references public.security_engagements(id) on delete cascade,
  finding_id uuid references public.security_findings(id) on delete cascade,
  source_job_id uuid references public.security_jobs(id) on delete set null,
  source_agent text not null,
  evidence_type text not null,
  storage_reference text,
  sha256 text,
  captured_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.security_audit_events (
  id bigint generated always as identity primary key,
  engagement_id uuid references public.security_engagements(id) on delete cascade,
  actor_user_id uuid default auth.uid(),
  actor_type text not null default 'user' check (actor_type in ('user','system','agent')),
  event_type text not null,
  entity_type text,
  entity_id text,
  event_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists security_engagements_client_idx on public.security_engagements(client_id);
create index if not exists security_engagements_status_idx on public.security_engagements(status);
create index if not exists security_scope_assets_engagement_idx on public.security_scope_assets(engagement_id);
create index if not exists security_jobs_engagement_status_idx on public.security_jobs(engagement_id,status);
create index if not exists security_findings_engagement_severity_idx on public.security_findings(engagement_id,severity);
create index if not exists security_evidence_finding_idx on public.security_evidence(finding_id);
create index if not exists security_audit_engagement_created_idx on public.security_audit_events(engagement_id,created_at desc);

alter table public.security_engagements enable row level security;
alter table public.security_scope_assets enable row level security;
alter table public.security_approvals enable row level security;
alter table public.security_jobs enable row level security;
alter table public.security_findings enable row level security;
alter table public.security_evidence enable row level security;
alter table public.security_audit_events enable row level security;

revoke all on public.security_engagements from anon;
revoke all on public.security_scope_assets from anon;
revoke all on public.security_approvals from anon;
revoke all on public.security_jobs from anon;
revoke all on public.security_findings from anon;
revoke all on public.security_evidence from anon;
revoke all on public.security_audit_events from anon;

grant select, insert, update on public.security_engagements to authenticated;
grant select, insert, update, delete on public.security_scope_assets to authenticated;
grant select, insert, update on public.security_approvals to authenticated;
grant select, insert, update on public.security_jobs to authenticated;
grant select, insert, update on public.security_findings to authenticated;
grant select, insert on public.security_evidence to authenticated;
grant select, insert on public.security_audit_events to authenticated;
grant usage, select on sequence public.security_audit_events_id_seq to authenticated;

do $$
declare
  t text;
begin
  foreach t in array array[
    'security_engagements','security_scope_assets','security_approvals',
    'security_jobs','security_findings','security_evidence','security_audit_events'
  ]
  loop
    execute format('drop policy if exists %I on public.%I', t || '_internal_select', t);
    execute format('create policy %I on public.%I for select to authenticated using (app_private.is_internal())', t || '_internal_select', t);
    execute format('drop policy if exists %I on public.%I', t || '_internal_insert', t);
    execute format('create policy %I on public.%I for insert to authenticated with check (app_private.is_internal())', t || '_internal_insert', t);
  end loop;
end $$;

drop policy if exists security_engagements_internal_update on public.security_engagements;
create policy security_engagements_internal_update on public.security_engagements
  for update to authenticated using (app_private.is_internal()) with check (app_private.is_internal());

drop policy if exists security_scope_assets_internal_update on public.security_scope_assets;
create policy security_scope_assets_internal_update on public.security_scope_assets
  for update to authenticated using (app_private.is_internal()) with check (app_private.is_internal());
drop policy if exists security_scope_assets_internal_delete on public.security_scope_assets;
create policy security_scope_assets_internal_delete on public.security_scope_assets
  for delete to authenticated using (app_private.is_internal());

drop policy if exists security_approvals_internal_update on public.security_approvals;
create policy security_approvals_internal_update on public.security_approvals
  for update to authenticated using (app_private.is_internal()) with check (app_private.is_internal());

drop policy if exists security_jobs_internal_update on public.security_jobs;
create policy security_jobs_internal_update on public.security_jobs
  for update to authenticated using (app_private.is_internal()) with check (app_private.is_internal());

drop policy if exists security_findings_internal_update on public.security_findings;
create policy security_findings_internal_update on public.security_findings
  for update to authenticated using (app_private.is_internal()) with check (app_private.is_internal());

create or replace function public.set_security_updated_at()
returns trigger language plpgsql security invoker set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_security_engagements_updated_at on public.security_engagements;
create trigger trg_security_engagements_updated_at before update on public.security_engagements
for each row execute function public.set_security_updated_at();

drop trigger if exists trg_security_findings_updated_at on public.security_findings;
create trigger trg_security_findings_updated_at before update on public.security_findings
for each row execute function public.set_security_updated_at();

create or replace function public.security_job_is_runnable(p_job_id uuid)
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select exists (
    select 1
    from public.security_jobs j
    join public.security_engagements e on e.id = j.engagement_id
    left join public.security_scope_assets a on a.id = j.scope_asset_id
    where j.id = p_job_id
      and e.written_authorisation_at is not null
      and e.status not in ('draft','pending_authorisation','paused','stopped','closed')
      and e.emergency_stop = false
      and (e.testing_starts_at is null or now() >= e.testing_starts_at)
      and (e.testing_ends_at is null or now() <= e.testing_ends_at)
      and (a.id is null or a.permission = 'permitted')
      and (
        j.requires_gate is null
        or exists (
          select 1 from public.security_approvals ap
          where ap.engagement_id = j.engagement_id
            and ap.gate = j.requires_gate
            and ap.state = 'approved'
        )
      )
  );
$$;

revoke all on function public.security_job_is_runnable(uuid) from public, anon;
grant execute on function public.security_job_is_runnable(uuid) to authenticated;

create or replace view public.security_engagement_overview
with (security_invoker = true)
as
select
  e.id,
  e.client_id,
  e.name,
  e.service_type,
  e.status,
  e.emergency_stop,
  e.testing_starts_at,
  e.testing_ends_at,
  count(distinct a.id) filter (where a.permission = 'permitted') as permitted_assets,
  count(distinct j.id) as jobs,
  count(distinct f.id) as findings,
  count(distinct f.id) filter (where f.severity = 'critical') as critical_findings,
  max(j.completed_at) as last_job_completed_at
from public.security_engagements e
left join public.security_scope_assets a on a.engagement_id = e.id
left join public.security_jobs j on j.engagement_id = e.id
left join public.security_findings f on f.engagement_id = e.id
group by e.id;

revoke all on public.security_engagement_overview from anon;
grant select on public.security_engagement_overview to authenticated;
