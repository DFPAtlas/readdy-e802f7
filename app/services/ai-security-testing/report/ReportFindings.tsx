'use client';

import { useState } from 'react';
import { findings, findingDetail } from '../report-preview-data';
import SeverityBadge from './SeverityBadge';

export default function ReportFindings() {
  const [selected, setSelected] = useState('DFP-002');
  const detail = findingDetail;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Findings overview</p>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Illustrative findings</span>
      </div>

      <div className="hidden md:block rounded-2xl border border-slate-200/80 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-400">
              <th className="px-4 py-3 font-semibold">ID</th>
              <th className="px-4 py-3 font-semibold">Finding</th>
              <th className="px-4 py-3 font-semibold">Severity</th>
              <th className="px-4 py-3 font-semibold">Asset</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {findings.map((f) => (
              <tr
                key={f.id}
                onClick={() => setSelected(f.id)}
                className={`border-t border-slate-100 cursor-pointer transition-colors ${selected === f.id ? 'bg-[#E11D48]/5' : 'hover:bg-slate-50'}`}
              >
                <td className="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">{f.id}</td>
                <td className="px-4 py-3 text-slate-600">{f.title}</td>
                <td className="px-4 py-3"><SeverityBadge severity={f.severity} /></td>
                <td className="px-4 py-3 text-slate-500 font-mono text-xs">{f.asset}</td>
                <td className="px-4 py-3"><span className="text-xs font-semibold text-[#EA580C] bg-[#F97316]/10 px-2 py-1 rounded-full">{f.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {findings.map((f) => (
          <button
            key={f.id}
            onClick={() => setSelected(f.id)}
            className={`w-full text-left rounded-xl border p-4 transition-colors ${selected === f.id ? 'border-[#E11D48]/40 bg-[#E11D48]/5' : 'border-slate-200/80 bg-white'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">{f.id}</span>
              <SeverityBadge severity={f.severity} />
            </div>
            <p className="text-sm font-medium text-slate-800 mb-1">{f.title}</p>
            <p className="text-xs font-mono text-slate-400 break-all">{f.asset}</p>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
          <div>
            <p className="text-xs font-mono text-slate-400 mb-1">{detail.id}</p>
            <h4 className="text-lg font-bold text-slate-900">{detail.title}</h4>
          </div>
          <div className="flex items-center gap-2">
            <SeverityBadge severity={detail.severity} />
            <span className="text-xs font-semibold text-[#EA580C] bg-[#F97316]/10 px-2.5 py-1 rounded-full">{detail.status}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Description</p>
              <p className="text-sm text-slate-600 leading-relaxed">{detail.description}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Evidence</p>
              <div className="rounded-xl bg-slate-900 p-4 space-y-2">
                {detail.evidence.map((e) => (
                  <div key={e} className="flex items-center gap-2 text-xs font-mono text-slate-300">
                    <i className="ri-circle-fill text-[6px] text-emerald-400 flex items-center justify-center w-2 h-2" />
                    {e}
                  </div>
                ))}
                <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-700 mt-2">Sensitive values are never displayed in reports.</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Potential business impact</p>
              <p className="text-sm text-slate-600 leading-relaxed">{detail.impact}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Recommended remediation</p>
            <ul className="space-y-2">
              {detail.remediation.map((r) => (
                <li key={r} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <i className="ri-checkbox-circle-line w-4 h-4 flex items-center justify-center shrink-0 mt-0.5 text-[#E11D48]" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}