import { criticalProcess } from '../trust-methodology-data';

export default function CriticalFindingPanel() {
  return (
    <div className="rounded-2xl border border-[#F97316]/30 bg-gradient-to-br from-[#F97316]/5 to-white p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#F97316]/15 flex items-center justify-center">
          <i className="ri-alert-line w-5 h-5 flex items-center justify-center text-[#EA580C]" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">What happens if we find something critical?</h3>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0 mb-6">
        {criticalProcess.map((node, i) => (
          <div key={node} className="flex flex-col md:flex-row md:items-center md:flex-1 min-w-0">
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-3 md:flex-1 min-w-0 text-center">
              <span className="text-xs font-semibold text-slate-600">{node}</span>
            </div>
            {i < criticalProcess.length - 1 && (
              <div className="flex items-center justify-center shrink-0 md:w-5 py-1 md:py-0">
                <i className="ri-arrow-down-line w-4 h-4 flex items-center justify-center text-slate-300 md:hidden" aria-hidden="true" />
                <i className="ri-arrow-right-line w-4 h-4 hidden md:flex items-center justify-center text-slate-300" aria-hidden="true" />
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        Notification and escalation arrangements are agreed during scoping. Material findings are handled calmly and clearly, and incident response is only included where it has been explicitly contracted.
      </p>
    </div>
  );
}