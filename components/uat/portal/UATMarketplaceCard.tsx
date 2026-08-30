'use client';

import Link from 'next/link';
import {
  Clock, PoundSterling, Users, Calendar, Monitor, Compass, ArrowRight, CircleCheck,
} from 'lucide-react';
import { capitalize, type MarketplaceJob, type TesterMatch } from '@/lib/uat-marketplace';

interface UATMarketplaceCardProps {
  job: MarketplaceJob;
  match?: TesterMatch | null;
}

export default function UATMarketplaceCard({ job, match }: UATMarketplaceCardProps) {
  return (
    <Link
      href={`/uat/jobs/view?id=${job.id}`}
      className="group block rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:border-[#2878d0]/30 hover:shadow-md cursor-pointer"
    >
      <div className="flex flex-wrap items-center gap-2">
        {job.project_name && (
          <span className="rounded-lg bg-[#edf5ff] px-2.5 py-0.5 text-xs font-semibold text-[#2878d0]">
            {job.project_name}
          </span>
        )}
        {job.required_experience_level && (
          <span className="rounded-lg bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
            {capitalize(job.required_experience_level)}
          </span>
        )}
        {job.closing_label && (
          <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-slate-400">
            <Calendar className="h-3.5 w-3.5" /> Closes {job.closing_label}
          </span>
        )}
      </div>

      <h3 className="mt-3 text-lg font-bold text-[#17325c]">{job.title}</h3>
      {job.public_summary && (
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-500">{job.public_summary}</p>
      )}

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl bg-emerald-50/70 p-3">
          <p className="flex items-center gap-1 text-xs text-slate-400">
            <PoundSterling className="h-3.5 w-3.5" /> Reward
          </p>
          <p className="mt-1 text-lg font-bold text-emerald-700">{job.reward_label}</p>
        </div>
        <div className="rounded-xl bg-sky-50/70 p-3">
          <p className="flex items-center gap-1 text-xs text-slate-400">
            <Clock className="h-3.5 w-3.5" /> Est. time
          </p>
          <p className="mt-1 text-sm font-bold text-[#17325c]">{job.duration_label}</p>
        </div>
        <div className="rounded-xl bg-amber-50/70 p-3">
          <p className="flex items-center gap-1 text-xs text-slate-400">
            <Users className="h-3.5 w-3.5" /> Availability
          </p>
          <p className="mt-1 text-sm font-bold text-[#17325c]">{job.places_label}</p>
        </div>
        <div className="flex items-center justify-end">
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#2878d0] px-4 py-2.5 text-sm font-semibold text-white transition group-hover:bg-[#1e68b9] whitespace-nowrap">
            View Test <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-50 pt-4 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <Monitor className="h-3.5 w-3.5 text-slate-400" />
          {(job.required_devices && job.required_devices.length > 0)
            ? job.required_devices.map(capitalize).join(', ')
            : 'Any device'}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Compass className="h-3.5 w-3.5 text-slate-400" />
          {(job.required_browsers && job.required_browsers.length > 0)
            ? job.required_browsers.join(', ')
            : 'Any browser'}
        </span>
      </div>

      {match && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {match.matched ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <CircleCheck className="h-3.5 w-3.5" /> Matches your setup
            </span>
          ) : (
            <>
              {match.missingDevices.map((d) => (
                <span key={`d-${d}`} className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  Needs {capitalize(d)}
                </span>
              ))}
              {match.missingBrowsers.map((b) => (
                <span key={`b-${b}`} className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  Needs {b}
                </span>
              ))}
              {!match.experienceOk && (
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  Requires {capitalize(job.required_experience_level || '')} experience
                </span>
              )}
            </>
          )}
        </div>
      )}
    </Link>
  );
}