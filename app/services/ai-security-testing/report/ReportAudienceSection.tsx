import { audienceSplit, lifecycle } from '../report-preview-data';

export default function ReportAudienceSection() {
  return (
    <div className="mt-16 space-y-12">
      <div>
        <div className="text-center mb-10">
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-3">
            Technical detail without losing the business context.
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#E11D48]/10 flex items-center justify-center">
                <i className="ri-terminal-box-line w-5 h-5 flex items-center justify-center text-[#E11D48]" />
              </div>
              <h4 className="text-base font-bold text-slate-900">For technical teams</h4>
            </div>
            <ul className="space-y-2.5">
              {audienceSplit.technical.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <i className="ri-check-line w-4 h-4 flex items-center justify-center shrink-0 mt-0.5 text-[#E11D48]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#F97316]/10 flex items-center justify-center">
                <i className="ri-bar-chart-box-line w-5 h-5 flex items-center justify-center text-[#EA580C]" />
              </div>
              <h4 className="text-base font-bold text-slate-900">For decision makers</h4>
            </div>
            <ul className="space-y-2.5">
              {audienceSplit.decision.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <i className="ri-check-line w-4 h-4 flex items-center justify-center shrink-0 mt-0.5 text-[#EA580C]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E11D48]/20 bg-gradient-to-br from-[#E11D48]/5 to-white p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#E11D48] mb-2">Top priority</p>
            <h4 className="text-xl font-bold text-slate-900 mb-3">Protect privileged identities</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Why</p>
                <p className="text-sm text-slate-600 leading-relaxed">Identity weaknesses can create access paths across multiple systems.</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Action</p>
                <p className="text-sm text-slate-600 leading-relaxed">Enforce MFA and reduce privileged access.</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 lg:flex-col lg:items-end shrink-0">
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full whitespace-nowrap">Owner: IT / Management</span>
            <span className="text-[11px] font-semibold text-[#EA580C] bg-[#F97316]/10 px-3 py-1.5 rounded-full whitespace-nowrap">Action required</span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex flex-col md:flex-row items-stretch gap-3">
          {lifecycle.map((step, i) => (
            <div key={step} className="flex flex-col md:flex-row items-stretch flex-1 min-w-0 gap-3">
              <div className="rounded-xl border border-slate-200/80 bg-white px-4 py-3 flex items-center justify-center flex-1">
                <span className="text-xs font-semibold text-slate-700 text-center">{step}</span>
              </div>
              {i < lifecycle.length - 1 && (
                <div className="flex items-center justify-center shrink-0 md:w-4">
                  <i className="ri-arrow-down-line w-4 h-4 flex items-center justify-center text-slate-300 md:hidden" />
                  <i className="ri-arrow-right-line w-4 h-4 hidden md:flex items-center justify-center text-slate-300" />
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-500 mt-6 max-w-3xl leading-relaxed">
          The report is designed to remain useful throughout the remediation process rather than becoming a one-time PDF that is forgotten.
        </p>
      </div>
    </div>
  );
}