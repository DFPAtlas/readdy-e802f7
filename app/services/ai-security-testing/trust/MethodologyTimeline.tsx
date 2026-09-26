import { methodologySteps } from '../trust-methodology-data';

export default function MethodologyTimeline() {
  return (
    <div className="flex flex-col lg:flex-row items-stretch gap-3">
      {methodologySteps.map((step, i) => (
        <div key={step.title} className="flex flex-col lg:flex-row items-stretch flex-1 min-w-0 gap-3">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#E11D48]/10 flex items-center justify-center shrink-0">
                <i className={`${step.icon} w-4 h-4 flex items-center justify-center text-[#E11D48]`} aria-hidden="true" />
              </div>
              <span className="text-[11px] font-bold text-slate-300">0{i + 1}</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1.5">{step.title}</h4>
            <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
          </div>
          {i < methodologySteps.length - 1 && (
            <div className="flex items-center justify-center shrink-0 lg:w-4">
              <i className="ri-arrow-down-line w-4 h-4 flex items-center justify-center text-slate-300 lg:hidden" aria-hidden="true" />
              <i className="ri-arrow-right-line w-4 h-4 hidden lg:flex items-center justify-center text-slate-300" aria-hidden="true" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}