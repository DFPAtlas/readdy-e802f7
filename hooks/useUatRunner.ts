'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { formatReward } from '@/lib/uat-marketplace';
import {
  VALID_TESTING_ASSIGNMENT_STATUSES,
  SUBMITTED_ASSIGNMENT_STATUSES,
  BLOCKED_ASSIGNMENT_STATUSES,
  parseEvidenceRules,
  normalizeEvidenceTags,
  detectBrowserMetadata,
  type EvidenceRules,
  type RunnerCase,
} from '@/lib/uat-runner';

export interface RunnerSession {
  id: string;
  status: string;
  browser_name: string | null;
  browser_version: string | null;
  operating_system: string | null;
  viewport_width: number | null;
  viewport_height: number | null;
}

export interface RunnerState {
  loading: boolean;
  notFound: boolean;
  blocked: boolean;
  blockedMessage: string;
  submitting: boolean;
  submitError: string;
  title: string;
  projectName: string | null;
  deadline: string | null;
  agreedRewardLabel: string;
  assignmentStatus: string;
  submittedAt: string | null;
  requiredDevices: string[];
  requiredBrowsers: string[];
  evidenceRules: EvidenceRules;
  cases: RunnerCase[];
  session: RunnerSession | null;
  currentIndex: number;
  currentCase: RunnerCase | null;
  moreInfoMode: boolean;
  reviewFeedback: string | null;
  requestedCaseIds: string[];
  resubmitting: boolean;
  resubmitError: string;
}

const initial: RunnerState = {
  loading: true,
  notFound: false,
  blocked: false,
  blockedMessage: '',
  submitting: false,
  submitError: '',
  title: '',
  projectName: null,
  deadline: null,
  agreedRewardLabel: '',
  assignmentStatus: '',
  submittedAt: null,
  requiredDevices: [],
  requiredBrowsers: [],
  evidenceRules: parseEvidenceRules([]),
  cases: [],
  session: null,
  currentIndex: -1,
  currentCase: null,
  moreInfoMode: false,
  reviewFeedback: null,
  requestedCaseIds: [],
  resubmitting: false,
  resubmitError: '',
};

export function useUatRunner(assignmentId: string, testerId: string | undefined) {
  const [state, setState] = useState<RunnerState>(initial);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState('');
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const load = useCallback(async () => {
    if (!testerId) return;
    setState((s) => ({ ...s, loading: true }));

    const { data: assign } = await supabase
      .from('uat_assignments')
      .select('id, status, access_expires_at, job_id, agreed_reward_amount_minor, currency, deadline, submitted_at, review_status, review_feedback, review_requested_case_ids')
      .eq('id', assignmentId)
      .eq('tester_id', testerId)
      .maybeSingle();

    if (!mountedRef.current) return;

    if (!assign) {
      setState((s) => ({ ...s, loading: false, notFound: true }));
      return;
    }

    const aData = assign as any;
    const moreInfoMode = aData.review_status === 'more_information_required';
    const requestedCaseIds: string[] = Array.isArray(aData.review_requested_case_ids)
      ? aData.review_requested_case_ids
      : [];

    if (BLOCKED_ASSIGNMENT_STATUSES.includes(aData.status)) {
      setState((s) => ({ ...s, loading: false, blocked: true, blockedMessage: 'This test assignment is no longer active.' }));
      return;
    }

    if (
      aData.access_expires_at &&
      new Date(aData.access_expires_at) < new Date() &&
      !SUBMITTED_ASSIGNMENT_STATUSES.includes(aData.status)
    ) {
      setState((s) => ({ ...s, loading: false, blocked: true, blockedMessage: 'This test access has expired.' }));
      return;
    }

    let jobTitle = '';
    let projectName: string | null = null;
    let deadline: string | null = aData.deadline || null;
    let evidenceRules: EvidenceRules = parseEvidenceRules([]);
    let requiredDevices: string[] = [];
    let requiredBrowsers: string[] = [];

    if (aData.job_id) {
      const { data: job } = await supabase
        .from('uat_jobs')
        .select('title, project_id, deadline, required_devices, required_browsers, evidence_requirement_tags, evidence_requirements')
        .eq('id', aData.job_id)
        .maybeSingle();

      if (job) {
        const j = job as any;
        jobTitle = j.title || '';
        deadline = aData.deadline || j.deadline || null;
        requiredDevices = j.required_devices || [];
        requiredBrowsers = j.required_browsers || [];
        evidenceRules = parseEvidenceRules(
          normalizeEvidenceTags(j.evidence_requirement_tags, j.evidence_requirements),
        );

        if (j.project_id) {
          const { data: proj } = await supabase.from('uat_projects').select('name').eq('id', j.project_id).maybeSingle();
          if (proj) projectName = (proj as any).name || null;
        }
      }
    }

    const { data: atcs } = await supabase
      .from('uat_assignment_test_cases')
      .select('id, test_case_id, status, sort_order')
      .eq('assignment_id', assignmentId)
      .eq('tester_id', testerId)
      .order('sort_order', { ascending: true });

    const cases: RunnerCase[] = [];

    if (atcs && atcs.length > 0) {
      const tcIds = atcs.map((a: any) => a.test_case_id);
      const [{ data: tcs }, { data: steps }, { data: results }] = await Promise.all([
        supabase.from('uat_test_cases')
          .select('id, reference, title, description, preconditions, expected_result, priority, is_required, required_evidence')
          .in('id', tcIds),
        supabase.from('uat_test_case_steps')
          .select('test_case_id, step_number, instruction, expected_result')
          .in('test_case_id', tcIds)
          .order('step_number', { ascending: true }),
        supabase.from('uat_test_case_results')
          .select('assignment_test_case_id, status, actual_result, tester_notes, blocker_reason, created_at')
          .in('assignment_test_case_id', atcs.map((a: any) => a.id))
          .order('created_at', { ascending: false }),
      ]);

      const tcMap: Record<string, any> = {};
      tcs?.forEach((tc: any) => { tcMap[tc.id] = tc; });

      const stepsMap: Record<string, any[]> = {};
      steps?.forEach((st: any) => {
        if (!stepsMap[st.test_case_id]) stepsMap[st.test_case_id] = [];
        stepsMap[st.test_case_id].push(st);
      });

      const resultMap: Record<string, any> = {};
      results?.forEach((r: any) => {
        if (!resultMap[r.assignment_test_case_id]) resultMap[r.assignment_test_case_id] = r;
      });

      const caseRules = parseEvidenceRules(
        normalizeEvidenceTags(atcs.flatMap((a: any) => tcMap[a.test_case_id]?.required_evidence || [])),
      );
      if (caseRules.notesOnFail) evidenceRules.notesOnFail = true;
      if (caseRules.screenshotOnFail) evidenceRules.screenshotOnFail = true;
      if (caseRules.videoOnFail) evidenceRules.videoOnFail = true;
      if (caseRules.deviceInfo) evidenceRules.deviceInfo = true;
      if (caseRules.browserInfo) evidenceRules.browserInfo = true;

      atcs.forEach((atc: any) => {
        const tc = tcMap[atc.test_case_id] || {};
        const res = resultMap[atc.id] || {};
        const caseSteps = (stepsMap[atc.test_case_id] || []).map((s: any) => ({
          step_number: s.step_number,
          instruction: s.instruction,
          expected_result: s.expected_result || null,
        }));
        cases.push({
          id: atc.id,
          test_case_id: atc.test_case_id,
          reference: tc.reference || 'N/A',
          title: tc.title || tc.reference || 'Untitled',
          description: tc.description || null,
          preconditions: tc.preconditions || null,
          expected_result: tc.expected_result || 'No expected result defined.',
          priority: tc.priority || 'medium',
          is_required: tc.is_required !== false,
          status: res.status || atc.status || 'not_started',
          steps: caseSteps,
          actual_result: res.actual_result || null,
          notes: res.tester_notes || null,
          blocker_reason: res.blocker_reason || null,
          editable: moreInfoMode && requestedCaseIds.includes(atc.id),
        });
      });
    }

    const { data: sess } = await supabase
      .from('uat_sessions')
      .select('id, status, browser_name, browser_version, operating_system, viewport_width, viewport_height')
      .eq('assignment_id', assignmentId)
      .in('status', ['active', 'paused'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    setState({
      ...initial,
      loading: false,
      title: jobTitle,
      projectName,
      deadline,
      agreedRewardLabel: formatReward(aData.agreed_reward_amount_minor, aData.currency || 'GBP'),
      assignmentStatus: aData.status,
      submittedAt: aData.submitted_at || null,
      requiredDevices,
      requiredBrowsers,
      evidenceRules,
      cases,
      session: (sess as RunnerSession | null) || null,
      currentIndex: cases.length > 0 ? 0 : -1,
      currentCase: cases.length > 0 ? cases[0] : null,
      moreInfoMode,
      reviewFeedback: aData.review_feedback || null,
      requestedCaseIds,
    });
  }, [assignmentId, testerId]);

  useEffect(() => {
    load();
  }, [load]);

  const setCurrent = useCallback((index: number) => {
    setState((s) => {
      const clamped = Math.max(0, Math.min(index, s.cases.length - 1));
      return { ...s, currentIndex: clamped, currentCase: s.cases[clamped] || null };
    });
  }, []);

  const next = useCallback(() => {
    setState((s) => {
      if (s.currentIndex >= s.cases.length - 1) return s;
      const idx = s.currentIndex + 1;
      return { ...s, currentIndex: idx, currentCase: s.cases[idx] || null };
    });
  }, []);

  const prev = useCallback(() => {
    setState((s) => {
      if (s.currentIndex <= 0) return s;
      const idx = s.currentIndex - 1;
      return { ...s, currentIndex: idx, currentCase: s.cases[idx] || null };
    });
  }, []);

  const patchCase = useCallback((caseId: string, patch: Partial<RunnerCase>) => {
    setState((s) => ({
      ...s,
      cases: s.cases.map((c) => (c.id === caseId ? { ...c, ...patch } : c)),
      currentCase: s.currentCase && s.currentCase.id === caseId ? { ...s.currentCase, ...patch } : s.currentCase,
    }));
  }, []);

  const saveResult = useCallback(async (
    caseId: string,
    status: string,
    actualResult: string | null,
    notes: string | null,
    blockerReason: string | null,
  ): Promise<{ ok: boolean; message?: string }> => {
    if (!state.session?.id) return { ok: false, message: 'No active session.' };
    setSaveState('saving');
    const { data, error } = await supabase.rpc('update_uat_test_case_result', {
      p_assignment_test_case_id: caseId,
      p_session_id: state.session.id,
      p_status: status,
      p_actual_result: actualResult || null,
      p_tester_notes: notes || null,
      p_blocker_reason: blockerReason || null,
    });

    if (!mountedRef.current) return { ok: false };

    if (error) {
      setSaveState('error');
      return { ok: false, message: error.message };
    }

    const result = data as any;
    if (!result?.success) {
      setSaveState('error');
      return { ok: false, message: result?.message || 'Failed to save.' };
    }

    patchCase(caseId, { status, actual_result: actualResult, notes, blocker_reason: blockerReason });
    setSaveState('saved');
    setTimeout(() => { if (mountedRef.current) setSaveState('idle'); }, 1200);
    return { ok: true };
  }, [state.session, patchCase]);

  const saveRequestedCase = useCallback(async (
    caseId: string,
    actualResult: string | null,
    notes: string | null,
    blockerReason: string | null,
  ): Promise<{ ok: boolean; message?: string }> => {
    const { data, error } = await supabase.rpc('update_uat_requested_case_result', {
      p_assignment_test_case_id: caseId,
      p_actual_result: actualResult || null,
      p_tester_notes: notes || null,
      p_blocker_reason: blockerReason || null,
    });

    if (!mountedRef.current) return { ok: false };

    if (error) return { ok: false, message: error.message };
    const result = data as any;
    if (!result?.success) return { ok: false, message: result?.message || 'Failed to save.' };

    patchCase(caseId, { actual_result: actualResult, notes, blocker_reason: blockerReason });
    return { ok: true };
  }, [patchCase]);

  const startSession = useCallback(async (): Promise<{ ok: boolean; message?: string }> => {
    setStarting(true);
    setStartError('');
    const meta = detectBrowserMetadata();
    const { data, error } = await supabase.rpc('start_uat_session', {
      p_assignment_id: assignmentId,
      p_browser_name: meta.browserName || null,
      p_browser_version: meta.browserVersion || null,
      p_operating_system: meta.os || null,
      p_viewport_width: meta.viewportWidth || null,
      p_viewport_height: meta.viewportHeight || null,
      p_user_agent: meta.userAgent || null,
    });

    if (!mountedRef.current) return { ok: false };
    setStarting(false);

    if (error) {
      setStartError(error.message);
      return { ok: false, message: error.message };
    }
    const result = data as any;
    if (!result?.success) {
      setStartError(result?.message || 'Failed to start session.');
      return { ok: false, message: result?.message || 'Failed to start session.' };
    }
    await load();
    return { ok: true };
  }, [assignmentId, load]);

  const submit = useCallback(async (): Promise<{ ok: boolean; message?: string }> => {
    if (!state.session?.id) return { ok: false, message: 'No active session to submit.' };
    setState((s) => ({ ...s, submitting: true, submitError: '' }));
    const { data, error } = await supabase.rpc('finish_uat_session', { p_session_id: state.session.id });

    if (!mountedRef.current) return { ok: false };
    setState((s) => ({ ...s, submitting: false }));

    if (error) {
      setState((s) => ({ ...s, submitError: error.message }));
      return { ok: false, message: error.message };
    }
    const result = data as any;
    if (!result?.success) {
      setState((s) => ({ ...s, submitError: result?.message || 'Failed to submit.' }));
      return { ok: false, message: result?.message || 'Failed to submit.' };
    }
    await load();
    return { ok: true };
  }, [state.session, load]);

  const resubmit = useCallback(async (): Promise<{ ok: boolean; message?: string }> => {
    setState((s) => ({ ...s, resubmitting: true, resubmitError: '' }));
    const { data, error } = await supabase.rpc('resubmit_uat_submission', { p_assignment_id: assignmentId });

    if (!mountedRef.current) return { ok: false };
    setState((s) => ({ ...s, resubmitting: false }));

    if (error) {
      setState((s) => ({ ...s, resubmitError: error.message }));
      return { ok: false, message: error.message };
    }
    const result = data as any;
    if (!result?.success) {
      setState((s) => ({ ...s, resubmitError: result?.message || 'Failed to resubmit.' }));
      return { ok: false, message: result?.message || 'Failed to resubmit.' };
    }
    return { ok: true };
  }, [assignmentId]);

  return {
    state,
    saveState,
    starting,
    startError,
    setCurrent,
    next,
    prev,
    saveResult,
    startSession,
    submit,
    saveRequestedCase,
    resubmit,
    refetch: load,
  };
}