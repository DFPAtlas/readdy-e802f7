'use client';

import { motion } from '@/components/motion';
import { beforeItems, afterItems } from './security-enrichment-data';

export default function BeforeAfterSection() {
  return (
    <section className="py-24 px-6 bg-[#F7F9FC] relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Before and after
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            From exposed to controlled
          </h2>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 text-sm font-semibold text-[#047857]">
            <i className="ri-arrow-down-line w-4 h-4 rotate-[-90deg] flex items-center justify-center" />
            Reduced risk
          </span>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-stretch gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex-1 rounded-2xl border border-slate-200 bg-white p-7"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <i className="ri-error-warning-line w-5 h-5 flex items-center justify-center text-slate-400" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-[0.1em] text-slate-500">Before</h3>
            </div>
            <ul className="space-y-3">
              {beforeItems.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-slate-500">
                  <i className="ri-close-line w-4 h-4 flex items-center justify-center text-slate-300 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <div className="flex items-center justify-center shrink-0">
            <i className="ri-arrow-down-line lg:hidden w-6 h-6 flex items-center justify-center text-slate-300" />
            <i className="ri-arrow-right-line w-6 h-6 hidden lg:flex items-center justify-center text-slate-300" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex-1 rounded-2xl border border-[#10B981]/25 bg-gradient-to-b from-[#10B981]/[0.06] to-transparent p-7"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/12 flex items-center justify-center">
                <i className="ri-shield-check-line w-5 h-5 flex items-center justify-center text-[#047857]" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-[0.1em] text-[#047857]">After DFP</h3>
            </div>
            <ul className="space-y-3">
              {afterItems.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                  <i className="ri-check-line w-4 h-4 flex items-center justify-center text-[#10B981] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <p className="text-center text-sm text-slate-500 max-w-3xl mx-auto mt-8 leading-relaxed">
          Security is never absolute. Our goal is reduced, well-understood and monitored risk — not a
          claim that every threat has been removed.
        </p>
      </div>
    </section>
  );
}