import { engagementControls } from '../trust-methodology-data';

export default function RulesOfEngagementPanel() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-5">Rules of Engagement</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          {engagementControls.map((c) => (
            <div key={c} className="flex items-start gap-2.5 text-sm text-slate-600">
              <i className="ri-checkbox-circle-line w-4 h-4 flex items-center justify-center shrink-0 mt-0.5 text-[#E11D48]" aria-hidden="true" />
              {c}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-slate-900 p-6 flex flex-col justify-center">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-4">Scope state example</p>
        <div className="flex items-center gap-3 rounded-xl bg-slate-800/70 border border-slate-700 px-4 py-3 mb-4">
          <i className="ri-forbid-2-line w-5 h-5 flex items-center justify-center text-[#F97316]" aria-hidden="true" />
          <span className="text-sm text-slate-200">Out-of-scope asset</span>
          <span className="ml-auto text-[11px] font-bold text-white bg-[#E11D48] px-2 py-1 rounded-full whitespace-nowrap">BLOCKED</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          The assessment scope defines what Digital Footprint is allowed to test. Systems outside that scope are not intentionally assessed.
        </p>
      </div>
    </div>
  );
}