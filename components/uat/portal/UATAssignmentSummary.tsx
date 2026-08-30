'use client';

import {
  Calendar, Clock, Globe, ExternalLink, ShieldCheck,
  Smartphone, Monitor, FileCheck2,
} from 'lucide-react';

interface UATAssignmentSummaryProps {
  statusLabel: string;
  statusBadge: string;
  agreedRewardLabel: string;
  deadline: string | null;
  estimatedDuration: string | null;
  requiredDevices: string[];
  requiredBrowsers: string[];
  evidenceRequirements: string | null;
  progressCompleted: number;
  progressTotal: number;
  environmentUrl: string | null;
  testerLoginUrl: string | null;
  environmentName: string | null;
  onOpenTestWebsite: () => void;
}

function formatDate(value: string | null): string {
  if (!value) return 'Not set';
  return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function UATAssignmentSummary({
  statusLabel,
  statusBadge,
  agreedRewardLabel,
  deadline,
  estimatedDuration,
  requiredDevices,
  requiredBrowsers,
  evidenceRequirements,
  progressCompleted,
  progressTotal,
  environmentUrl,
  testerLoginUrl,
  environmentName,
  onOpenTestWebsite,
}: UATAssignmentSummaryProps) {
  const expired = deadline ? new Date(deadline).getTime() < Date.now() : false;
  const hasAccess = Boolean(testerLoginUrl || environmentUrl);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadge}`}>
            {statusLabel}
          </span>
          <span className="text-sm text-slate-500">Assignment overview</span>
        </div>
        <span className="text-2xl font-bold text-[#617a50]">{agreedRewardLabel}</span>
      </div>

      <div className="grid gap-5 px-5 py-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[#2878d0]">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Deadline</p>
            <p className={`mt-0.5 text-sm font-semibold ${expired ? 'text-red-500' : 'text-[#17325c]'}`}>
              {formatDate(deadline)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[#2878d0]">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Estimated time</p>
            <p className="mt-0.5 text-sm font-semibold text-[#17325c]">{estimatedDuration || 'Not specified'}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[#2878d0]">
            <FileCheck2 className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Agreed reward</p>
            <p className="mt-0.5 text-sm font-semibold text-[#17325c]">{agreedRewardLabel}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[#2878d0]">
            <Smartphone className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-400">Required devices</p>
            <p className="mt-0.5 text-sm font-semibold text-[#17325c]">
              {requiredDevices.length > 0 ? requiredDevices.join(', ') : 'Any device'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[#2878d0]">
            <Monitor className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-400">Required browsers</p>
            <p className="mt-0.5 text-sm font-semibold text-[#17325c]">
              {requiredBrowsers.length > 0 ? requiredBrowsers.join(', ') : 'Any browser'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[#2878d0]">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-400">Evidence requirements</p>
            <p className="mt-0.5 text-sm font-semibold text-[#17325c]">
              {evidenceRequirements || 'Follow the test-case guidance'}
            </p>
          </div>
        </div>
      </div>

      {progressTotal > 0 && (
        <div className="border-t border-slate-100 px-5 py-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-[#17325c]">Progress</span>
            <span className="text-slate-500">
              {progressCompleted} / {progressTotal} completed ({progressTotal === 0 ? 0 : Math.round((progressCompleted / progressTotal) * 100)}%)
            </span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#2878d0] transition-all"
              style={{ width: `${progressTotal === 0 ? 0 : (progressCompleted / progressTotal) * 100}%` }}
            />
          </div>
        </div>
      )}

      {hasAccess && (
        <div className="border-t border-slate-100 bg-[#f8fafc] px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#17325c]">Testing access</p>
                <p className="text-xs text-slate-500">
                  {environmentName || 'Test environment'} · available for this assignment
                </p>
              </div>
            </div>
            <button
              onClick={onOpenTestWebsite}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#2878d0] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1e68b9] transition-colors cursor-pointer whitespace-nowrap"
            >
              Open Test Site <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}