'use client';

import { motion } from '@/components/motion';

const points = [
  { title: 'Business-first development', icon: 'ri-briefcase-line', color: '#06B6D4', desc: 'Technology should solve a genuine business problem rather than exist for its own sake.' },
  { title: 'One connected platform', icon: 'ri-node-tree', color: '#A855F7', desc: 'Websites, portals, automation, AI and infrastructure can work together rather than becoming disconnected systems.' },
  { title: 'Designed to grow', icon: 'ri-seedling-line', color: '#10B981', desc: 'Systems can start small and expand as the organisation develops.' },
  { title: 'Long-term support', icon: 'ri-shield-check-line', color: '#F97316', desc: 'Digital Footprint can continue supporting and improving systems after launch.' },
];

export default function WhyDFPSection() {
  return (
    <section className="py-24 px-6 bg-[#0A1628] relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 100%, rgba(249,115,22,0.05) 0%, transparent 60%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#06B6D4] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Why Digital Footprint
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Built as a partner, not a one-off.
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
              className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.15] hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: `${point.color}18` }}
              >
                <i className={`${point.icon} text-xl w-6 h-6 flex items-center justify-center`} style={{ color: point.color }} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{point.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{point.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}