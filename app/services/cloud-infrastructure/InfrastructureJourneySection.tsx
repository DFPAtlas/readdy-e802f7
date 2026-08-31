'use client';

import { motion } from '@/components/motion';

const stages = [
  { title: 'Assess', icon: 'ri-search-eye-line', color: '#3B82F6', desc: 'Understand the existing environment, problems and requirements.' },
  { title: 'Design', icon: 'ri-draft-line', color: '#06B6D4', desc: 'Plan the network, cloud, server or security architecture.' },
  { title: 'Implement', icon: 'ri-tools-line', color: '#10B981', desc: 'Deploy and configure the agreed infrastructure.' },
  { title: 'Verify', icon: 'ri-check-double-line', color: '#F97316', desc: 'Check connectivity, services, backups and expected behaviour.' },
  { title: 'Support', icon: 'ri-customer-service-2-line', color: '#7C3AED', desc: 'Maintain, monitor and improve the environment as requirements change.' },
];

export default function InfrastructureJourneySection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,rgba(59,130,246,0.05),transparent_55%)]" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#3B82F6] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Infrastructure journey
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            From assessment to ongoing support
          </h2>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-7 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3B82F6]/30 to-transparent" />
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
                  <div className="lg:hidden absolute left-6 top-12 bottom-[-2.5rem] w-px bg-slate-200" aria-hidden="true" />
                )}
                <div className="relative z-10 w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-white border border-[#3B82F6]/30 flex items-center justify-center shrink-0 shadow-sm">
                  <i className={`${stage.icon} text-xl w-6 h-6 flex items-center justify-center`} style={{ color: stage.color }} />
                </div>
                <div className="lg:mt-5">
                  <span className="block text-xs font-semibold text-[#3B82F6] mb-1">
                    Stage {i + 1}
                  </span>
                  <h3 className="text-lg font-bold text-slate-800">{stage.title}</h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-[220px] mx-auto">{stage.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}