'use client';

import { useRouter } from 'next/navigation';
import {
  ClipboardCheck, Hourglass, CircleCheck, CircleX, Calendar,
} from 'lucide-react';
import { useUATTester } from '@/components/uat/UATTesterProvider';
import { useMyTests } from '@/hooks/useMyTests';
import { rewardStatusBadge } from '@/lib/uat-assignment';
import UATPortalBreadcrumbs from '@/components/uat/portal/UATPortalBreadcrumbs';
import UATEmptyState from '@/components/uat/portal/UATEmptyState';
import UATErrorState from '@/components/uat/portal/UATErrorState';
import UATSectionHeader from '@/components/uat/portal/UATSectionHeader';
import UATMyTestCard from '@/components/uat/portal/UATMyTestCard';

function formatDate(value: string | null): string {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function MyTestsPage() {
  const router = useRouter();
  const { tester } = useUATTester();
  const { items, pendingApplications, loading, error, refetch } = useMyTests(tester.id);

  const active = items.filter((i) => i.section === 'active');
  const review = items.filter((i) => i.section === 'review');
  const completed = items.filter((i) => i.section === 'completed');
  const cancelled = items.filter((i) => i.section === 'cancelled');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-8 h-8 border-[3px] border-[#2878d0]/20 border-t-[#2878d0] rounded-full animate-spin" />
        <p className="text-sm text-slate-500">Loading your tests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <UATPortalBreadcrumbs items={[{ label: 'My Tests' }]} />
        <UATErrorState message={error} onRetry={refetch} />
      </>
    );
  }

  const isEmpty = items.length === 0 && pendingApplications.length === 0;

  return (
    <>
      <UATPortalBreadcrumbs items={[{ label: 'My Tests' }]} />
      <div className="mt-4">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#789265]">Assignments</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight sm:text-5xl text-[#17325c]">My Tests</h1>
        <p className="mt-2 text-slate-500">Your assigned UAT test work, progress and rewards.</p>
      </div>

      {isEmpty ? (
        <div className="mt-8 rounded-2xl border border-slate-100 bg-white shadow-sm">
          <UATEmptyState
            icon={ClipboardCheck}
            title="No tests yet"
            description="You do not currently have any UAT assignments. Browse available jobs and claim one to get started."
            actionLabel="Browse Jobs"
            actionHref="/uat/jobs"
          />
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {pendingApplications.length > 0 && (
            <section>
              <UATSectionHeader title="Pending Approval" description="Applications awaiting DFP review" />
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="divide-y divide-slate-100">
                  {pendingApplications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between px-5 py-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Hourglass className="h-4 w-4 text-amber-500" />
                          <p className="font-semibold text-[#17325c] truncate">{app.job_title}</p>
                        </div>
                        {app.project_name && <p className="mt-0.5 text-xs text-slate-500">{app.project_name}</p>}
                      </div>
                      <div className="flex shrink-0 items-center gap-4">
                        <span className="text-xs text-slate-500">Applied {formatDate(app.created_at)}</span>
                        <span className="inline-flex shrink-0 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                          Awaiting DFP Approval
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {active.length > 0 && (
            <section>
              <UATSectionHeader title="Active" description="Tests you can work on now" />
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="divide-y divide-slate-100">
                  {active.map((item) => (
                    <UATMyTestCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {review.length > 0 && (
            <section>
              <UATSectionHeader title="Awaiting Review" description="Work submitted and waiting for DFP" />
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="divide-y divide-slate-100">
                  {review.map((item) => (
                    <div key={item.id} className="flex items-center justify-between px-5 py-4">
                      <button onClick={() => router.push(`/uat/my-tests/${item.id}`)} className="min-w-0 text-left cursor-pointer">
                        <p className="font-semibold text-[#17325c] truncate hover:text-[#2878d0]">{item.job_title}</p>
                        {item.project_name && <p className="mt-0.5 text-xs text-slate-500">{item.project_name}</p>}
                      </button>
                      <div className="flex shrink-0 items-center gap-4 text-xs text-slate-500">
                        <span>Submitted {formatDate(item.submitted_at)}</span>
                        <span className="font-bold text-[#617a50]">{item.agreed_reward_label}</span>
                        <span className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 font-semibold ${item.status_badge}`}>
                          {item.status_label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {completed.length > 0 && (
            <section>
              <UATSectionHeader title="Completed" description="Your historical UAT work" />
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="divide-y divide-slate-100">
                  {completed.map((item) => (
                    <div key={item.id} className="flex items-center justify-between px-5 py-4">
                      <button onClick={() => router.push(`/uat/my-tests/${item.id}`)} className="min-w-0 text-left cursor-pointer">
                        <p className="font-semibold text-[#17325c] truncate hover:text-[#2878d0]">{item.job_title}</p>
                        {item.project_name && <p className="mt-0.5 text-xs text-slate-500">{item.project_name}</p>}
                      </button>
                      <div className="flex shrink-0 items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <CircleCheck className="h-3.5 w-3.5 text-emerald-500" />
                          Completed {formatDate(item.completed_at)}
                        </span>
                        <span className="font-bold text-[#617a50]">{item.agreed_reward_label}</span>
                        <span className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 font-semibold ${rewardStatusBadge(item.reward_status)}`}>
                          {item.reward_status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {cancelled.length > 0 && (
            <section>
              <UATSectionHeader title="Cancelled / Expired" description="Tests that were withdrawn or lapsed" />
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="divide-y divide-slate-100">
                  {cancelled.map((item) => (
                    <div key={item.id} className="flex items-center justify-between px-5 py-4 opacity-70">
                      <div className="min-w-0">
                        <p className="font-semibold text-[#17325c] truncate">{item.job_title}</p>
                        {item.project_name && <p className="mt-0.5 text-xs text-slate-500">{item.project_name}</p>}
                      </div>
                      <div className="flex shrink-0 items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <CircleX className="h-3.5 w-3.5 text-slate-400" />
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {formatDate(item.last_activity)}
                        </span>
                        <span className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 font-semibold ${item.status_badge}`}>
                          {item.status_label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      )}
    </>
  );
}