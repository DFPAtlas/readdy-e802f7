'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useUATTester } from '@/components/uat/UATTesterProvider';
import { useUatRunner } from '@/hooks/useUatRunner';
import { validateSubmission, type RunnerCase } from '@/lib/uat-runner';
import UATPortalBreadcrumbs from '@/components/uat/portal/UATPortalBreadcrumbs';
import RunnerHeader from '@/components/uat/runner/RunnerHeader';
import CaseNavigator from '@/components/uat/runner/CaseNavigator';
import CaseRunner from '@/components/uat/runner/CaseRunner';
import ReviewScreen from '@/components/uat/runner/ReviewScreen';
import RequestedInfoPanel from '@/components/uat/runner/RequestedInfoPanel';
import { Ban, CircleAlert, CircleCheck, Play } from 'lucide-react';

interface ReviewData {
  totalCases: number;
  passed: number;
  failed: number;
  blocked: number;
  incomplete: number;
  evidenceTotal: number;
  missing: string[];
}

export default function RunnerClient({ assignmentId }: { assignmentId: string }) {
  const { tester } = useUATTester();
  const {
    state, saveState, starting, startError, startSession, saveResult, submit,
    setCurrent, next, prev, saveRequestedCase, resubmit,
  } = useUatRunner(assignmentId, tester.id);

  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const openReview = useCallback(async () => {
    setReviewLoading(true);
    setReviewOpen(true);
    setReviewData(null);

    const { data: evidence } = await supabase
      .from('uat_evidence')
      .select('assignment_test_case_id')
      .eq('assignment_id', assignmentId)
      .in('status', ['uploaded', 'attached']);

    const evidenceCountByCase: Record<string, number> = {};
    let evidenceTotal = 0;
    (evidence || []).forEach((e: any) => {
      evidenceTotal += 1;
      if (e.assignment_test_case_id) {
        evidenceCountByCase[e.assignment_test_case_id] = (evidenceCountByCase[e.assignment_test_case_id] || 0) + 1;
      }
    });

    const hasBrowserInfo = Boolean(state.session?.browser_name);
    const hasDeviceInfo = Boolean(state.session?.operating_system);

    const validation = validateSubmission(
      state.cases,
      state.evidenceRules,
      evidenceCountByCase,
      hasBrowserInfo,
      hasDeviceInfo,
    );

    const passed = state.cases.filter((c: RunnerCase) => c.status === 'passed').length;
    const failed = state.cases.filter((c: RunnerCase) => c.status === 'failed').length;
    const blocked = state.cases.filter((c: RunnerCase) => c.status === 'blocked').length;
    const incomplete = state.cases.filter((c: RunnerCase) => !['passed', 'failed', 'blocked', 'skipped'].includes(c.status)).length;

    setReviewData({
      totalCases: state.cases.length,
      passed, failed, blocked, incomplete,
      evidenceTotal,
      missing: validation.missing,
    });
    setReviewLoading(false);
  }, [assignmentId, state.cases, state.evidenceRules, state.session]);

  const handleSubmit = useCallback(async () => {
    const res = await submit();
    if (res.ok) {
      setReviewOpen(false);
      setSubmitted(true);
    }
  }, [submit]);

  const completedCount = state.cases.filter((c) => ['passed', 'failed', 'blocked', 'skipped'].includes(c.status)).length;

  if (state.loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-8 h-8 border-[3px] border-[#2878d0]/20 border-t-[#2878d0] rounded-full animate-spin" />
        <p className="text-sm text-slate-500">Loading test runner...</p>
      </div>
    );
  }

  if (state.notFound) {
    return (
      <>
        <UATPortalBreadcrumbs items={[{ label: 'My Tests', href: '/uat/my-tests' }, { label: 'Not Available' }]} />
        <div className="flex items-center justify-center py-16">
          <div className="bg-white border border-slate-100 rounded-3xl p-12 shadow-sm text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
              <CircleAlert className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-[#17325c] mb-2">Assignment Not Available</h3>
            <p className="text-slate-500 mb-6">This test assignment does not exist or does not belong to you.</p>
            <Link href="/uat/my-tests" className="inline-block px-5 py-2.5 bg-[#2878d0] rounded-xl text-sm font-semibold text-white cursor-pointer whitespace-nowrap">Back to My Tests</Link>
          </div>
        </div>
      </>
    );
  }

  if (state.blocked) {
    return (
      <>
        <UATPortalBreadcrumbs items={[{ label: 'My Tests', href: '/uat/my-tests' }, { label: 'Access Revoked' }]} />
        <div className="flex items-center justify-center py-16">
          <div className="bg-white border border-slate-100 rounded-3xl p-12 shadow-sm text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
              <Ban className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-[#17325c] mb-2">Access Revoked</h3>
            <p className="text-slate-500 mb-6">{state.blockedMessage}</p>
            <Link href="/uat/my-tests" className="inline-block px-5 py-2.5 bg-[#2878d0] rounded-xl text-sm font-semibold text-white cursor-pointer whitespace-nowrap">Back to My Tests</Link>
          </div>
        </div>
      </>
    );
  }

  if (state.moreInfoMode) {
    return (
      <RequestedInfoPanel
        assignmentId={assignmentId}
        title={state.title}
        projectName={state.projectName}
        reviewFeedback={state.reviewFeedback}
        cases={state.cases}
        onSaveCase={saveRequestedCase}
        onResubmit={resubmit}
        resubmitting={state.resubmitting}
      />
    );
  }

  if (submitted || ['submitted', 'review_required', 'retest_required', 'completed', 'complete', 'approved'].includes(state.assignmentStatus)) {
    return (
      <>
        <UATPortalBreadcrumbs items={[{ label: 'My Tests', href: '/uat/my-tests' }, { label: 'Submitted' }]} />
        <div className="flex items-center justify-center py-16">
          <div className="bg-white border border-slate-100 rounded-3xl p-12 shadow-sm text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-6">
              <CircleCheck className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-[#17325c] mb-2">UAT Submitted</h3>
            <p className="text-slate-500 mb-6">Your test is now awaiting DFP review.</p>
            <div className="mx-auto max-w-xs space-y-3 text-left mb-6">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <span className="text-sm text-slate-500">Agreed reward</span>
                <span className="text-sm font-bold text-[#617a50]">{state.agreedRewardLabel}</span>
              </div>
              {state.deadline && (
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500">Deadline</span>
                  <span className="text-sm font-semibold text-[#17325c]">
                    {new Date(state.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              )}
            </div>
            <Link
              href={`/uat/my-tests/view?id=${assignmentId}`}
              className="inline-block px-6 py-2.5 bg-[#2878d0] hover:bg-[#1e68b9] rounded-xl text-sm font-semibold text-white cursor-pointer whitespace-nowrap transition-colors"
            >
              Go to My Test
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (!state.session) {
    return (
      <>
        <UATPortalBreadcrumbs items={[{ label: 'My Tests', href: '/uat/my-tests' }, { label: state.title || 'Test' }]} />
        <div className="flex items-center justify-center py-16">
          <div className="bg-white border border-slate-100 rounded-3xl p-12 shadow-sm text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-[#edf5ff] flex items-center justify-center mx-auto mb-6">
              <Play className="w-8 h-8 text-[#2878d0]" />
            </div>
            <h3 className="text-xl font-bold text-[#17325c] mb-1">{state.title || 'UAT Assignment'}</h3>
            {state.projectName && <p className="text-sm text-slate-500 mb-4">{state.projectName}</p>}
            <p className="text-slate-500 mb-6">
              {state.cases.length > 0
                ? `Work through ${state.cases.length} test case${state.cases.length === 1 ? '' : 's'} and submit your results.`
                : 'Start your testing session to begin.'}
            </p>
            {startError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600">{startError}</div>
            )}
            <button
              onClick={startSession}
              disabled={starting}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2878d0] hover:bg-[#1e68b9] disabled:opacity-50 rounded-xl text-sm font-semibold text-white cursor-pointer whitespace-nowrap transition-colors"
            >
              <Play className="h-4 w-4" /> Start Test
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!state.currentCase) {
    return (
      <>
        <UATPortalBreadcrumbs items={[{ label: 'My Tests', href: '/uat/my-tests' }, { label: state.title || 'Test' }]} />
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-8 text-center">
          <p className="text-slate-500">No test cases are assigned to this test yet.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <UATPortalBreadcrumbs items={[{ label: 'My Tests', href: '/uat/my-tests' }, { label: state.title || 'Run Test' }]} />

      <div className="mt-4 space-y-4">
        <RunnerHeader
          title={state.title}
          projectName={state.projectName}
          deadline={state.deadline}
          agreedRewardLabel={state.agreedRewardLabel}
          completedCount={completedCount}
          totalCount={state.cases.length}
          currentReference={state.currentCase.reference}
          saveState={saveState}
          sessionStatus={state.session.status}
        />

        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm px-4 py-3">
          <CaseNavigator cases={state.cases} currentIndex={state.currentIndex} onSelect={setCurrent} />
        </div>

        <div className="max-w-3xl">
          <CaseRunner
            assignmentId={assignmentId}
            caseItem={state.currentCase}
            session={state.session}
            evidenceRules={state.evidenceRules}
            saveState={saveState}
            isFirst={state.currentIndex === 0}
            isLast={state.currentIndex === state.cases.length - 1}
            onSave={saveResult}
            onNext={next}
            onPrev={prev}
            onFinish={() => openReview()}
          />
        </div>

        <div className="flex justify-end max-w-3xl">
          <button
            onClick={openReview}
            disabled={reviewLoading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#617a50] hover:bg-[#546a43] disabled:opacity-50 text-sm font-semibold text-white cursor-pointer whitespace-nowrap transition-colors"
          >
            <CircleCheck className="h-4 w-4" /> Review &amp; Submit
          </button>
        </div>
      </div>

      <ReviewScreen
        open={reviewOpen}
        totalCases={reviewData?.totalCases ?? state.cases.length}
        passed={reviewData?.passed ?? 0}
        failed={reviewData?.failed ?? 0}
        blocked={reviewData?.blocked ?? 0}
        incomplete={reviewData?.incomplete ?? 0}
        agreedRewardLabel={state.agreedRewardLabel}
        evidenceTotal={reviewData?.evidenceTotal ?? 0}
        missing={reviewData?.missing ?? []}
        submitting={state.submitting}
        submitError={state.submitError}
        loading={reviewLoading}
        onClose={() => setReviewOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}