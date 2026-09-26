'use client';

import { motion } from '@/components/motion';
import { findingStates, findingAltStates } from '../architecture-data';

export default function FindingStatesSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-3">
            Finding states
          </p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            A finding has a clear, auditable state.
          </h2>
          <p className="text-base text-slate-500 max-w-3xl mx-auto leading-relaxed">
            State changes are recorded against the finding so progress and validation can be tracked over time.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-slate-200/80 bg-[#F7F9FC] p-6 md:p-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            {findingStates.map((state, i) => (
              <div key={state} className="flex flex-col lg:flex-row lg:items-center lg:flex-1 min-w-0 gap-3">
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 lg:flex-1 min-w-0 text-center">
                  <span className="text-xs font-semibold text-slate-700">{state}</span>
                </div>
                {i < findingStates.length - 1 && (
                  <div className="flex items-center justify-center shrink-0 lg:w-4">
                    <i className="ri-arrow-down-line w-4 h-4 flex items-center justify-center text-slate-300 lg:hidden" aria-hidden="true" />
                    <i className="ri-arrow-right-line w-4 h-4 hidden lg:flex items-center justify-center text-slate-300" aria-hidden="true" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-slate-200 flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Also allowed</span>
            {findingAltStates.map((state) => (
              <span key={state} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-full">
                <i className="ri-shuffle-line w-3.5 h-3.5 flex items-center justify-center text-[#EA580C]" aria-hidden="true" />
                {state}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}