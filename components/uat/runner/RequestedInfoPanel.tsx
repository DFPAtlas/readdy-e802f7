'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Info, CircleAlert, CircleCheck, LoaderCircle, Lock, Save, Send } from 'lucide-react';
import type { RunnerCase } from '@/lib/uat-runner';
import UATPortalBreadcrumbs from '@/components/uat/portal/UATPortalBreadcrumbs';
import CaseEvidence from './CaseEvidence';

interface RequestedInfoPanelProps {
  assignmentId: string;
  title: string;
  projectName: string | null;
  reviewFeedback: string | null;
  cases: RunnerCase[];
  onSaveCase: (
    caseId: string,
    actualResult: string | null,
    notes: string | null,
    blockerReason: string | null,
  ) => Promise<{ ok: boolean; message?: string }>;
  onResubmit: () => Promise<{ ok: boolean; message?: string }>;
  resubmitting: boolean;
}

const statusBadge: Record<string, string> = {
  passed: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-red-100 text-red-700',
  blocked: 'bg-amber-100 text-amber-700',
  skipped: 'bg-slate-100 text-slate-600',
  in_progress: 'bg-sky-100 text-sky-700',
  not_started: 'bg-slate-100 text-slate-500',
};

function RequestedCaseEditor({
  assignmentId,
  caseItem,
  onSaveCase,
}: {
  assignmentId: string;
  caseItem: RunnerCase;
  onSaveCase: RequestedInfoPanelProps['onSaveCase'];
}) {
  const [actualResult, setActualResult] = useState(caseItem.actual_result || '');
  const [notes, setNotes] = useState(caseItem.notes || '');
  const [blockerReason, setBlockerReason] = useState(caseItem.blocker_reason || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError('');
    const res = await onSaveCase(
      caseItem.id,
      actualResult || null,
      notes || null,
      blockerReason || null,
    );
    setSaving(false);
    if (!res.ok) {
      setError(res.message || 'Failed to save.');
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [onSaveCase, caseItem.id, actualResult, notes, blockerReason]);

  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-xs font-mono font-bold text-[#2878d0] bg-white px-2 py-0.5 rounded-md border border-blue-100">
          {caseItem.reference}
        </span>
        <h3 className="text-sm font-bold text-[#17325c]">{caseItem.title}</h3>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusBadge[caseItem.status] || 'bg-slate-100 text-slate-600'}`}>
          {caseItem.status.replace(/_/g, ' ')}
        </span>
      </div>

      <p className="text-xs text-blue-700 mb-4">
        DFP has requested additional information for this case. Update the details below, then resubmit.
      </p>

      <div className="space-y-3 bg-white rounded-xl border border-blue-100 p-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Actual Result</label>
          <textarea
            value={actualResult}
            onChange={(e) => setActualResult(e.target.value)}
            rows={3}
            placeholder="Clarify what actually happened..."
            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2878d0]/20 focus:border-[#2878d0]/40 resize-none transition-all"
          />
        </div>

        {caseItem.status === 'blocked' && (
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Blocker Reason</label>
            <textarea
              value={blockerReason}
              onChange={(e) => setBlockerReason(e.target.value)}
              rows={2}
              placeholder="Explain why this case is blocked..."
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2878d0]/20 focus:border-[#2878d0]/40 resize-none transition-all"
            />
          </div>
        )}

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Additional observations..."
            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2878d0]/20 focus:border-[#2878d0]/40 resize-none transition-all"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            {saving && <span className="text-slate-400 flex items-center gap-1"><LoaderCircle className="w-3 h-3 animate-spin" /> Saving...</span>}
            {saved && <span className="text-emerald-500 flex items-center gap-1"><CircleCheck className="w-3 h-3" /> Saved</span>}
            {error && <span className="text-red-500 flex items-center gap-1"><CircleAlert className="w-3 h-3" /> {error}</span>}
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2878d0] hover:bg-[#1e68b9] disabled:opacity-50 rounded-xl text-xs font-semibold text-white cursor-pointer whitespace-nowrap transition-colors"
          >
            <Save className="w-3.5 h-3.5" /> Save Update
          </button>
        </div>
      </div>

      <div className="mt-4">
        <CaseEvidence
          assignmentId={assignmentId}
          assignmentTestCaseId={caseItem.id}
          sessionId={null}
          canModify
          requiredOnFail={false}
          onCountChange={() => {}}
        />
      </div>
    </div>
  );
}

export default function RequestedInfoPanel({
  assignmentId,
  title,
  projectName,
  reviewFeedback,
  cases,
  onSaveCase,
  onResubmit,
  resubmitting,
}: RequestedInfoPanelProps) {
  const router = useRouter();
  const [resubmitted, setResubmitted] = useState(false);
  const [resubmitError, setResubmitError] = useState('');

  const requestedCases = cases.filter((c) => c.editable);
  const lockedCases = cases.filter((c) => !c.editable);

  const handleResubmit = useCallback(async () => {
    setResubmitError('');
    const res = await onResubmit();
    if (!res.ok) {
      setResubmitError(res.message || 'Failed to resubmit.');
      return;
    }
    setResubmitted(true);
  }, [onResubmit]);

  if (resubmitted) {
    return (
      <>
        <UATPortalBreadcrumbs items={[{ label: 'My Tests', href: '/uat/my-tests' }, { label: title || 'Test' }]} />
        <div className="flex items-center justify-center py-16">
          <div className="bg-white border border-slate-100 rounded-3xl p-12 shadow-sm text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-6">
              <CircleCheck className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-[#17325c] mb-2">UAT Resubmitted</h3>
            <p className="text-slate-500 mb-6">Your updated information has been sent to DFP for review.</p>
            <button
              onClick={() => router.push(`/uat/my-tests/view?id=${assignmentId}`)}
              className="px-6 py-2.5 bg-[#2878d0] hover:bg-[#1e68b9] rounded-xl text-sm font-semibold text-white cursor-pointer whitespace-nowrap transition-colors"
            >
              Back to Test
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <UATPortalBreadcrumbs items={[{ label: 'My Tests', href: '/uat/my-tests' }, { label: title || 'Requested Information' }]} />

      <div className="mt-4 mx-auto max-w-3xl space-y-4">
        <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100">
              <Info className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-blue-800">More Information Required</h2>
              <p className="mt-0.5 text-sm text-blue-700">
                DFP has requested additional information for the case(s) below before your submission can be accepted.
              </p>
            </div>
          </div>

          {reviewFeedback && (
            <div className="mt-4 rounded-xl bg-white border border-blue-100 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">DFP Feedback</p>
              <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{reviewFeedback}</p>
            </div>
          )}
        </div>

        {requestedCases.length === 0 && (
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-6 text-center">
            <p className="text-sm text-slate-500">No specific cases are pending additional information.</p>
          </div>
        )}

        {requestedCases.map((c) => (
          <RequestedCaseEditor key={c.id} assignmentId={assignmentId} caseItem={c} onSaveCase={onSaveCase} />
        ))}

        {lockedCases.length > 0 && (
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3">
              <Lock className="h-4 w-4 text-slate-400" />
              <h3 className="text-sm font-bold text-[#17325c]">Remaining Cases (Read-only)</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {lockedCases.map((c) => (
                <div key={c.id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-mono font-bold text-slate-400">{c.reference}</span>
                    <span className="text-sm text-slate-600 truncate">{c.title}</span>
                  </div>
                  <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusBadge[c.status] || 'bg-slate-100 text-slate-600'}`}>
                    {c.status.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {resubmitError && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-4 flex items-start gap-2">
            <CircleAlert className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{resubmitError}</p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={() => router.push(`/uat/my-tests/view?id=${assignmentId}`)}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm font-semibold text-slate-600 cursor-pointer whitespace-nowrap transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleResubmit}
            disabled={resubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2878d0] hover:bg-[#1e68b9] disabled:opacity-50 text-sm font-semibold text-white cursor-pointer whitespace-nowrap transition-colors"
          >
            {resubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Resubmit for Review
          </button>
        </div>
      </div>
    </>
  );
}