'use client';

import { useState, useEffect } from 'react';
import { motion } from '@/components/motion';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Briefcase, FileText, ClipboardCheck, Bug, Clock, CheckCircle2,
  Play, WalletCards, MonitorSmartphone,
  ChevronRight, Gauge,
} from 'lucide-react';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';
import { useUATTester } from '@/components/uat/UATTesterProvider';
import { useAvailableUatJobs } from '@/hooks/useAvailableUatJobs';
import { useEarnings } from '@/hooks/useEarnings';
import { formatReward, type MarketplaceJob } from '@/lib/uat-marketplace';
import { ASSIGNMENT_STATUS_CONFIG, assignmentSection } from '@/lib/uat-assignment';
import UATStatCard from '@/components/uat/portal/UATStatCard';
import UATStatusBadge from '@/components/uat/portal/UATStatusBadge';
import UATEmptyState from '@/components/uat/portal/UATEmptyState';
import UATSectionHeader from '@/components/uat/portal/UATSectionHeader';
import UATJobCard from '@/components/uat/portal/UATJobCard';
import UATAssignmentCard from '@/components/uat/portal/UATAssignmentCard';

interface Assignment {
  id: string; job_id: string; status: string; submitted_at: string | null;
  job_title?: string; project_name?: string; reward_label?: string;
}

const assignmentStatusColors: Record<string, string> = Object.fromEntries(
  Object.entries(ASSIGNMENT_STATUS_CONFIG).map(([k, v]) => [k, v.badge]),
);

const feedbackStatusColors: Record<string, string> = {
  new: 'bg-cyan-100 text-cyan-700',
  reviewing: 'bg-violet-100 text-violet-700',
  accepted: 'bg-emerald-100 text-emerald-700',
  duplicate: 'bg-amber-100 text-amber-700',
  rejected: 'bg-rose-100 text-rose-700',
  fixed: 'bg-emerald-100 text-emerald-700',
  retest_needed: 'bg-orange-100 text-orange-700',
  closed: 'bg-slate-100 text-slate-600',
};

export default function TesterDashboard() {
  const router = useRouter();
  const { tester, userId } = useUATTester();
  const testerId = tester.id;
  const { jobs: availableJobs } = useAvailableUatJobs();
  const { totals } = useEarnings(testerId);
  const [loading, setLoading] = useState(true);
  const [openJobs, setOpenJobs] = useState<MarketplaceJob[]>([]);
  const [activeAssignments, setActiveAssignments] = useState<Assignment[]>([]);
  const [recentFeedback, setRecentFeedback] = useState<any[]>([]);
  const [stats, setStats] = useState({
    availableJobs: 0, myApplications: 0, activeTests: 0,
    awaitingReview: 0, completed: 0, feedbackCount: 0,
  });

  useEffect(() => {
    loadData();
  }, [testerId]);

  useEffect(() => {
    setOpenJobs(availableJobs.slice(0, 3));
    setStats((prev) => ({ ...prev, availableJobs: availableJobs.length }));
  }, [availableJobs]);

  const loadData = async () => {
    const [
      { data: apps }, { data: assignments },
      { data: feedback },
    ] = await Promise.all([
      supabase.from('uat_job_applications').select('id, job_id').eq('tester_id', testerId),
      supabase.from('uat_assignments').select('id, job_id, status, agreed_reward_amount_minor, currency, submitted_at').eq('tester_id', testerId).order('created_at', { ascending: false }),
      supabase.from('uat_feedback').select('id, title, job_id, severity, status, created_at').eq('tester_id', testerId).order('created_at', { ascending: false }).limit(5),
    ]);

    const appSet = new Set((apps || []).map((a: any) => a.job_id));
    const activeTests = (assignments || []).filter((a: any) => assignmentSection(a.status) === 'active');
    const awaitingReview = (assignments || []).filter((a: any) => assignmentSection(a.status) === 'review');
    const completed = (assignments || []).filter((a: any) => assignmentSection(a.status) === 'completed');

    setStats((prev) => ({
      ...prev,
      myApplications: (apps || []).length,
      activeTests: activeTests.length,
      awaitingReview: awaitingReview.length,
      completed: completed.length,
      feedbackCount: (feedback || []).length,
    }));

    const assignJobIds = [...new Set(activeTests.map((a: any) => a.job_id))];
    const assignJobMap: Record<string, any> = {};
    const assignProjMap: Record<string, string> = {};
    if (assignJobIds.length > 0) {
      const { data: ajData } = await supabase.from('uat_jobs').select('id, title, project_id').in('id', assignJobIds);
      ajData?.forEach((j: any) => { assignJobMap[j.id] = j; });
      const apIds = [...new Set(ajData?.map((j: any) => j.project_id).filter(Boolean) || [])];
      if (apIds.length > 0) {
        const { data: apData } = await supabase.from('uat_projects').select('id, name').in('id', apIds);
        apData?.forEach((p: any) => { assignProjMap[p.id] = p.name; });
      }
    }

    setActiveAssignments(activeTests.slice(0, 3).map((a: any) => ({
      ...a,
      job_title: assignJobMap[a.job_id]?.title || 'Unknown',
      project_name: assignProjMap[assignJobMap[a.job_id]?.project_id] || null,
      reward_label: formatReward(a.agreed_reward_amount_minor, a.currency || 'GBP'),
    })));

    const fbJobIds = [...new Set((feedback || []).map((f: any) => f.job_id))];
    const fbJobMap: Record<string, any> = {};
    if (fbJobIds.length > 0) {
      const { data: fjData } = await supabase.from('uat_jobs').select('id, title').in('id', fbJobIds);
      fjData?.forEach((j: any) => { fbJobMap[j.id] = j; });
    }

    setRecentFeedback((feedback || []).map((f: any) => ({
      ...f,
      job_title: fbJobMap[f.job_id]?.title || null,
    })));

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-8 h-8 border-[3px] border-[#2878d0]/20 border-t-[#2878d0] rounded-full animate-spin" />
        <p className="text-sm text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  const firstName = tester?.full_name?.split(' ')[0] || 'Tester';
  const summaryParts: string[] = [];
  if (stats.activeTests > 0) summaryParts.push(`${stats.activeTests} active assignment${stats.activeTests !== 1 ? 's' : ''}`);
  if (stats.awaitingReview > 0) summaryParts.push(`${stats.awaitingReview} awaiting review`);
  if (stats.completed > 0) summaryParts.push(`${stats.completed} completed`);
  if (totals.totalEarned > 0) summaryParts.push('earnings to track');
  if (stats.availableJobs > 0) summaryParts.push(`${stats.availableJobs} new job${stats.availableJobs !== 1 ? 's' : ''} available`);

  return (
    <>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start" data-testid="uat-dashboard">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#789265]">Tester Dashboard</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight sm:text-5xl text-[#17325c]">
            Welcome back{', '}
            <span className="text-[#2878d0]">{firstName}</span>
          </h1>
          {summaryParts.length > 0 ? (
            <p className="mt-2 text-slate-500">You have {summaryParts.join(' and ')}.</p>
          ) : (
            <p className="mt-2 text-slate-500">Your testing journey at a glance — jobs, tests, feedback and earnings.</p>
          )}
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm shrink-0">
          <WalletCards className="h-5 w-5 text-[#10B981]" />
          <div>
            <p className="text-xs text-slate-400">Total earned</p>
            <p className="text-lg font-bold text-[#17325c]">{formatReward(totals.totalEarned, 'GBP')}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <UATStatCard label="Available Jobs" value={stats.availableJobs} icon={Briefcase} color="#2878d0" bg="bg-sky-100" href="/uat/jobs" />
        <UATStatCard label="My Applications" value={stats.myApplications} icon={FileText} color="#7C3AED" bg="bg-violet-100" href="/uat/applications" />
        <UATStatCard label="Active Tests" value={stats.activeTests} icon={ClipboardCheck} color="#10B981" bg="bg-emerald-100" href="/uat/my-tests" />
        <UATStatCard label="Awaiting Review" value={stats.awaitingReview} icon={Clock} color="#F59E0B" bg="bg-amber-100" href="/uat/my-tests" />
        <UATStatCard label="Completed" value={stats.completed} icon={CheckCircle2} color="#7C3AED" bg="bg-violet-100" href="/uat/my-tests" />
        <UATStatCard label="Feedback" value={stats.feedbackCount} icon={Bug} color="#F59E0B" bg="bg-amber-100" href="/uat/my-feedback" />
      </div>

      {(totals.pendingReview + totals.approved) > 0 && (
        <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
              <Clock className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-800">Earnings pending</p>
              <p className="text-xs text-emerald-600">You have {formatReward(totals.pendingReview + totals.approved, 'GBP')} awaiting payout</p>
            </div>
          </div>
          <Link href="/uat/payments" className="text-sm font-semibold text-emerald-700 hover:text-emerald-900 whitespace-nowrap">View earnings <ChevronRight className="inline h-4 w-4" /></Link>
        </div>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <UATSectionHeader title="Available Jobs" />
              <Link href="/uat/jobs" className="text-sm font-semibold text-[#2878d0] hover:underline whitespace-nowrap">View all</Link>
            </div>
            {openJobs.length === 0 ? (
              <UATEmptyState icon={Briefcase} title="No open jobs right now" description="Check back soon for new testing opportunities" actionLabel="Browse Jobs" actionHref="/uat/jobs" />
            ) : (
              <div className="divide-y divide-slate-100">
                {openJobs.map((job) => (
                  <UATJobCard
                    key={job.id}
                    id={job.id}
                    title={job.title}
                    projectName={job.project_name}
                    devices={job.required_devices}
                    durationLabel={job.duration_label}
                    rewardLabel={job.reward_label}
                  />
                ))}
              </div>
            )}
          </section>

          {activeAssignments.length > 0 && (
            <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <UATSectionHeader title="Active Tests" />
                <Link href="/uat/my-tests" className="text-sm font-semibold text-[#2878d0] hover:underline whitespace-nowrap">View all</Link>
              </div>
              <div className="divide-y divide-slate-100">
                {activeAssignments.map((a) => (
                  <UATAssignmentCard
                    key={a.id}
                    id={a.id}
                    jobTitle={a.job_title || 'Unknown'}
                    projectName={a.project_name}
                    status={a.status}
                    rewardLabel={a.reward_label}
                    statusColors={assignmentStatusColors}
                  />
                ))}
              </div>
            </section>
          )}

          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <UATSectionHeader title="Recent Feedback" />
              <Link href="/uat/my-feedback" className="text-sm font-semibold text-[#2878d0] hover:underline whitespace-nowrap">View all</Link>
            </div>
            {recentFeedback.length === 0 ? (
              <UATEmptyState icon={Bug} title="No feedback submitted yet" description="Submit reports from your active tests" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                    <tr>
                      <th className="px-5 py-3">Title</th>
                      <th className="px-5 py-3">Severity</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentFeedback.map((fb) => (
                      <tr key={fb.id}>
                        <td className="px-5 py-4">
                          <p className="font-medium text-[#17325c]">{fb.title}</p>
                          {fb.job_title && <p className="mt-0.5 text-xs text-slate-400">{fb.job_title}</p>}
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs font-semibold capitalize text-slate-600">{fb.severity || '-'}</span>
                        </td>
                        <td className="px-5 py-4">
                          <UATStatusBadge status={fb.status} colorMap={feedbackStatusColors} />
                        </td>
                        <td className="px-5 py-4 text-slate-500 text-xs">
                          {fb.created_at ? new Date(fb.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-semibold text-[#17325c]">Tester Score</h2>
              <Gauge className="h-5 w-5 text-[#2878d0]" />
            </div>
            <div className="mx-auto mt-5 flex h-36 w-36 flex-col items-center justify-center rounded-full border-[10px] border-[#86a66f] bg-white">
              <span className="text-4xl font-bold text-[#17325c]">--</span>
              <span className="text-[10px] text-slate-400">Building data</span>
            </div>
            <div className="mt-6 space-y-3">
              {[
                { label: 'Assignments', value: stats.activeTests },
                { label: 'Feedback items', value: stats.feedbackCount },
                { label: 'Applications', value: stats.myApplications },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="font-semibold text-[#17325c]">{item.value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-semibold text-[#17325c]">Earnings</h2>
              <WalletCards className="h-5 w-5 text-[#10B981]" />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Pending Review</p>
                <p className="mt-1 text-lg font-bold text-[#17325c]">{formatReward(totals.pendingReview, 'GBP')}</p>
              </div>
              <div className="rounded-xl bg-violet-50 p-4">
                <p className="text-xs text-slate-500">Approved</p>
                <p className="mt-1 text-lg font-bold text-[#17325c]">{formatReward(totals.approved, 'GBP')}</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-4">
                <p className="text-xs text-slate-500">Paid</p>
                <p className="mt-1 text-lg font-bold text-[#17325c]">{formatReward(totals.paid, 'GBP')}</p>
              </div>
              <div className="rounded-xl bg-sky-50 p-4">
                <p className="text-xs text-slate-500">Total Earned</p>
                <p className="mt-1 text-lg font-bold text-[#17325c]">{formatReward(totals.totalEarned, 'GBP')}</p>
              </div>
            </div>
            <Link href="/uat/payments" className="mt-4 flex w-full items-center justify-center gap-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:border-[#2878d0] hover:text-[#2878d0] transition-colors whitespace-nowrap">
              View Earnings History <ChevronRight className="h-4 w-4" />
            </Link>
          </section>
        </aside>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h2 className="font-serif text-2xl font-semibold text-[#17325c]">Quick Actions</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            [Play, 'Browse Jobs', 'Find new testing opportunities', '/uat/jobs'],
            [FileText, 'My Applications', 'Track your applications', '/uat/applications'],
            [ClipboardCheck, 'My Tests', 'View active assignments', '/uat/my-tests'],
            [Bug, 'Submit Feedback', 'Report bugs & issues', '/uat/my-feedback'],
          ].map(([Icon, title, copy, href]) => {
            const ActionIcon = Icon as typeof Play;
            return (
              <Link
                key={title as string}
                href={href as string}
                className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-[#2878d0] hover:bg-sky-50 cursor-pointer"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-100">
                  <ActionIcon className="h-5 w-5 text-[#2878d0]" />
                </div>
                <span>
                  <span className="block font-semibold text-[#17325c]">{title as string}</span>
                  <span className="mt-1 block text-xs text-slate-500">{copy as string}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}