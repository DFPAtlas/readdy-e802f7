import { retestRows } from '../report-preview-data';
import SeverityBadge from './SeverityBadge';

const retestTone: Record<string, string> = {
  resolved: 'text-[#047857] bg-[#047857]/10',
  partial: 'text-[#B45309] bg-[#F59E0B]/10',
  open: 'text-[#EA580C] bg-[#F97316]/10',
};

export default function ReportRetest() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Retest tracking</p>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Illustrative</span>
      </div>

      <div className="hidden md:block rounded-2xl border border-slate-200/80 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-400">
              <th className="px-4 py-3 font-semibold">Finding</th>
              <th className="px-4 py-3 font-semibold">Initial</th>
              <th className="px-4 py-3 font-semibold">Retest</th>
            </tr>
          </thead>
          <tbody>
            {retestRows.map((r) => (
              <tr key={r.finding} className="border-t border-slate-100">
                <td className="px-4 py-3 text-slate-700 font-medium">{r.finding}</td>
                <td className="px-4 py-3"><SeverityBadge severity={r.initial} /></td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${retestTone[r.tone]}`}>{r.retest}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {retestRows.map((r) => (
          <div key={r.finding} className="rounded-xl border border-slate-200/80 bg-white p-4">
            <p className="text-sm font-medium text-slate-800 mb-3">{r.finding}</p>
            <div className="flex items-center justify-between gap-3">
              <SeverityBadge severity={r.initial} />
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${retestTone[r.tone]}`}>{r.retest}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        Retest verifies whether agreed remediation has addressed the original finding.
      </p>
    </div>
  );
}