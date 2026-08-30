'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from '@/components/motion';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Clock, PoundSterling, Calendar, Users,
  CircleAlert, CircleCheckBig, LoaderCircle, Monitor, Compass, Award,
  FileText, ClipboardList, Send, ShieldCheck,
} from 'lucide-react';
import { useUATTester } from '@/components/uat/UATTesterProvider';
import {
  formatReward, formatDuration, placesLabel, experienceLabel, capitalize,
  isMarketplaceAvailable,
} from '@/lib/uat-marketplace';
import UATPortalBreadcrumbs from '@/components/uat/portal/UATPortalBreadcrumbs';

interface JobState {
  id: string;
  project_id: string;
  title: string;
  public_summary: string | null;
  test_instructions: string | null;
  required_devices: string[] | null;
  required_browsers: string[] | null;
  required_experience_level: string | null;
  experience_requirement: string | null;
  reward_amount_minor: number;
  currency: string;
  estimated_minutes_min: number | null;
  estimated_minutes_max: number | null;
  max_testers: number;
  tester_slots_filled: number;
  application_opens_at: string | null;
  application_closes_at: string | null;
  deadline: string | null;
  testing_ends_at: string | null;
  claim_mode: string;
  evidence_requirements: string | null;
  evidence_requirement_tags: string[] | null;
  marketplace_status: string;
  visibility: string;
  project_name: string | null;
}

type ClaimResult = { kind: 'claimed'; assignmentId: string; reward: string; deadline: string | null } | null;
type ApplyResult = { kind: 'applied' } | null;

function friendlyError(message: string): string {
  const m = message || '';
  if (/no tester places|closed|no longer available|job has closed/i.test(m)) return 'This test is no longer available.';
  if (/not publicly available|not open|job not found|not found/i.test(m)) return 'This test is no longer available.';
  if (/already have an active assignment/i.test(m)) return 'You are already assigned to this test.';
  if (/already have a pending application/i.test(m)) return 'You already have a pending application for this test.';
  if (/no approved tester profile/i.test(m)) return 'Your tester account is not approved yet.';
  if (/requires approval/i.test(m)) return 'This test requires an application rather than an instant claim.';
  if (/does not require an application/i.test(m)) return 'This test can be claimed instantly.';
  return 'Something went wrong. Please try again.';
}

export default function JobClaimClient({ jobId }: { jobId: string }) {
  const router = useRouter();
  const { tester } = useUATTester();
  const testerId = tester.id;

  const [job, setJob] = useState<JobState | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [existingAssignmentId, setExistingAssignmentId] = useState<string | null>(null);
  const [hasPendingApplication, setHasPendingApplication] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [claimResult, setClaimResult] = useState<ClaimResult>(null);
  const [applyResult, setApplyResult] = useState<ApplyResult>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    if (!jobId) { setNotFound(true); setLoading(false); return; }

    const { data: jobData } = await supabase
      .from('uat_jobs').select('*').eq('id', jobId).maybeSingle();
    if (!jobData) { setNotFound(true); setLoading(false); return; }

    let projectName: string | null = null;
    if (jobData.project_id) {
      const { data: proj } = await supabase
        .from('uat_projects').select('name').eq('id', jobData.project_id).maybeSingle();
      projectName = proj?.name || null;
    }

    setJob({ ...jobData, project_name: projectName } as JobState);

    const { data: assign } = await supabase
      .from('uat_assignments')
      .select('id')
      .eq('job_id', jobId)
      .eq('tester_id', testerId)
      .not('status', 'in', '(rejected,expired,cancelled)')
      .maybeSingle();
    setExistingAssignmentId(assign?.id || null);

    const { data: app } = await supabase
      .from('uat_job_applications')
      .select('id')
      .eq('job_id', jobId)
      .eq('tester_id', testerId)
      .eq('status', 'pending')
      .maybeSingle();
    setHasPendingApplication(Boolean(app));

    setLoading(false);
  }, [jobId, testerId]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleInstantClaim = async () => {
    if (!job) return;
    setBusy(true);
    setError('');
    const { data, error: rpcError } = await supabase.rpc('claim_uat_job_instant', { p_job_id: job.id });
    if (rpcError) {
      setError(friendlyError(rpcError.message));
      setBusy(false);
      await loadData();
      return;
    }
    const assignmentId = data as string;
    const { data: assignData } = await supabase
      .from('uat_assignments')
      .select('agreed_reward_amount_minor, currency')
      .eq('id', assignmentId)
      .maybeSingle();
    const reward = formatReward(
      assignData?.agreed_reward_amount_minor ?? job.reward_amount_minor,
      assignData?.currency ?? job.currency,
    );
    setClaimResult({
      kind: 'claimed',
      assignmentId,
      reward,
      deadline: job.deadline || job.testing_ends_at,
    });
    setBusy(false);
  };

  const handleApply = async () => {
    if (!job) return;
    setBusy(true);
    setError('');
    const { data, error: rpcError } = await supabase.rpc('apply_uat_job', { p_job_id: job.id });
    if (rpcError) {
      setError(friendlyError(rpcError.message));
      setBusy(false);
      await loadData();
      return;
    }
    setApplyResult({ kind: 'applied' });
    setBusy(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-8 h-8 border-[3px] border-[#2878d0]/20 border-t-[#2878d0] rounded-full animate-spin" />
        <p className="text-sm text-slate-500">Loading test details...</p>
      </div>
    );
  }

  if (notFound || !job) {
    return (
      <>
        <UATPortalBreadcrumbs items={[{ label: 'Available Tests', href: '/uat/jobs' }, { label: 'Not Found' }]} />
        <div className="flex items-center justify-center py-16">
          <div className="bg-white border border-slate-100 rounded-3xl p-12 shadow-sm text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
              <CircleAlert className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-[#17325c] mb-2">Test Not Found</h3>
            <p className="text-slate-500 mb-6">This test may have been removed or is no longer available.</p>
            <button onClick={() => router.push('/uat/jobs')} className="px-5 py-2.5 bg-[#2878d0] rounded-xl text-sm font-semibold text-white cursor-pointer whitespace-nowrap">
              Browse Available Tests
            </button>
          </div>
        </div>
      </>
    );
  }

  const available = isMarketplaceAvailable(job);
  const isInstant = job.claim_mode === 'instant';

  return (
    <>
      <UATPortalBreadcrumbs items={[{ label: 'Available Tests', href: '/uat/jobs' }, { label: job.title }]} />

      <div className="mt-6 max-w-3xl mx-auto">
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {job.project_name && (
                <span className="text-xs font-semibold text-[#2878d0] bg-[#edf5ff] px-2.5 py-0.5 rounded-lg">{job.project_name}</span>
              )}
              {job.required_experience_level && (
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-lg">{experienceLabel(job.required_experience_level)}</span>
              )}
              <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-slate-400">
                <Users className="h-3.5 w-3.5" /> {placesLabel(job)}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#17325c] mb-3">{job.title}</h1>
            {job.public_summary && <p className="text-sm text-slate-500 leading-relaxed">{job.public_summary}</p>}
          </div>

          <div className="p-6 border-b border-slate-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="rounded-xl bg-emerald-50/70 p-3">
                <p className="flex items-center gap-1 text-xs text-slate-400"><PoundSterling className="h-3.5 w-3.5" /> Reward</p>
                <p className="mt-1 text-lg font-bold text-emerald-700">{formatReward(job.reward_amount_minor, job.currency)}</p>
              </div>
              <div className="rounded-xl bg-sky-50/70 p-3">
                <p className="flex items-center gap-1 text-xs text-slate-400"><Clock className="h-3.5 w-3.5" /> Est. time</p>
                <p className="mt-1 text-sm font-bold text-[#17325c]">{formatDuration(job.estimated_minutes_min, job.estimated_minutes_max)}</p>
              </div>
              <div className="rounded-xl bg-amber-50/70 p-3">
                <p className="flex items-center gap-1 text-xs text-slate-400"><Calendar className="h-3.5 w-3.5" /> Closes</p>
                <p className="mt-1 text-sm font-bold text-[#17325c]">
                  {job.application_closes_at ? new Date(job.application_closes_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'No deadline'}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50/70 p-3">
                <p className="flex items-center gap-1 text-xs text-slate-400"><ClipboardList className="h-3.5 w-3.5" /> Mode</p>
                <p className="mt-1 text-sm font-bold text-[#17325c]">{isInstant ? 'Instant Claim' : 'Apply'}</p>
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-[#17325c] mb-3">Requirements</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <Monitor className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-400">Devices: </span>
                  <span className="text-slate-600">{(job.required_devices || []).length ? job.required_devices!.map(capitalize).join(', ') : 'Any'}</span>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Compass className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-400">Browsers: </span>
                  <span className="text-slate-600">{(job.required_browsers || []).length ? job.required_browsers!.join(', ') : 'Any'}</span>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Award className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-400">Experience: </span>
                  <span className="text-slate-600">
                    {job.experience_requirement || experienceLabel(job.required_experience_level)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {job.test_instructions && (
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-[#17325c] mb-2 flex items-center gap-2"><FileText className="w-4 h-4 text-[#2878d0]" /> Tester Instructions</h3>
              <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-line">{job.test_instructions}</p>
            </div>
          )}

          {(job.evidence_requirements || (job.evidence_requirement_tags || []).length > 0) && (
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-[#17325c] mb-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#2878d0]" /> Evidence Expectations</h3>
              {job.evidence_requirements && <p className="text-sm text-slate-500 leading-relaxed">{job.evidence_requirements}</p>}
              {(job.evidence_requirement_tags || []).length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {job.evidence_requirement_tags!.map((t) => (
                    <span key={t} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 capitalize">{t.replace(/_/g, ' ')}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="p-6">
            {claimResult ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                  <CircleCheckBig className="w-7 h-7 text-emerald-500" />
                </div>
                <h3 className="text-lg font-bold text-[#17325c] mb-3">Test Assigned</h3>
                <div className="mx-auto max-w-xs rounded-2xl bg-slate-50 p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Reward</span>
                    <span className="font-bold text-emerald-700">{claimResult.reward}</span>
                  </div>
                  {claimResult.deadline && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Deadline</span>
                      <span className="font-semibold text-[#17325c]">
                        {new Date(claimResult.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                </div>
                <button onClick={() => router.push(`/uat/my-tests/${claimResult.assignmentId}`)} className="mt-5 px-6 py-2.5 bg-[#2878d0] hover:bg-[#1e68b9] rounded-xl text-sm font-semibold text-white cursor-pointer whitespace-nowrap transition-colors">
                  Go to My Test
                </button>
              </motion.div>
            ) : applyResult ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-7 h-7 text-[#2878d0]" />
                </div>
                <h3 className="text-lg font-bold text-[#17325c] mb-1">Application Pending</h3>
                <p className="text-sm text-slate-500 mb-5">Your application has been submitted. You&apos;ll be notified once it&apos;s reviewed.</p>
                <button onClick={() => router.push('/uat/applications')} className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:text-[#2878d0] cursor-pointer whitespace-nowrap transition-colors">
                  View My Applications
                </button>
              </motion.div>
            ) : existingAssignmentId ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                  <CircleCheckBig className="w-7 h-7 text-emerald-500" />
                </div>
                <h3 className="text-lg font-bold text-[#17325c] mb-2">You are already assigned to this test</h3>
                <p className="text-sm text-slate-500 mb-5">You can continue or view your assignment.</p>
                <button onClick={() => router.push(`/uat/my-tests/${existingAssignmentId}`)} className="px-6 py-2.5 bg-[#2878d0] hover:bg-[#1e68b9] rounded-xl text-sm font-semibold text-white cursor-pointer whitespace-nowrap transition-colors">
                  View My Test
                </button>
              </div>
            ) : hasPendingApplication ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-7 h-7 text-[#2878d0]" />
                </div>
                <h3 className="text-lg font-bold text-[#17325c] mb-2">Application Pending</h3>
                <p className="text-sm text-slate-500 mb-5">You already have a pending application for this test.</p>
                <button onClick={() => router.push('/uat/applications')} className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:text-[#2878d0] cursor-pointer whitespace-nowrap transition-colors">
                  Track Applications
                </button>
              </div>
            ) : !available ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <CircleAlert className="w-7 h-7 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-[#17325c] mb-2">This test is no longer available</h3>
                <p className="text-sm text-slate-500 mb-5">It may have been filled, paused, or closed.</p>
                <button onClick={() => router.push('/uat/jobs')} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-semibold text-slate-600 cursor-pointer whitespace-nowrap transition-colors">
                  Browse Other Tests
                </button>
              </div>
            ) : (
              <div className="text-center">
                {error && (
                  <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 p-3 text-left">
                    <CircleAlert className="w-4 h-4 text-red-500 shrink-0" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                <button
                  onClick={isInstant ? handleInstantClaim : handleApply}
                  disabled={busy}
                  className="w-full max-w-sm px-6 py-3.5 bg-[#2878d0] hover:bg-[#1e68b9] disabled:opacity-60 rounded-xl text-sm font-semibold text-white shadow-md shadow-blue-200 transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto whitespace-nowrap"
                >
                  {busy ? <LoaderCircle className="w-4 h-4 animate-spin" /> : isInstant ? <CircleCheckBig className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                  {isInstant ? 'Claim Test' : 'Apply for Test'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}