import { safeTestingPrinciples } from '../trust-methodology-data';

export default function SafeTestingPrinciples() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {safeTestingPrinciples.map((p) => (
        <div key={p.title} className="rounded-2xl border border-slate-200/80 bg-white p-5">
          <div className="w-10 h-10 rounded-xl bg-[#E11D48]/10 flex items-center justify-center mb-4">
            <i className={`${p.icon} w-5 h-5 flex items-center justify-center text-[#E11D48]`} aria-hidden="true" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 mb-1.5">{p.title}</h4>
          <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
        </div>
      ))}
    </div>
  );
}