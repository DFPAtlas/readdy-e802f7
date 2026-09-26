'use client';

import { motion } from '@/components/motion';
import { unresolvedQuestions } from '../../data-model-data';

export default function UnresolvedQuestionsSection() {
  return (
    <section className="py-20 px-6 bg-[#F7F9FC]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-3">
            Open architecture questions
          </p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            Decisions still to settle before implementation.
          </h2>
          <p className="text-base text-slate-500 max-w-3xl mx-auto leading-relaxed">
            Any future implementation must first compare this design against the current Digital Footprint database.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {unresolvedQuestions.map((q, i) => (
            <motion.div
              key={q}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="rounded-xl border border-slate-200 bg-white p-5 flex items-start gap-4"
            >
              <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#F7F9FC] border border-slate-200 shrink-0">
                <i className="ri-question-line w-4 h-4 flex items-center justify-center text-[#E11D48]" aria-hidden="true" />
              </span>
              <p className="text-sm text-slate-600 leading-relaxed">{q}</p>
            </motion.div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-6 flex items-start gap-3">
          <i className="ri-alert-line w-5 h-5 flex items-center justify-center shrink-0 text-[#B45309]" aria-hidden="true" />
          <p className="text-sm text-[#92400E] leading-relaxed">
            This document is labelled PROPOSED SECURITY SERVICE DATA MODEL. It is not the existing live Supabase schema and must not be applied without comparison to the current database.
          </p>
        </div>
      </div>
    </section>
  );
}