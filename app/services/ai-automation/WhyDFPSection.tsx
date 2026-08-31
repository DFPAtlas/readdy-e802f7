'use client';

import { motion } from '@/components/motion';

const points = [
  { title: 'More Than a Chatbot', icon: 'ri-robot-line', color: '#7C3AED', desc: 'AI can be connected to workflows, portals, APIs and existing business systems.' },
  { title: 'Human Control', icon: 'ri-shield-user-line', color: '#06B6D4', desc: 'Important business decisions can remain behind approval gates.' },
  { title: 'Connected Development', icon: 'ri-node-tree', color: '#10B981', desc: 'Digital Footprint can work across websites, SaaS platforms, business portals, cloud infrastructure and automation.' },
  { title: 'Built Around the Process', icon: 'ri-focus-3-line', color: '#F97316', desc: 'Start with the business problem and design the technology around it rather than adding AI simply because it is available.' },
];

export default function WhyDFPSection() {
  return (
    <section className="py-24 px-6 bg-[#0A1628] relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 100%, rgba(124,58,237,0.06) 0%, transparent 60%)' }} />

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
            AI connected to the wider business
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