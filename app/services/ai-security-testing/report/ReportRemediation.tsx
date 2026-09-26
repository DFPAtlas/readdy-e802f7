import { remediationPlan } from '../report-preview-data';

const toneMap: Record<string, { bar: string; text: string; bg: string }> = {
  critical: { bar: 'bg-[#E11D48]', text: 'text-[#E11D48]', bg: 'bg-[#E11D48]/10' },
  high: { bar: 'bg-[#F97316]', text: 'text-[#EA580C]', bg: 'bg-[#F97316]/10' },
  medium: { bar: 'bg-[#F59E0B]', text: 'text-[#B45309]', bg: 'bg-[#F59E0B]/10' },
};

export default function ReportRemediation() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Remediation plan</p>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Illustrative</span>
      </div>

      <div className="space-y-5">
        {remediationPlan.map((group) => {
          const tone = toneMap[group.tone];
          return (
            <div key={group.group} className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-100">
                <span className={`w-1.5 h-6 rounded-full ${tone.bar}`} />
                <h4 className={`text-sm font-bold uppercase tracking-wider ${tone.text}`}>{group.group}</h4>
              </div>
              <div className="divide-y divide-slate-100">
                {group.items.map((item) => (
                  <div key={item.task} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-5 py-3.5">
                    <p className="text-sm font-medium text-slate-700 flex-1">{item.task}</p>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-full whitespace-nowrap">Owner: {item.owner}</span>
                      <span className={`text-[11px] font-semibold px-2 py-1 rounded-full whitespace-nowrap ${tone.bg} ${tone.text}`}>Effort: {item.effort}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        Suggested sequencing is based on illustrated risk and should be validated against the client&apos;s environment.
      </p>
    </div>
  );
}