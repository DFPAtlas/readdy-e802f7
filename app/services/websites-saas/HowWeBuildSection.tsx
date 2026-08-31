'use client';

import { motion } from '@/components/motion';

const stages = [
  { title: 'Discover', icon: 'ri-search-eye-line', color: '#06B6D4', desc: 'Understand the business, users, processes and desired outcomes.' },
  { title: 'Design', icon: 'ri-pencil-ruler-line', color: '#A855F7', desc: 'Plan the user journeys, information architecture and system experience.' },
  { title: 'Build', icon: 'ri-code-s-slash-line', color: '#F97316', desc: 'Develop the platform using modern web technologies and secure integrations.' },
  { title: 'Improve', icon: 'ri-line-chart-line', color: '#10B981', desc: 'Monitor, support and expand the platform as the business evolves.' },
];

export default function HowWeBuildSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_30%,rgba(6,182,212,0.05),transparent_55%)]" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#06B6D4] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            How we build
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            Built around the way your business actually works.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stages.map((stage, i) => (
            <motion.div
              key={stage.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative glass-card rounded-2xl p-6"
            >
              <span className="absolute top-6 right-6 text-4xl font-bold text-slate-100 select-none">
                {i + 1}
              </span>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105"
                style={{ backgroundColor: `${stage.color}15` }}
              >
                <i className={`${stage.icon} text-xl w-6 h-6 flex items-center justify-center`} style={{ color: stage.color }} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{stage.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{stage.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}