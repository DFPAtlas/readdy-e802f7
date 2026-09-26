'use client';

import { motion } from '@/components/motion';
import { isolationItems } from '../architecture-data';

export default function DataBoundarySection() {
  return (
    <section className="py-20 px-6 bg-[#F7F9FC]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-3">
            Customer data boundaries
          </p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            One engagement never sees another.
          </h2>
          <p className="text-base text-slate-500 max-w-3xl mx-auto leading-relaxed">
            Each engagement is logically separated, and cross-customer AI context is not permitted.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 mb-6">Separation model</p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 w-full rounded-2xl bg-[#F7F9FC] border border-slate-200 p-5 text-center">
                <i className="ri-user-3-line w-6 h-6 flex items-center justify-center text-[#E11D48] mx-auto mb-2" aria-hidden="true" />
                <p className="text-sm font-bold text-slate-900">Customer A data</p>
                <p className="text-xs text-slate-500 mt-1">Isolated engagement scope</p>
              </div>
              <div className="shrink-0 w-10 h-10 rounded-full border border-[#E11D48]/30 bg-[#E11D48]/10 flex items-center justify-center">
                <i className="ri-close-line w-5 h-5 flex items-center justify-center text-[#E11D48]" aria-hidden="true" />
              </div>
              <div className="flex-1 w-full rounded-2xl bg-[#F7F9FC] border border-slate-200 p-5 text-center">
                <i className="ri-user-3-line w-6 h-6 flex items-center justify-center text-[#EA580C] mx-auto mb-2" aria-hidden="true" />
                <p className="text-sm font-bold text-slate-900">Customer B data</p>
                <p className="text-xs text-slate-500 mt-1">Isolated engagement scope</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mt-6">
              Evidence, findings and report context are scoped to a single engagement. Cross-customer RAG context is not allowed.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-slate-950 border border-slate-800 p-6 md:p-8"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 mb-6">Isolation controls</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {isolationItems.map((item) => (
                <div key={item} className="rounded-xl bg-slate-900/80 border border-slate-800 px-4 py-4 flex items-center gap-3">
                  <i className="ri-lock-2-line w-5 h-5 flex items-center justify-center shrink-0 text-[#F97316]" aria-hidden="true" />
                  <span className="text-sm text-slate-200">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mt-6">
              Least privilege applies to agents, evidence access and reporting. Agents only reach the assets within their scope token.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}