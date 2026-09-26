'use client';

import { motion } from '@/components/motion';
import { approvalGates } from '../architecture-data';

export default function ApprovalGatesSection() {
  return (
    <section className="py-20 px-6 bg-[#F7F9FC]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-3">
            Approval gates
          </p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            Five explicit gates before consequential steps.
          </h2>
          <p className="text-base text-slate-500 max-w-3xl mx-auto leading-relaxed">
            Higher-risk work requires a recorded human approval. Nothing moves to the next gate until the current one is met.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {approvalGates.map((gate, i) => (
            <motion.div
              key={gate.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{gate.id}</span>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#B45309] bg-[#F59E0B]/10 px-2 py-0.5 rounded-full">
                  <i className="ri-lock-2-line w-3 h-3 flex items-center justify-center" aria-hidden="true" />
                  Required
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">{gate.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">{gate.desc}</p>
              <div className="mt-auto pt-3 border-t border-slate-100">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Approver</p>
                <p className="text-xs font-semibold text-slate-600">{gate.owner}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}