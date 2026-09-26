import { oversightFlow } from '../trust-methodology-data';

export default function HumanOversightFlow() {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0 mb-6">
        {oversightFlow.map((node, i) => (
          <div key={node} className="flex flex-col md:flex-row md:items-center md:flex-1 min-w-0">
            <div className={`rounded-xl border px-3 py-3 md:flex-1 min-w-0 text-center ${i === oversightFlow.length - 1 ? 'border-[#E11D48]/30 bg-[#E11D48]/5' : 'border-slate-200 bg-slate-50'}`}>
              <span className={`text-xs font-semibold ${i === oversightFlow.length - 1 ? 'text-[#E11D48]' : 'text-slate-600'}`}>{node}</span>
            </div>
            {i < oversightFlow.length - 1 && (
              <div className="flex items-center justify-center shrink-0 md:w-6 py-1 md:py-0">
                <i className="ri-arrow-down-line w-4 h-4 flex items-center justify-center text-slate-300 md:hidden" aria-hidden="true" />
                <i className="ri-arrow-right-line w-4 h-4 hidden md:flex items-center justify-center text-slate-300" aria-hidden="true" />
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-base font-bold text-slate-900 mb-2">
        AI helps us work faster. Humans decide what becomes a finding.
      </p>
      <p className="text-sm text-slate-500 leading-relaxed max-w-3xl">
        AI assists with discovery, correlation and analysis, but material findings are reviewed before they are presented to the client.
      </p>
    </div>
  );
}