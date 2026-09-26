'use client';

import { motion } from '@/components/motion';
import { implementationOrder } from '../../data-model-data';

export default function ImplementationOrderSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-3">
            Suggested implementation order
          </p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            Eight phases, from foundation to audit hardening.
          </h2>
          <p className="text-base text-slate-500 max-w-3xl mx-auto leading-relaxed">
            This is a sequence proposal only. Nothing here is implemented in this task.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {implementationOrder.map((phase, i) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="rounded-2xl border border-slate-200 bg-[#F7F9FC] p-5 flex items-start gap-4"
            >
              <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 shrink-0 text-[11px] font-bold text-[#E11D48] text-center leading-tight">
                {i + 1}
              </span>
              <div className="min-w-0">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{phase.phase}</span>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{phase.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{phase.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}