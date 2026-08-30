'use client';

import { X, CircleCheck, CircleX, Minus, Circle, CircleAlert, LoaderCircle, Paperclip, ShieldCheck } from 'lucide-react';

interface ReviewScreenProps {
  open: boolean;
  totalCases: number;
  passed: number;
  failed: number;
  blocked: number;
  incomplete: number;
  agreedRewardLabel: string;
  evidenceTotal: number;
  missing: string[];
  submitting: boolean;
  submitError: string;
  loading?: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

function Stat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 text-center">
      <div className={`flex items-center justify-center gap-1.5 ${color}`}>
        {icon}
        <span className="text-xl font-bold">{value}</span>
      </div>
      <p className="mt-1 text-[11px] text-slate-400">{label}</p>
    </div>
  );
}

export default function ReviewScreen({
  open, totalCases, passed, failed, blocked, incomplete,
  agreedRewardLabel, evidenceTotal, missing, submitting, submitError, loading, onClose, onSubmit,
}: ReviewScreenProps) {
  if (!open) return null;

  const canSubmit = !loading && missing.length === 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-[#17325c]">Review &amp; Submit</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 cursor-pointer text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-6 text-slate-400">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              <span className="text-sm">Checking your submission...</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-5 gap-2">
                <Stat icon={<Circle className="h-4 w-4 text-slate-500" />} label="Total" value={totalCases} color="text-slate-600" />
                <Stat icon={<CircleCheck className="h-4 w-4" />} label="Passed" value={passed} color="text-emerald-600" />
                <Stat icon={<CircleX className="h-4 w-4" />} label="Failed" value={failed} color="text-red-600" />
                <Stat icon={<Minus className="h-4 w-4" />} label="Blocked" value={blocked} color="text-amber-600" />
                <Stat icon={<Circle className="h-4 w-4" />} label="Incomplete" value={incomplete} color="text-slate-400" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500">Agreed reward</span>
                  <span className="text-sm font-bold text-[#617a50]">{agreedRewardLabel}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500 flex items-center gap-2">
                    <Paperclip className="h-4 w-4 text-slate-400" /> Evidence items
                  </span>
                  <span className="text-sm font-semibold text-[#17325c]">{evidenceTotal}</span>
                </div>
              </div>

              {missing.length > 0 && (
                <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CircleAlert className="h-4 w-4 text-red-500" />
                    <p className="text-sm font-semibold text-red-700">Complete the following before submitting:</p>
                  </div>
                  <ul className="space-y-1.5">
                    {missing.map((m, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-red-600">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {canSubmit && (
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-[#2878d0] shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-500">
                    Submitting sends your work to DFP for review. Your reward is not approved automatically and will be
                    reviewed against your completed test cases and evidence.
                  </p>
                </div>
              )}

              {submitError && (
                <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-xs text-red-600">{submitError}</div>
              )}
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm font-semibold text-slate-600 cursor-pointer whitespace-nowrap transition-colors"
          >
            Back to Tests
          </button>
          <button
            onClick={onSubmit}
            disabled={!canSubmit || submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2878d0] hover:bg-[#1e68b9] disabled:opacity-40 text-sm font-semibold text-white cursor-pointer whitespace-nowrap transition-colors"
          >
            {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <CircleCheck className="h-4 w-4" />}
            Submit UAT
          </button>
        </div>
      </div>
    </div>
  );
}