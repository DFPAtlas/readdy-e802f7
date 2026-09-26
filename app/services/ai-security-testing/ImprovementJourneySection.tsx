'use client';

import { motion } from '@/components/motion';
import { journeySteps } from './security-enrichment-data';

export default function ImprovementJourneySection() {
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
            Security improvement journey
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            Security should improve after the report.
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            The assessment is the beginning of the improvement process, not the end.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-stretch gap-3">
          {journeySteps.map((step, i) => (
            <div key={step.title} className="flex flex-col lg:flex-row items-stretch flex-1 min-w-0 gap-3">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="glass-card rounded-2xl p-5 flex-1"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#E11D48]/10 flex items-center justify-center shrink-0">
                    <i className={`${step.icon} w-5 h-5 flex items-center justify-center text-[#E11D48]`} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-300">0{i + 1}</span>
                </div>
                <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-slate-900 mb-1.5">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </motion.div>
              {i < journeySteps.length - 1 && (
                <div className="flex items-center justify-center shrink-0 lg:w-4">
                  <i className="ri-arrow-down-line w-5 h-5 flex items-center justify-center text-slate-300 lg:hidden" />
                  <i className="ri-arrow-right-line w-5 h-5 hidden lg:flex items-center justify-center text-slate-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}