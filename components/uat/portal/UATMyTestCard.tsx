'use client';

import Link from 'next/link';
import { Calendar, Clock, Play } from 'lucide-react';
import type { MyTestItem } from '@/hooks/useMyTests';

function formatDate(value: string | null): string {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function UATMyTestCard({ item }: { item: MyTestItem }) {
  const expired = item.deadline ? new Date(item.deadline).getTime() < Date.now() : false;

  return (
    <div className="px-5 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {item.project_name && (
              <span className="text-xs font-medium text-[#2878d0] bg-[#edf5ff] px-2 py-0.5 rounded-lg">{item.project_name}</span>
            )}
            <span className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${item.status_badge}`}>
              {item.status_label}
            </span>
          </div>
          <h3 className="mt-1.5 text-base font-bold text-[#17325c]">{item.job_title}</h3>

          <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>Assigned {formatDate(item.assigned_at)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>Last activity {formatDate(item.last_activity)}</span>
            </div>
            <div className={`flex items-center gap-1.5 text-xs ${expired ? 'text-red-500' : 'text-slate-500'}`}>
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>{expired ? 'Deadline passed' : `Deadline ${formatDate(item.deadline)}`}</span>
            </div>
          </div>

          {item.progress_total > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Progress</span>
                <span className="font-semibold text-[#17325c]">
                  {item.progress_completed} / {item.progress_total} completed ({item.progress_percent}%)
                </span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#2878d0] transition-all"
                  style={{ width: `${item.progress_percent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="text-lg font-bold text-[#617a50]">{item.agreed_reward_label}</span>
          <div className="flex items-center gap-2">
            <Link
              href={`/uat/my-tests/${item.id}/run`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#2878d0] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#1e68b9] transition-colors whitespace-nowrap"
            >
              <Play className="h-3.5 w-3.5" /> Continue Test
            </Link>
            <Link
              href={`/uat/my-tests/${item.id}`}
              className="inline-flex items-center rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors whitespace-nowrap"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}