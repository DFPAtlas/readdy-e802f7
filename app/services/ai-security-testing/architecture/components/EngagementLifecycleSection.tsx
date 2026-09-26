'use client';

import { motion } from '@/components/motion';
import { lifecycle } from '../architecture-data';

export default function EngagementLifecycleSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-3">
            Engagement lifecycle
          </p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            Twelve stages from enquiry to Security Watch.
          </h2>
          <p className="text-base text-slate-500 max-w-3xl mx-auto leading-relaxed">
            Each stage has a defined owner, a recorded state and an evidence trail inside DFP Command.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {lifecycle.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.04 }}
              className="relative rounded-2xl border border-slate-200/80 bg-[#F7F9FC] p-5"
            >
              <span className="text-[11px] font-bold text-[#E11D48]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-2 mb-1.5">{step.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}