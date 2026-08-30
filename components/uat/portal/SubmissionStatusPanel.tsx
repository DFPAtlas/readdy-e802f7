'use client';

import {
  Calendar, CheckCircle2, XCircle, AlertTriangle,
  ClipboardList, FileCheck2, Info, Clock, ArrowRight,
} from 'lucide-react';
import { rewardStatusBadge, rewardStatusExplanation, type RewardStatus } from '@/lib/uat-earnings';
import type { ReviewCategory } from '@/lib/uat-assignment';

interface RequestedCaseItem {
  id: string;
  reference: string;
  title: string;
}

interface SubmissionStatusPanelProps {
  jobTitle: string;
  projectName: string | null;
  statusLabel: string;
  statusBadge: string;
  reviewCategory: ReviewCategory;
  submittedAt: string | null;
  completedAt: string | null;
  reviewedAt: string | null;
  totalCases: number;
  passedCount: number;
  failedCount: number;
  blockedCount: number;
  agreedRewardLabel: string;
  rewardStatus: RewardStatus | null;
  reviewFeedback: string | null;
  responseDeadline: string | null;
  requestedCases: RequestedCaseItem[];
  onUpdateRequestedItems: () => void;
  onViewMyTests: () => void;
}

function formatDate(value: string | null): string {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function SubmissionStatusPanel({
  jobTitle,
  projectName,
  statusLabel,
  statusBadge,
  reviewCategory,
  submittedAt,
  completedAt,
  reviewedAt,
  totalCases,
  passedCount,
  failedCount,
  blockedCount,
  agreedRewardLabel,
  rewardStatus,
  reviewFeedback,
  responseDeadline,
  requestedCases,
  onUpdateRequestedItems,
  onViewMyTests,
}: SubmissionStatusPanelProps) {
  const isMoreInfo = reviewCategory === 'more_info';
  const isAccepted = reviewCategory === 'accepted';
  const isRejected = reviewCategory === 'rejected';
  const reward = rewardStatus || 'Pending Review';

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {projectName && (
                <span className="text-xs font-medium text-[#2878d0] bg-[#edf5ff] px-2 py-0.5 rounded-lg">{projectName}</span>
              )}
              <span className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadge}`}>
                {statusLabel}
              </span>
            </div>
            <h2 className="mt-2 text-lg font-bold text-[#17325c]">{jobTitle}</h2>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50">
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
          </div>
        </div>

        <div className="px-6 py-5">
          {isMoreInfo && (
            <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                  <Info className="h-4 w-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-blue-800">More Information Required</p>
                  <p className="mt-1 text-sm text-blue-700">
                    DFP has requested additional information before this submission can be accepted.
                  </p>
                </div>
              </div>

              {requestedCases.length > 0 && (
                <div className="mt-4 rounded-xl bg-white border border-blue-100 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Cases requiring more information</p>
                  <ul className="space-y-1.5">
                    {requestedCases.map((c) => (
                      <li key={c.id} className="flex items-center gap-2 text-sm text-slate-700">
                        <span className="font-mono font-semibold text-[#2878d0]">{c.reference}</span>
                        <span className="truncate">{c.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={onUpdateRequestedItems}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2878d0] hover:bg-[#1e68b9] text-sm font-semibold text-white cursor-pointer whitespace-nowrap transition-colors"
              >
                Update Requested Items <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {isAccepted && (
            <div className="mb-5 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-emerald-800">Submission Accepted</p>
                  <p className="mt-1 text-sm text-emerald-700">
                    DFP has accepted your work. Your reward is shown separately below.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isRejected && (
            <div className="mb-5 rounded-xl border border-rose-100 bg-rose-50/60 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-100">
                  <XCircle className="h-4 w-4 text-rose-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-rose-800">Submission Not Accepted</p>
                  <p className="mt-1 text-sm text-rose-700">
                    This submission was not accepted at this time.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <span className="flex items-center gap-2 text-sm text-slate-500">
                <Calendar className="h-4 w-4 text-slate-400" /> Submitted
              </span>
              <span className="text-sm font-semibold text-[#17325c]">{formatDate(submittedAt)}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <span className="flex items-center gap-2 text-sm text-slate-500">
                <ClipboardList className="h-4 w-4 text-slate-400" /> Cases completed
              </span>
              <span className="text-sm font-semibold text-[#17325c]">
                {passedCount + failedCount + blockedCount} / {totalCases}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <span className="flex items-center gap-2 text-sm text-slate-500">
                <FileCheck2 className="h-4 w-4 text-slate-400" /> Agreed reward
              </span>
              <span className="text-sm font-bold text-[#617a50]">{agreedRewardLabel}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <span className="flex items-center gap-2 text-sm text-slate-500">
                <Clock className="h-4 w-4 text-slate-400" /> Reward status
              </span>
              <span className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${rewardStatusBadge(reward)}`}>
                {reward}
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3 text-center">
              <p className="text-2xl font-bold text-emerald-600">{passedCount}</p>
              <p className="text-xs font-semibold text-emerald-700">Passed</p>
            </div>
            <div className="rounded-xl border border-rose-100 bg-rose-50/40 p-3 text-center">
              <p className="text-2xl font-bold text-rose-600">{failedCount}</p>
              <p className="text-xs font-semibold text-rose-700">Failed</p>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-3 text-center">
              <p className="text-2xl font-bold text-amber-600">{blockedCount}</p>
              <p className="text-xs font-semibold text-amber-700">Blocked</p>
            </div>
          </div>

          {rewardStatus && (
            <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
              {rewardStatusExplanation(reward)}
            </p>
          )}
        </div>
      </div>

      {reviewFeedback ? (
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-bold text-[#17325c]">DFP Feedback</h3>
            </div>
            {reviewedAt && <p className="mt-1 text-xs text-slate-400">Reviewed {formatDate(reviewedAt)}</p>}
          </div>
          <div className="px-6 py-4">
            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{reviewFeedback}</p>
            {isMoreInfo && responseDeadline && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>Please respond by <strong>{formatDate(responseDeadline)}</strong></span>
              </div>
            )}
          </div>
        </div>
      ) : null}

      <div className="flex justify-center gap-3">
        <button
          onClick={onViewMyTests}
          className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm font-semibold text-slate-600 transition-colors cursor-pointer whitespace-nowrap"
        >
          Back to My Tests
        </button>
      </div>
    </div>
  );
}