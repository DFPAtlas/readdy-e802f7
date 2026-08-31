'use client';

import { motion } from '@/components/motion';

const systems = [
  {
    title: 'CCTV Systems',
    icon: 'ri-vidicon-line',
    color: '#3B82F6',
    items: ['IP cameras', 'Network video systems', 'Remote viewing', 'Recording infrastructure'],
  },
  {
    title: 'Access Control',
    icon: 'ri-door-lock-line',
    color: '#06B6D4',
    items: ['Controlled entry', 'Network-connected systems', 'User management', 'Event records'],
  },
  {
    title: 'Smart Monitoring',
    icon: 'ri-sensor-line',
    color: '#10B981',
    items: ['Sensors', 'Alerts', 'Connected devices', 'Remote status'],
  },
  {
    title: 'Secure Networks for Physical Systems',
    icon: 'ri-shield-keyhole-line',
    color: '#F97316',
    items: ['Segmentation', 'Dedicated networks', 'Remote connectivity', 'Controlled access'],
  },
];

export default function PhysicalSecuritySection() {
  return (
    <section className="py-24 px-6 bg-[#0A1628] relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(59,130,246,0.05) 0%, transparent 60%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#3B82F6] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Physical &amp; smart security
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Digital infrastructure can extend beyond the server room.
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Digital Footprint can also help connect relevant physical security technology into wider
            business infrastructure.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {systems.map((system, i) => (
            <motion.div
              key={system.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.15] hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: `${system.color}18` }}
              >
                <i className={`${system.icon} text-xl w-6 h-6 flex items-center justify-center`} style={{ color: system.color }} />
              </div>
              <h3 className="text-base font-bold text-white mb-3 leading-snug">{system.title}</h3>
              <ul className="space-y-2">
                {system.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-400">
                    <i className="ri-check-line w-4 h-4 flex items-center justify-center shrink-0" style={{ color: system.color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center"
        >
          <div className="inline-flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-6 py-4 max-w-2xl">
            <i className="ri-information-line text-xl w-6 h-6 flex items-center justify-center text-[#3B82F6] shrink-0 mt-0.5" />
            <p className="text-sm text-slate-300 leading-relaxed">
              Any CCTV, access control or monitoring deployment should be configured around the
              organisation&apos;s operational, security and privacy requirements.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}