-- Public UAT application submission boundary.
--
-- This migration mirrors the version already applied to the shared
-- digital-footprint.uk / DFP Command Supabase project. Keeping it in source
-- prevents a clean deployment from calling an RPC that does not exist.

create or replace function public.submit_uat_tester_application(p_payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_existing uuid;
  v_ref text := nullif(trim(p_payload->>'application_reference'), '');
  v_email text := nullif(trim(p_payload->>'email'), '');
  v_clean jsonb;
  v_row public.uat_tester_applications;
begin
  if v_ref is null
     or char_length(v_ref) < 8
     or char_length(v_ref) > 80 then
    raise exception 'invalid_application_reference';
  end if;

  if v_email is null
     or char_length(v_email) > 254
     or v_email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' then
    raise exception 'invalid_email';
  end if;

  -- A browser retry returns the original application instead of duplicating it.
  select a.id
    into v_existing
  from public.uat_tester_applications a
  where a.application_reference = v_ref
    and lower(a.email) = lower(v_email)
  limit 1;

  if v_existing is not null then
    return v_existing;
  end if;

  -- The client cannot set review state or server-controlled timestamps.
  v_clean := p_payload
    - 'id' - 'status' - 'admin_notes' - 'reviewed_by' - 'reviewed_at'
    - 'submitted_at' - 'created_at' - 'updated_at';

  v_row := jsonb_populate_record(null::public.uat_tester_applications, v_clean);

  v_row.id := gen_random_uuid();
  v_row.application_reference := v_ref;
  v_row.email := v_email;
  v_row.status := 'submitted';
  v_row.admin_notes := null;
  v_row.reviewed_by := null;
  v_row.reviewed_at := null;
  v_row.submitted_at := now();
  v_row.created_at := now();
  v_row.updated_at := now();

  insert into public.uat_tester_applications values (v_row.*)
  returning id into v_id;

  return v_id;
end;
$$;

revoke execute on function public.submit_uat_tester_application(jsonb) from public;
revoke execute on function public.submit_uat_tester_application(jsonb) from anon, authenticated;
grant execute on function public.submit_uat_tester_application(jsonb) to anon, authenticated, service_role;

comment on function public.submit_uat_tester_application(jsonb) is
  'Creates an idempotent submitted UAT tester application without exposing applicant rows to anonymous SELECT.';
