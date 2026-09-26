import { attackPaths } from '../report-preview-data';
import SeverityBadge from './SeverityBadge';

const nodeAccent = ['text-[#E11D48]', 'text-[#EA580C]', 'text-[#F59E0B]', 'text-slate-500'];

export default function ReportAttackPaths() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Correlated risk</p>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Illustrative</span>
      </div>

      {attackPaths.map((path) => (
        <div key={path.id} className="rounded-2xl border border-slate-200/80 bg-white p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
            <div>
              <p className="text-xs font-mono text-slate-400 mb-1">Attack Path {path.id}</p>
              <h4 className="text-lg font-bold text-slate-900">{path.title}</h4>
            </div>
            <SeverityBadge severity={path.severity} />
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0 mb-5">
            {path.nodes.map((node, i) => (
              <div key={node} className="flex flex-col md:flex-row md:items-center md:flex-1 min-w-0">
                <div className={`rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 md:flex-1 min-w-0 text-center`}>
                  <span className={`text-xs font-semibold ${nodeAccent[i % nodeAccent.length]}`}>{node}</span>
                </div>
                {i < path.nodes.length - 1 && (
                  <div className="flex items-center justify-center shrink-0 md:w-6 py-1 md:py-0">
                    <i className="ri-arrow-down-line w-4 h-4 flex items-center justify-center text-slate-300 md:hidden" />
                    <i className="ri-arrow-right-line w-4 h-4 hidden md:flex items-center justify-center text-slate-300" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Linked</p>
              <p className="text-sm font-semibold text-slate-700">{path.linked}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Business impact</p>
              <p className="text-sm text-slate-600 leading-snug">{path.impact}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Priority</p>
              <p className="text-sm font-semibold text-slate-700">{path.priority}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}