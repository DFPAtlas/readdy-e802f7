import { trustStrip } from '../trust-methodology-data';

export default function TrustStrip() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {trustStrip.map((item) => (
        <div key={item.title} className="rounded-2xl border border-slate-200/80 bg-white px-5 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E11D48]/10 flex items-center justify-center shrink-0">
            <i className={`${item.icon} w-5 h-5 flex items-center justify-center text-[#E11D48]`} aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{item.title}</p>
            <p className="text-xs text-slate-500 leading-snug">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}