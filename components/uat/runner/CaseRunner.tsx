'use client';

import { useState, useEffect, useCallback } from 'react';
import { AlertCircle, Loader2, Check, X, Minus, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import type { RunnerCase, RunnerSession, EvidenceRules } from '@/lib/uat-runner';
import CaseEvidence from './CaseEvidence';

interface CaseRunnerProps {
  assignmentId: string;
  caseItem: RunnerCase;
  session: RunnerSession | null;
  evidenceRules: EvidenceRules;
  saveState: 'idle' | 'saving' | 'saved' | 'error';
  isFirst: boolean;
  isLast: boolean;
  onSave: (
    caseId: string,
    status: string,
    actualResult: string | null,
    notes: string | null,
    blockerReason: string | null,
  ) => Promise<{ ok: boolean; message?: string }>;
  onNext: () => void;
  onPrev: () => void;
  onFinish?: () => void;
}

export default function CaseRunner({
  assignmentId,
  caseItem,
  session,
  evidenceRules,
  saveState,
  isFirst,
  isLast,
  onSave,
  onNext,
  onPrev,
  onFinish,
}: CaseRunnerProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [actualResult, setActualResult] = useState('');
  const [notes, setNotes] = useState('');
  const [blockerReason, setBlockerReason] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [savingNow, setSavingNow] = useState(false);
  const [evidenceCount, setEvidenceCount] = useState(0);

  useEffect(() => {
    setSelectedStatus(['passed', 'failed', 'blocked', 'skipped'].includes(caseItem.status) ? caseItem.status : '');
    setActualResult(caseItem.actual_result || '');
    setNotes(caseItem.notes || '');
    setBlockerReason(caseItem.blocker_reason || '');
    setUpdateError('');
  }, [caseItem.id]);

  const canModify = Boolean(session && (session.status === 'active' || session.status === 'paused'));
  const requiresEvidence = evidenceRules.screenshotOnFail || evidenceRules.videoOnFail;

  const validate = useCallback((): string => {
    if (!selectedStatus) return 'Choose Pass, Fail or Blocked for this case.';
    if (selectedStatus === 'failed' && !actualResult.trim()) {
      return 'Describe the actual result before marking as failed.';
    }
    if (selectedStatus === 'blocked' && !blockerReason.trim()) {
      return 'Provide a blocker reason before marking as blocked.';
    }
    if (
      (selectedStatus === 'failed' || selectedStatus === 'blocked') &&
      requiresEvidence &&
      evidenceCount === 0
    ) {
      return 'Attach evidence before saving a failed or blocked case.';
    }
    return '';
  }, [selectedStatus, actualResult, blockerReason, requiresEvidence, evidenceCount]);

  const handleSave = useCallback(async (advance: boolean) => {
    const err = validate();
    if (err) {
      setUpdateError(err);
      return;
    }
    setSavingNow(true);
    setUpdateError('');
    const res = await onSave(
      caseItem.id,
      selectedStatus,
      actualResult || null,
      notes || null,
      blockerReason || null,
    );
    setSavingNow(false);
    if (!res.ok) {
      setUpdateError(res.message || 'Failed to save.');
      return;
    }
    if (advance) {
      if (isLast && onFinish) onFinish();
      else onNext();
    }
  }, [validate, onSave, caseItem.id, selectedStatus, actualResult, notes, blockerReason, onNext, isLast, onFinish]);

  const priorityLabel = caseItem.priority.charAt(0).toUpperCase() + caseItem.priority.slice(1);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm" data-testid="uat-runner-case">
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-xs font-mono font-bold text-[#2878d0] bg-[#edf5ff] px-2 py-0.5 rounded-md">{caseItem.reference}</span>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
            caseItem.priority === 'critical' ? 'text-red-600 bg-red-50' :
            caseItem.priority === 'high' ? 'text-orange-600 bg-orange-50' :
            caseItem.priority === 'medium' ? 'text-amber-600 bg-amber-50' :
            'text-slate-500 bg-slate-100'
          }`}>{priorityLabel}</span>
          {caseItem.is_required && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md text-slate-500 bg-slate-100">Required</span>
          )}
        </div>
        <h2 className="text-lg font-bold text-[#17325c] leading-snug">{caseItem.title}</h2>
      </div>

      <div className="px-5 py-4 space-y-5">
        {caseItem.description && (
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Objective</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{caseItem.description}</p>
          </div>
        )}

        {caseItem.preconditions && (
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Preconditions</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{caseItem.preconditions}</p>
          </div>
        )}

        {caseItem.steps.length > 0 && (
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Steps</h4>
            <ol className="space-y-2">
              {caseItem.steps.map((step) => (
                <li key={step.step_number} className="flex gap-3 p-3 bg-slate-50 rounded-xl">
                  <span className="w-6 h-6 rounded-full bg-[#2878d0] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {step.step_number}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-slate-700 leading-relaxed">{step.instruction}</p>
                    {step.expected_result && (
                      <p className="text-xs text-slate-400 mt-1">Expected: {step.expected_result}</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Expected Result</h4>
          <p className="text-sm text-emerald-700 bg-emerald-50 rounded-xl p-3 leading-relaxed">{caseItem.expected_result}</p>
        </div>

        {canModify && (
          <div className="border-t border-slate-100 pt-5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Your Result</h4>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedStatus('passed')}
                aria-pressed={selectedStatus === 'passed'}
                className={`flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer whitespace-nowrap border ${
                  selectedStatus === 'passed' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-emerald-600 border-emerald-200 hover:border-emerald-400'
                }`}
              >
                <Check className="h-4 w-4" /> Pass
              </button>
              <button
                onClick={() => setSelectedStatus('failed')}
                aria-pressed={selectedStatus === 'failed'}
                className={`flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer whitespace-nowrap border ${
                  selectedStatus === 'failed' ? 'bg-red-500 text-white border-red-500' : 'bg-white text-red-600 border-red-200 hover:border-red-400'
                }`}
              >
                <X className="h-4 w-4" /> Fail
              </button>
              <button
                onClick={() => setSelectedStatus('blocked')}
                aria-pressed={selectedStatus === 'blocked'}
                className={`flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer whitespace-nowrap border ${
                  selectedStatus === 'blocked' ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-amber-600 border-amber-200 hover:border-amber-400'
                }`}
              >
                <Minus className="h-4 w-4" /> Blocked
              </button>
            </div>

            {(selectedStatus === 'failed' || caseItem.status === 'failed') && (
              <div className="mt-4">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Actual Result <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={actualResult}
                  onChange={(e) => setActualResult(e.target.value)}
                  placeholder="Describe what actually happened..."
                  rows={3}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2878d0]/20 focus:border-[#2878d0]/40 resize-none transition-all"
                />
              </div>
            )}

            {(selectedStatus === 'blocked' || caseItem.status === 'blocked') && (
              <div className="mt-4">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Blocker Reason <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={blockerReason}
                  onChange={(e) => setBlockerReason(e.target.value)}
                  placeholder="Why is this test case blocked?"
                  rows={2}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2878d0]/20 focus:border-[#2878d0]/40 resize-none transition-all"
                />
              </div>
            )}

            <div className="mt-4">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Notes {selectedStatus === 'failed' && evidenceRules.notesOnFail && <span className="text-red-400">*</span>}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional observations..."
                rows={2}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2878d0]/20 focus:border-[#2878d0]/40 resize-none transition-all"
              />
            </div>

            {updateError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-sm text-red-600">{updateError}</p>
              </div>
            )}
          </div>
        )}

        <div className="border-t border-slate-100 pt-4">
          <CaseEvidence
            assignmentId={assignmentId}
            assignmentTestCaseId={caseItem.id}
            sessionId={session ? session.id : null}
            canModify={canModify}
            requiredOnFail={requiresEvidence}
            onCountChange={setEvidenceCount}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
        <button
          onClick={onPrev}
          disabled={isFirst || savingNow}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-sm font-semibold text-slate-600 cursor-pointer whitespace-nowrap transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </button>

        {canModify ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSave(false)}
              disabled={savingNow || saveState === 'saving'}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-[#2878d0]/40 text-sm font-semibold text-slate-600 cursor-pointer whitespace-nowrap transition-colors"
            >
              {saveState === 'saving' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={savingNow || saveState === 'saving'}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#2878d0] hover:bg-[#1e68b9] disabled:opacity-50 text-sm font-semibold text-white cursor-pointer whitespace-nowrap transition-colors"
            >
              {savingNow ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isLast ? 'Save & Finish' : 'Save & Next'}
              {!isLast && <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
        ) : (
          <span className="text-xs text-slate-400">This case is read-only.</span>
        )}
      </div>
    </div>
  );
}