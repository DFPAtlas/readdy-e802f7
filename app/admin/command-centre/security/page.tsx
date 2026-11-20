'use client';

import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, Shield, AlertTriangle, StopCircle, Activity, Search, FileWarning } from 'lucide-react';
import CommandShell from '@/components/admin/CommandShell';
import { supabase } from '@/lib/supabase';

type EngagementOverview = {
  id: string;
  name: string;
  service_type: string;
  status: string;
  emergency_stop: boolean;
  permitted_assets: number | null;
  jobs: number | null;
  findings: number | null;
  critical_findings: number | null;
  last_job_completed_at: string | null;
};

export default function SecurityCommandPage() {
  const [rows, setRows] = useState<EngagementOverview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: queryError } = await supabase
      .from('security_engagement_overview')
      .select('*')
      .order('name');

    if (queryError) {
      setRows([]);
      setError(queryError.message);
    } else {
      setRows((data || []) as EngagementOverview[]);
    }

    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const active = rows.filter((row) => !['draft', 'closed', 'stopped'].includes(row.status)).length;
  const stopped = rows.filter((row) => row.emergency_stop).length;
  const findings = rows.reduce((sum, row) => sum + Number(row.findings || 0), 0);
  const critical = rows.reduce((sum, row) => sum + Number(row.critical_findings || 0), 0);

  return (
    <CommandShell>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span className="text-xs uppercase tracking-[0.18em] text-cyan-400 font-semibold">Internal control plane</span>
            </div>
            <h1 className="text-2xl font-bold text-white">AI Security Command</h1>
            <p className="text-sm text-slate-400 mt-1">Authorised engagements, scope state, jobs and findings.</p>
          </div>
          <button onClick={() => void load()} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-sm text-slate-300 hover:text-white cursor-pointer">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            ['Active engagements', active, Activity],
            ['Emergency stops', stopped, StopCircle],
            ['Findings', findings, Search],
            ['Critical findings', critical, FileWarning],
          ].map(([label, value, Icon]) => (
            <div key={String(label)} className="glass-card rounded-2xl p-5">
              <Icon className="w-5 h-5 text-cyan-400 mb-4" />
              <div className="text-2xl font-bold text-white">{String(value)}</div>
              <div className="text-xs text-slate-400 mt-1">{String(label)}</div>
            </div>
          ))}
        </div>

        {error && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5 mb-6 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-300">Security schema not available to this session</p>
              <p className="text-xs text-slate-400 mt-1">{error}</p>
            </div>
          </div>
        )}

        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10">
            <h2 className="text-sm font-semibold text-white">Engagements</h2>
            <p className="text-xs text-slate-500 mt-1">Read-only overview. Execution controls are intentionally not exposed here yet.</p>
          </div>

          {loading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="w-7 h-7 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
            </div>
          ) : rows.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">No security engagements found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-slate-500 border-b border-white/10">
                  <tr>
                    <th className="text-left px-5 py-3 font-medium">Engagement</th>
                    <th className="text-left px-5 py-3 font-medium">Service</th>
                    <th className="text-left px-5 py-3 font-medium">Status</th>
                    <th className="text-right px-5 py-3 font-medium">Scope</th>
                    <th className="text-right px-5 py-3 font-medium">Jobs</th>
                    <th className="text-right px-5 py-3 font-medium">Findings</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-b border-white/5 last:border-0">
                      <td className="px-5 py-4">
                        <div className="font-medium text-white">{row.name}</div>
                        {row.emergency_stop && <div className="text-xs text-red-400 mt-1">Emergency stop active</div>}
                      </td>
                      <td className="px-5 py-4 text-slate-400">{row.service_type.replaceAll('_', ' ')}</td>
                      <td className="px-5 py-4 text-slate-300">{row.status.replaceAll('_', ' ')}</td>
                      <td className="px-5 py-4 text-right text-slate-300">{row.permitted_assets || 0}</td>
                      <td className="px-5 py-4 text-right text-slate-300">{row.jobs || 0}</td>
                      <td className="px-5 py-4 text-right">
                        <span className={Number(row.critical_findings || 0) > 0 ? 'text-red-400 font-semibold' : 'text-slate-300'}>
                          {row.findings || 0}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </CommandShell>
  );
}
