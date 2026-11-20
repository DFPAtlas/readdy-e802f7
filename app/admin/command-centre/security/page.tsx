'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import CommandShell from '@/components/admin/CommandShell';
import { supabase } from '@/lib/supabase';
import type { SecurityEngagementSummary, SecurityJobSummary } from '@/lib/security-assessment-definitions';
import { SECURITY_PLATFORM_GUARDRAILS } from '@/lib/security-assessment-definitions';
import {
  ShieldCheck, OctagonX, Activity, FileWarning, Clock3, RefreshCw,
  CheckCircle2, AlertTriangle, Database, LockKeyhole
} from 'lucide-react';

type FindingRow = { id: string; severity: string; validation_state: string };
type ApprovalRow = { id: string; status: string };

export default function SecurityCommandPage() {
  const [engagements, setEngagements] = useState<SecurityEngagementSummary[]>([]);
  const [jobs, setJobs] = useState<SecurityJobSummary[]>([]);
  const [findings, setFindings] = useState<FindingRow[]>([]);
  const [approvals, setApprovals] = useState<ApprovalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [schemaReady, setSchemaReady] = useState(true);
  const [actionError, setActionError] = useState('');
  const [stoppingId, setStoppingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError('');

    const [engRes, jobRes, findingRes, approvalRes] = await Promise.all([
      supabase.from('security_engagements').select('id,reference,customer_name,status,service_tier,emergency_stop,testing_window_start,testing_window_end,created_at').order('created_at', { ascending: false }),
      supabase.from('security_jobs').select('id,engagement_id,requested_target,agent_key,test_category,risk_class,status,executor,queued_at').order('queued_at', { ascending: false }).limit(25),
      supabase.from('security_findings').select('id,severity,validation_state'),
      supabase.from('security_approvals').select('id,status'),
    ]);

    const missingTable = [engRes.error, jobRes.error, findingRes.error, approvalRes.error]
      .some((error) => error?.code === '42P01' || error?.message?.toLowerCase().includes('does not exist'));

    setSchemaReady(!missingTable);
    if (engRes.data) setEngagements(engRes.data as SecurityEngagementSummary[]);
    if (jobRes.data) setJobs(jobRes.data as SecurityJobSummary[]);
    if (findingRes.data) setFindings(findingRes.data as FindingRow[]);
    if (approvalRes.data) setApprovals(approvalRes.data as ApprovalRow[]);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const metrics = useMemo(() => ({
    engagements: engagements.length,
    active: engagements.filter((x) => x.status === 'active').length,
    stopped: engagements.filter((x) => x.emergency_stop).length,
    queued: jobs.filter((x) => ['queued', 'assigned', 'running'].includes(x.status)).length,
    critical: findings.filter((x) => x.severity === 'critical' && x.validation_state !== 'false_positive').length,
    approvals: approvals.filter((x) => x.status === 'approved').length,
  }), [engagements, jobs, findings, approvals]);

  const emergencyStop = async (engagementId: string) => {
    const ok = window.confirm('Activate the emergency stop for this engagement? Queued work will be cancelled and running work will be blocked for safe halt.');
    if (!ok) return;

    setStoppingId(engagementId);
    setActionError('');
    const { error } = await supabase.rpc('set_security_emergency_stop', {
      p_engagement_id: engagementId,
      p_stop: true,
      p_reason: 'Activated from DFP Command',
    });

    if (error) setActionError(error.message);
    await load();
    setStoppingId(null);
  };

  const statCards = [
    { label: 'Engagements', value: metrics.engagements, icon: ShieldCheck },
    { label: 'Active', value: metrics.active, icon: Activity },
    { label: 'Jobs in flight', value: metrics.queued, icon: Clock3 },
    { label: 'Critical findings', value: metrics.critical, icon: FileWarning },
    { label: 'Active approvals', value: metrics.approvals, icon: LockKeyhole },
    { label: 'Emergency stops', value: metrics.stopped, icon: OctagonX },
  ];

  return (
    <CommandShell>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-[#06B6D4]" />
              <span className="text-xs uppercase tracking-[0.16em] text-[#06B6D4] font-semibold">Authorised security operations</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Security Command</h1>
            <p className="text-sm text-slate-400 mt-1">Engagement scope, approvals, jobs, evidence and emergency controls.</p>
          </div>
          <button onClick={() => void load()} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 text-sm text-slate-300 hover:text-white hover:border-white/20">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {!schemaReady && (
          <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-300">Security schema not deployed</p>
              <p className="text-xs text-slate-400 mt-1">Apply the AI security platform migration before this control plane can display live data.</p>
            </div>
          </div>
        )}

        {actionError && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">{actionError}</div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-8">
          {statCards.map(({ label, value, icon: Icon }) => (
            <div key={label} className="glass-card rounded-2xl p-4">
              <Icon className="w-4 h-4 text-[#06B6D4] mb-3" />
              <div className="text-2xl font-bold text-white">{loading ? '—' : value}</div>
              <div className="text-[11px] text-slate-400 mt-1">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-6 mb-8">
          <section className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white">Engagements</h2>
              <span className="text-[10px] uppercase tracking-wider text-slate-500">Scope is the source of truth</span>
            </div>

            <div className="space-y-3">
              {!loading && engagements.length === 0 && (
                <div className="py-10 text-center">
                  <Database className="w-9 h-9 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-400">No security engagements yet.</p>
                  <p className="text-xs text-slate-600 mt-1">Create engagements only after customer scope and written authorisation are available.</p>
                </div>
              )}

              {engagements.map((engagement) => (
                <div key={engagement.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-white">{engagement.reference}</p>
                        <span className="text-[10px] rounded-full px-2 py-0.5 bg-[#06B6D4]/10 text-[#06B6D4] uppercase">{engagement.service_tier}</span>
                        <span className={`text-[10px] rounded-full px-2 py-0.5 uppercase ${engagement.emergency_stop ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                          {engagement.emergency_stop ? 'Stopped' : engagement.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 truncate">{engagement.customer_name}</p>
                      <p className="text-[11px] text-slate-600 mt-2">
                        Window: {engagement.testing_window_start ? new Date(engagement.testing_window_start).toLocaleString() : 'not set'} → {engagement.testing_window_end ? new Date(engagement.testing_window_end).toLocaleString() : 'not set'}
                      </p>
                    </div>
                    <button
                      onClick={() => void emergencyStop(engagement.id)}
                      disabled={engagement.emergency_stop || stoppingId === engagement.id}
                      className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-red-500/20 text-red-300 text-xs font-semibold hover:bg-red-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <OctagonX className="w-3.5 h-3.5" />
                      {engagement.emergency_stop ? 'Stopped' : stoppingId === engagement.id ? 'Stopping…' : 'Emergency stop'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-4">Hard guardrails</h2>
            <div className="space-y-3">
              {SECURITY_PLATFORM_GUARDRAILS.map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-400 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">Recent security jobs</h2>
            <span className="text-[10px] text-slate-500">Read-only here — jobs must pass the database queue gate</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-slate-500 border-b border-white/[0.06]">
                  <th className="py-2 pr-4">Target</th>
                  <th className="py-2 pr-4">Agent</th>
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4">Risk</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b border-white/[0.04] text-xs">
                    <td className="py-3 pr-4 text-slate-300 max-w-[260px] truncate">{job.requested_target}</td>
                    <td className="py-3 pr-4 text-slate-400">{job.agent_key}</td>
                    <td className="py-3 pr-4 text-slate-400">{job.test_category}</td>
                    <td className="py-3 pr-4 text-slate-400">{job.risk_class}</td>
                    <td className="py-3">
                      <span className="rounded-full px-2 py-0.5 bg-white/5 text-slate-300 uppercase text-[10px]">{job.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && jobs.length === 0 && <p className="text-sm text-slate-500 text-center py-8">No security jobs queued.</p>}
          </div>
        </section>
      </div>
    </CommandShell>
  );
}
