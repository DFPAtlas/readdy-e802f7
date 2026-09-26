import { summaryMetrics, keyObservations } from '../report-preview-data';
import SeverityBadge from './SeverityBadge';

const toneText: Record<string, string> = {
  critical: 'text-[#E11D48]',
  high: 'text-[#EA580C]',
  medium: 'text-[#B45309]',
  low: 'text-slate-500',
  neutral: 'text-slate-900',
};

export default function ReportExecSummary() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 rounded-2xl border border-slate-200/80 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 mb-2">Overall assessment</p>
          <p className="text-2xl font-bold text-[#EA580C]">Improvement required</p>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Validated findings indicate that remediation would meaningfully reduce risk exposure.
          </p>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Risk exposure</p>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Illustrative</span>
          </div>
          <div className="relative pt-7">
            <div className="absolute top-0 flex flex-col items-center" style={{ left: '68%', transform: 'translateX(-50%)' }}>
              <span className="text-[11px] font-bold text-[#E11D48] whitespace-nowrap">Current view</span>
              <span className="w-0.5 h-3 bg-[#E11D48]" />
            </div>
            <div className="h-3 rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-[#E11D48]" />
          </div>
          <div className="flex items-center justify-between mt-4 text-xs text-slate-400">
            <span>Lower</span>
            <span className="font-medium text-slate-500">Risk exposure</span>
            <span>Higher</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {summaryMetrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-slate-200/80 bg-white p-4">
            <p className={`text-2xl font-bold ${toneText[m.tone]}`}>{m.value}</p>
            <p className="text-xs text-slate-500 mt-1 leading-snug">{m.label}</p>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-slate-400 -mt-2">Metrics shown are illustrative sample content.</p>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 mb-4">Key observations</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {keyObservations.map((o) => (
            <div key={o.title} className="rounded-2xl border border-slate-200/80 bg-white p-5 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#E11D48]/10 flex items-center justify-center">
                  <i className={`${o.icon} w-5 h-5 flex items-center justify-center text-[#E11D48]`} />
                </div>
                <SeverityBadge severity={o.risk} />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-2">{o.title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">{o.desc}</p>
              <div className="mt-auto pt-4 border-t border-slate-100">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Next action</p>
                <p className="text-sm text-slate-600 leading-relaxed">{o.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}