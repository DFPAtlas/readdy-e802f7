'use client';

import { motion } from '@/components/motion';

const stages = [
  { title: 'Identify', icon: 'ri-search-eye-line', color: '#06B6D4', desc: 'Find a repetitive or slow process worth improving.' },
  { title: 'Automate', icon: 'ri-flow-chart', color: '#7C3AED', desc: 'Connect the required systems and remove unnecessary manual steps.' },
  { title: 'Add Intelligence', icon: 'ri-robot-line', color: '#F97316', desc: 'Introduce AI where interpretation, classification or assistance adds value.' },
  { title: 'Govern', icon: 'ri-shield-check-line', color: '#10B981', desc: 'Define permissions, approval requirements and escalation rules.' },
  { title: 'Expand', icon: 'ri-expand-diagonal-line', color: '#A855F7', desc: 'Connect additional workflows once the first process is operating reliably.' },
];

export default function StartSmallSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_100%,rgba(6,182,212,0.05),transparent_55%)]" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#7C3AED] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Start small, expand later
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            Automation does not need to start with a huge project.
          </h2>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-7 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#06B6D4]/30 to-transparent" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-5">
            {stages.map((stage, i) => (
              <motion.div
                key={stage.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="relative flex lg:flex-col items-start lg:items-center gap-4 lg:gap-0 lg:text-center"
              >
                {i < stages.length - 1 && (
                  <div className="lg:hidden absolute left-6 top-12 bottom-[-2.5rem] w-px bg-slate-200" aria-hidden="true" />
                )}
                <div className="relative z-10 w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-white border border-[#06B6D4]/30 flex items-center justify-center shrink-0 shadow-sm">
                  <i className={`${stage.icon} text-xl w-6 h-6 flex items-center justify-center`} style={{ color: stage.color }} />
                </div>
                <div className="lg:mt-5">
                  <span className="block text-xs font-semibold text-[#06B6D4] mb-1">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-lg font-bold text-slate-800">{stage.title}</h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-[220px] mx-auto">{stage.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-slate-500 max-w-2xl mx-auto mt-16 leading-relaxed"
        >
          A focused automation that solves one genuine business problem is often a better starting
          point than trying to automate an entire organisation at once.
        </motion.p>
      </div>
    </section>
  );
}