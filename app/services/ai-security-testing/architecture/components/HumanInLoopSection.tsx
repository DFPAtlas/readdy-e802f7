'use client';

import { motion } from '@/components/motion';
import { aiMayDo, humanApprovalRequired } from '../architecture-data';

export default function HumanInLoopSection() {
  return (
    <section className="py-20 px-6 bg-[#F7F9FC]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-3">
            Human-in-the-loop
          </p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            What AI may do, and what a person must approve.
          </h2>
          <p className="text-base text-slate-500 max-w-3xl mx-auto leading-relaxed">
            AI accelerates the work. People make the decisions that carry risk or affect the customer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#E11D48]/10 flex items-center justify-center">
                <i className="ri-sparkling-line w-5 h-5 flex items-center justify-center text-[#E11D48]" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-slate-900">AI may</h3>
            </div>
            <ul className="space-y-2.5">
              {aiMayDo.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <i className="ri-checkbox-circle-line w-4 h-4 flex items-center justify-center shrink-0 mt-0.5 text-slate-400" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-[#F97316]/30 bg-slate-950 p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                <i className="ri-user-star-line w-5 h-5 flex items-center justify-center text-[#F97316]" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-white">Human approval required for</h3>
            </div>
            <ul className="space-y-2.5">
              {humanApprovalRequired.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-200">
                  <i className="ri-lock-2-line w-4 h-4 flex items-center justify-center shrink-0 mt-0.5 text-[#F97316]" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}