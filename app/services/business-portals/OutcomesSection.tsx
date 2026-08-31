'use client';

import { motion } from '@/components/motion';

const outcomes = [
  {
    title: 'Clearer Communication',
    icon: 'ri-chat-check-line',
    color: '#10B981',
    desc: 'Keep updates, messages and documents attached to the relevant customer, job or account.',
  },
  {
    title: 'Better Visibility',
    icon: 'ri-eye-line',
    color: '#06B6D4',
    desc: 'Give customers, staff and managers access to the information relevant to them.',
  },
  {
    title: 'Structured Processes',
    icon: 'ri-list-check-3',
    color: '#F97316',
    desc: 'Turn informal email or spreadsheet processes into defined workflows.',
  },
  {
    title: 'Connected Systems',
    icon: 'ri-node-tree',
    color: '#7C3AED',
    desc: 'Bring information from different business systems into one useful interface.',
  },
];

export default function OutcomesSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,rgba(16,185,129,0.05),transparent_55%)]" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#10B981] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Business outcomes
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            Designed to make business information easier to manage
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {outcomes.map((outcome, i) => (
            <motion.div
              key={outcome.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group glass-card rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105"
                style={{ backgroundColor: `${outcome.color}15` }}
              >
                <i className={`${outcome.icon} text-xl w-6 h-6 flex items-center justify-center`} style={{ color: outcome.color }} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{outcome.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{outcome.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}