'use client';

import { motion } from '@/components/motion';

const stages = [
  { title: 'Access', icon: 'ri-login-box-line', color: '#10B981', desc: 'Users log in and access their information.' },
  { title: 'Communication', icon: 'ri-message-3-line', color: '#06B6D4', desc: 'Add messages, documents and notifications.' },
  { title: 'Workflow', icon: 'ri-flow-chart', color: '#F97316', desc: 'Add tasks, approvals, bookings or job management.' },
  { title: 'Integrations', icon: 'ri-plug-line', color: '#7C3AED', desc: 'Connect CRM, payments, APIs and other business systems.' },
  { title: 'Automation', icon: 'ri-robot-line', color: '#EC4899', desc: 'Introduce workflow automation and AI where appropriate.' },
];

export default function ProgressionSection() {
  return (
    <section className="py-24 px-6 bg-[#060F1E] relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(16,185,129,0.06) 0%, transparent 60%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#10B981] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            From simple portal to business platform
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Start with the portal you need today.
          </h2>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-7 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#10B981]/30 to-transparent" />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-5">
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
                  <div className="lg:hidden absolute left-6 top-12 bottom-[-2.5rem] w-px bg-white/10" aria-hidden="true" />
                )}
                <div className="relative z-10 w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-[#0A1628] border border-[#10B981]/30 flex items-center justify-center shrink-0">
                  <i className={`${stage.icon} text-xl w-6 h-6 flex items-center justify-center`} style={{ color: stage.color }} />
                </div>
                <div className="lg:mt-5">
                  <span className="block text-xs font-semibold text-[#10B981] mb-1">
                    Stage {i + 1}
                  </span>
                  <h3 className="text-lg font-bold text-white">{stage.title}</h3>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed max-w-[220px] mx-auto">{stage.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-slate-400 max-w-2xl mx-auto mt-16 leading-relaxed"
        >
          A portal can begin as a focused customer or staff area and develop into a broader
          operational platform as requirements grow.
        </motion.p>
      </div>
    </section>
  );
}