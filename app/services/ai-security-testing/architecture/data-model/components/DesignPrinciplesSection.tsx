'use client';

import { motion } from '@/components/motion';
import { dataModelPrinciples } from '../../data-model-data';

export default function DesignPrinciplesSection() {
  return (
    <section className="py-20 px-6 bg-[#F7F9FC]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-3">
            Core design principles
          </p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            Ten rules the model is built around.
          </h2>
          <p className="text-base text-slate-500 max-w-3xl mx-auto leading-relaxed">
            These principles drive every entity, relationship and state decision in the proposal.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {dataModelPrinciples.map((principle, i) => (
            <motion.div
              key={principle}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="rounded-xl border border-slate-200 bg-white p-4 flex items-start gap-3"
            >
              <span className="w-6 h-6 flex items-center justify-center rounded-md bg-[#F7F9FC] border border-slate-200 shrink-0 text-[10px] font-bold text-[#E11D48]">
                {i + 1}
              </span>
              <span className="text-sm font-semibold text-slate-700 leading-snug">{principle}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}