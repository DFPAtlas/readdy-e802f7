'use client';

import Link from 'next/link';
import { ArrowLeft, Calendar, CircleCheck, LoaderCircle, CircleAlert } from 'lucide-react';

interface RunnerHeaderProps {
  title: string;
  projectName: string | null;
  deadline: string | null;
  agreedRewardLabel: string;
  completedCount: number;
  totalCount: number;
  currentReference: string | null;
  saveState: 'idle' | 'saving' | 'saved' | 'error';
  sessionStatus: string | null;
}

function formatDate(value: string | null): string {
  if (!value) return 'Not set';
  return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function RunnerHeader({
  title, projectName, deadline, agreedRewardLabel,
  completedCount, totalCount, currentReference, saveState, sessionStatus,
}: RunnerHeaderProps) {
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const expired = deadline ? new Date(deadline).getTime() < Date.now() : false;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <div className="min-w-0">
          <Link
            href="/uat/my-tests"
            className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-[#2878d0] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> My Tests
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            {projectName && (
              <span className="text-xs font-medium text-[#2878d0] bg-[#edf5ff] px-2 py-0.5 rounded-lg">{projectName}</span>
            )}
            <h1 className="text-lg font-bold text-[#17325c] leading-tight">{title}</h1>
          </div>
        </div>
        <span className="text-xl font-bold text-[#617a50]">{agreedRewardLabel}</span>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-slate-100 px-5 py-3">
        <span className="text-sm font-semibold text-[#17325c]">
          {completedCount} of {totalCount} completed
        </span>
        {currentReference && (
          <span className="text-xs text-slate-500">
            Current: <span className="font-mono font-semibold text-[#2878d0]">{currentReference}</span>
          </span>
        )}
        <span className={`flex items-center gap-1.5 text-xs ${expired ? 'text-red-500' : 'text-slate-500'}`}>
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          {expired ? 'Deadline passed' : `Deadline ${formatDate(deadline)}`}
        </span>
        <span className="flex items-center gap-1.5 text-xs">
          {saveState === 'saving' && <LoaderCircle className="h-3.5 w-3.5 animate-spin text-slate-400" />}
          {saveState === 'saved' && <CircleCheck className="h-3.5 w-3.5 text-emerald-500" />}
          {saveState === 'error' && <CircleAlert className="h-3.5 w-3.5 text-red-500" />}
          <span className={saveState === 'error' ? 'text-red-500' : 'text-slate-400'}>
            {saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? 'Saved' : saveState === 'error' ? 'Save failed' : sessionStatus === 'active' ? 'Autosave on' : 'Not started'}
          </span>
        </span>
      </div>

      <div className="px-5 pb-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-[#2878d0] transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}