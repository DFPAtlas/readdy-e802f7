'use client';

import { motion } from '@/components/motion';

const points = [
  {
    title: 'Application Understanding',
    icon: 'ri-code-s-slash-line',
    color: '#3B82F6',
    desc: 'Digital Footprint builds websites, portals, SaaS products and automation, so infrastructure decisions can consider the systems running on top of it.',
  },
  {
    title: 'Connected Thinking',
    icon: 'ri-node-tree',
    color: '#06B6D4',
    desc: 'Cloud, networks, servers, security and applications can be considered as parts of one architecture.',
  },
  {
    title: 'Practical Infrastructure',
    icon: 'ri-layout-4-line',
    color: '#10B981',
    desc: 'Solutions should fit the real requirements of the organisation rather than adding unnecessary complexity.',
  },
  {
    title: 'Ongoing Evolution',
    icon: 'ri-refresh-line',
    color: '#F97316',
    desc: 'Infrastructure can be reviewed and expanded as business systems, users and locations change.',
  },
];

export default function WhyDFPSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_30%,rgba(59,130,246,0.05),transparent_55%)]" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#3B82F6] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Why Digital Footprint
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            One team across software and infrastructure
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {points.map((point, i) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group glass-card rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105"
                style={{ backgroundColor: `${point.color}15` }}
              >
                <i className={`${point.icon} text-xl w-6 h-6 flex items-center justify-center`} style={{ color: point.color }} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{point.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{point.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}