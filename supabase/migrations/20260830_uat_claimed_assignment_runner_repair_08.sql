-- DFP UAT CLAIMED ASSIGNMENT RUNNER REPAIR 08
-- Scope: active/approved testers can start a claimed UAT assignment and load its test cases.

-- ============================================================
-- ROOT CAUSE 1: TESTER STATUS RESOLVER
-- public.resolve_tester_from_auth() now delegates to the canonical
-- app_private.current_uat_tester_id(), which accepts BOTH 'approved' and 'active'.
-- ============================================================
CREATE OR REPLACE FUNCTION public.resolve_tester_from_auth()
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_tester_id uuid;
begin
  select app_private.current_uat_tester_id() into v_tester_id;
  if v_tester_id is null then
    raise exception 'No active or approved tester profile found for authenticated user';
  end if;
  return v_tester_id;
end;
$function$;

-- ============================================================
-- ROOT CAUSE 2: ASSIGNMENT CASE SNAPSHOT ON INSTANT CLAIM
-- claim_uat_job_instant() now snapshots the job's runnable
-- (non-archived, job-scoped) test cases into uat_assignment_test_cases.
-- Fails safely if the job has zero runnable cases.
-- ============================================================
CREATE OR REPLACE FUNCTION public.claim_uat_job_instant(p_job_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  v_tester_id uuid;
  v_job record;
  v_active_count integer;
  v_case_count integer;
  v_now timestamptz := now();
  v_new_id uuid;
BEGIN
  SELECT app_private.current_uat_tester_id() INTO v_tester_id;
  IF v_tester_id IS NULL THEN
    RAISE EXCEPTION 'No active or approved tester profile';
  END IF;

  SELECT * INTO v_job FROM public.uat_jobs WHERE id = p_job_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Job not found';
  END IF;

  IF v_job.marketplace_status <> 'published' OR v_job.visibility <> 'marketplace' THEN
    RAISE EXCEPTION 'Job is not publicly available';
  END IF;
  IF v_job.claim_mode <> 'instant' THEN
    RAISE EXCEPTION 'Job requires approval';
  END IF;
  IF v_job.application_opens_at IS NOT NULL AND v_job.application_opens_at > v_now THEN
    RAISE EXCEPTION 'Job has not opened yet';
  END IF;
  IF v_job.application_closes_at IS NOT NULL AND v_job.application_closes_at < v_now THEN
    RAISE EXCEPTION 'Job has closed';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.uat_assignments
    WHERE job_id = p_job_id
      AND tester_id = v_tester_id
      AND status NOT IN ('rejected','expired','cancelled')
  ) THEN
    RAISE EXCEPTION 'You already have an active assignment for this job';
  END IF;

  SELECT count(*) INTO v_active_count
  FROM public.uat_assignments
  WHERE job_id = p_job_id
    AND status NOT IN ('rejected','expired','cancelled');

  IF v_active_count >= v_job.max_testers THEN
    RAISE EXCEPTION 'No tester places remaining';
  END IF;

  SELECT count(*) INTO v_case_count
  FROM public.uat_test_cases tc
  WHERE tc.job_id = p_job_id
    AND tc.archived_at IS NULL;

  IF v_case_count = 0 THEN
    RAISE EXCEPTION 'This job has no runnable test cases';
  END IF;

  INSERT INTO public.uat_assignments (job_id, tester_id, status, agreed_reward_amount_minor, currency, offered_at)
  VALUES (p_job_id, v_tester_id, 'reserved', COALESCE(v_job.reward_amount_minor,0), COALESCE(v_job.currency,'GBP'), v_now)
  RETURNING id INTO v_new_id;

  INSERT INTO public.uat_assignment_test_cases (assignment_id, test_case_id, tester_id, status, sort_order)
  SELECT v_new_id, tc.id, v_tester_id, 'not_started', COALESCE(NULLIF(tc.sort_order,0), tc.order_index, 0)
  FROM public.uat_test_cases tc
  WHERE tc.job_id = p_job_id
    AND tc.archived_at IS NULL
  ORDER BY COALESCE(NULLIF(tc.sort_order,0), tc.order_index, 0), tc.created_at, tc.id
  ON CONFLICT (assignment_id, test_case_id) DO NOTHING;

  UPDATE public.uat_jobs
    SET tester_slots_filled = (
      SELECT count(*) FROM public.uat_assignments
      WHERE job_id = p_job_id AND status NOT IN ('rejected','expired','cancelled')
    ),
    reserve_count = (
      SELECT count(*) FROM public.uat_assignments
      WHERE job_id = p_job_id AND status = 'reserved'
    ),
    updated_at = now()
    WHERE id = p_job_id;

  RETURN v_new_id;
END;
$function$;

-- ============================================================
-- ROOT CAUSE 3: START SESSION COMPATIBILITY BACKFILL
-- start_uat_session() now snapshots the job's cases when an existing
-- (pre-repair) assignment has zero case rows, before creating a session.
-- Idempotent via ON CONFLICT DO NOTHING.
-- ============================================================
CREATE OR REPLACE FUNCTION public.start_uat_session(p_assignment_id uuid, p_browser_name text DEFAULT NULL::text, p_browser_version text DEFAULT NULL::text, p_operating_system text DEFAULT NULL::text, p_viewport_width integer DEFAULT NULL::integer, p_viewport_height integer DEFAULT NULL::integer, p_user_agent text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_tester_id uuid;
  v_assignment record;
  v_existing_session_id uuid;
  v_session_id uuid;
  v_project_id uuid;
  v_job_id uuid;
  v_case_count integer;
begin
  v_tester_id := public.resolve_tester_from_auth();

  select * into v_assignment from public.uat_assignments where id = p_assignment_id and tester_id = v_tester_id;
  if v_assignment.id is null then
    return jsonb_build_object('success', false, 'message', 'Assignment not found or does not belong to you.');
  end if;
  if v_assignment.status in ('cancelled', 'expired') then
    return jsonb_build_object('success', false, 'message', 'This assignment is no longer available.');
  end if;
  if v_assignment.access_expires_at is not null and v_assignment.access_expires_at < now() then
    return jsonb_build_object('success', false, 'message', 'Assignment access has expired.');
  end if;

  select j.project_id, j.id into v_project_id, v_job_id
  from public.uat_assignments a
  join public.uat_jobs j on j.id = a.job_id
  where a.id = p_assignment_id;

  select count(*) into v_case_count
  from public.uat_assignment_test_cases
  where assignment_id = p_assignment_id;

  if v_case_count = 0 then
    insert into public.uat_assignment_test_cases (assignment_id, test_case_id, tester_id, status, sort_order)
    select p_assignment_id, tc.id, v_tester_id, 'not_started', coalesce(nullif(tc.sort_order,0), tc.order_index, 0)
    from public.uat_test_cases tc
    where tc.job_id = v_job_id
      and tc.archived_at is null
    on conflict (assignment_id, test_case_id) do nothing;

    select count(*) into v_case_count
    from public.uat_assignment_test_cases
    where assignment_id = p_assignment_id;
  end if;

  if v_case_count = 0 then
    return jsonb_build_object('success', false, 'message', 'No test cases are assigned to this UAT job.');
  end if;

  select id into v_existing_session_id
  from public.uat_sessions
  where assignment_id = p_assignment_id and tester_id = v_tester_id and status in ('active','paused')
  limit 1;

  if v_existing_session_id is not null then
    return jsonb_build_object('success', true, 'session_id', v_existing_session_id, 'status', 'existing');
  end if;

  insert into public.uat_sessions (assignment_id, tester_id, project_id, job_id, status, started_at, last_activity_at, browser_name, browser_version, operating_system, viewport_width, viewport_height, user_agent)
  values (p_assignment_id, v_tester_id, v_project_id, v_job_id, 'active', now(), now(), p_browser_name, p_browser_version, p_operating_system, p_viewport_width, p_viewport_height, p_user_agent)
  returning id into v_session_id;

  update public.uat_assignments
  set status = 'testing', started_at = coalesce(started_at, now()), updated_at = now()
  where id = p_assignment_id and tester_id = v_tester_id;

  return jsonb_build_object('success', true, 'session_id', v_session_id, 'status', 'active');
end;
$function$;

-- ============================================================
-- ROOT CAUSE 5: ACTIVE TESTER RLS
-- Tester ownership policies now accept 'approved' OR 'active'.
-- tester_id-bearing tables delegate to app_private.current_uat_tester_id().
-- ============================================================
ALTER POLICY "testers_read_own_assign_cases" ON public.uat_assignment_test_cases USING (tester_id = app_private.current_uat_tester_id());
ALTER POLICY "testers_update_own_assign_cases" ON public.uat_assignment_test_cases USING (tester_id = app_private.current_uat_tester_id());

ALTER POLICY "testers_insert_own_sessions" ON public.uat_sessions WITH CHECK (tester_id = app_private.current_uat_tester_id());
ALTER POLICY "testers_read_own_sessions" ON public.uat_sessions USING (tester_id = app_private.current_uat_tester_id());
ALTER POLICY "testers_update_own_sessions" ON public.uat_sessions USING (tester_id = app_private.current_uat_tester_id());

ALTER POLICY "testers_insert_own_results" ON public.uat_test_case_results WITH CHECK (tester_id = app_private.current_uat_tester_id());
ALTER POLICY "testers_read_own_results" ON public.uat_test_case_results USING (tester_id = app_private.current_uat_tester_id());
ALTER POLICY "testers_update_own_results" ON public.uat_test_case_results USING (tester_id = app_private.current_uat_tester_id());

ALTER POLICY "testers_read_own_evidence" ON public.uat_evidence USING (tester_id = app_private.current_uat_tester_id());

ALTER POLICY "testers_read_assigned_steps" ON public.uat_test_case_steps USING (
  EXISTS (
    SELECT 1 FROM uat_assignment_test_cases atc
    JOIN uat_testers t ON t.id = atc.tester_id
    WHERE atc.test_case_id = uat_test_case_steps.test_case_id
      AND t.user_id = auth.uid()
      AND t.status IN ('approved','active')
  )
);

ALTER POLICY "testers_read_assigned_cases" ON public.uat_test_cases USING (
  EXISTS (
    SELECT 1 FROM uat_assignment_test_cases atc
    JOIN uat_testers t ON t.id = atc.tester_id
    WHERE atc.test_case_id = uat_test_cases.id
      AND t.user_id = auth.uid()
      AND t.status IN ('approved','active')
  )
);

-- ============================================================
-- ROOT CAUSE 4: TEST CASE STEP MODEL BACKFILL
-- Convert JSONB uat_test_cases.steps (action/expected) into structured
-- uat_test_case_steps (instruction/expected_result) only when child rows
-- do not already exist. Idempotent, does not overwrite, does not delete JSONB.
-- ============================================================
INSERT INTO public.uat_test_case_steps (test_case_id, step_number, instruction, expected_result)
SELECT
  tc.id,
  elem.ordinality,
  elem.value ->> 'action',
  elem.value ->> 'expected'
FROM public.uat_test_cases tc
CROSS JOIN LATERAL jsonb_array_elements(tc.steps) WITH ORDINALITY AS elem(value, ordinality)
WHERE jsonb_typeof(tc.steps) = 'array'
  AND NOT EXISTS (
    SELECT 1 FROM public.uat_test_case_steps s WHERE s.test_case_id = tc.id
  )
  AND (elem.value ->> 'action') IS NOT NULL
  AND btrim(elem.value ->> 'action') <> ''
ON CONFLICT (test_case_id, step_number) DO NOTHING;

-- ============================================================
-- ONE-TIME BACKFILL: existing reserved/testing assignments with zero cases
-- ============================================================
INSERT INTO public.uat_assignment_test_cases (assignment_id, test_case_id, tester_id, status, sort_order)
SELECT a.id, tc.id, a.tester_id, 'not_started', COALESCE(NULLIF(tc.sort_order,0), tc.order_index, 0)
FROM public.uat_assignments a
JOIN public.uat_test_cases tc ON tc.job_id = a.job_id AND tc.archived_at IS NULL
WHERE a.status IN ('reserved','offered','accepted','testing')
  AND NOT EXISTS (
    SELECT 1 FROM public.uat_assignment_test_cases atc WHERE atc.assignment_id = a.id
  )
ON CONFLICT (assignment_id, test_case_id) DO NOTHING;