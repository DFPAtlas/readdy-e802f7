'use client';

import { motion } from '@/components/motion';
import { remediationWorkflow } from '../architecture-data';

export default function RemediationWorkflowSection() {
  return (
    <section className="py-20 px-6 bg-[#F7F9FC]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-3">
            Remediation workflow
          </p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            From finding to a verified fix.
          </h2>
          <p className="text-base text-slate-500 max-w-3xl mx-auto leading-relaxed">
            Remediation integrates conceptually with DFP Command so ownership, progress and retest status stay in one place.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-slate-950 border border-slate-800 p-6 md:p-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            {remediationWorkflow.map((step, i) => (
              <div key={step} className="flex flex-col lg:flex-row lg:items-center lg:flex-1 min-w-0 gap-3">
                <div className="rounded-xl bg-slate-900/80 border border-slate-800 px-4 py-3 lg:flex-1 min-w-0 text-center">
                  <span className="text-xs font-semibold text-slate-200">{step}</span>
                </div>
                {i < remediationWorkflow.length - 1 && (
                  <div className="flex items-center justify-center shrink-0 lg:w-4">
                    <i className="ri-arrow-down-line w-4 h-4 flex items-center justify-center text-slate-600 lg:hidden" aria-hidden="true" />
                    <i className="ri-arrow-right-line w-4 h-4 hidden lg:flex items-center justify-center text-slate-600" aria-hidden="true" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-800">
            <div className="rounded-xl bg-slate-900/80 border border-slate-800 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Owner examples</p>
              <p className="text-sm text-slate-200">IT · Development · Cloud · Management</p>
            </div>
            <div className="rounded-xl bg-slate-900/80 border border-slate-800 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Effort examples</p>
              <p className="text-sm text-slate-200">Low · Medium · High</p>
            </div>
            <div className="rounded-xl bg-slate-900/80 border border-slate-800 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Tracking</p>
              <p className="text-sm text-slate-200">Recorded against the finding</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}