'use client';

import { motion } from '@/components/motion';

const groups = [
  {
    title: 'Switching',
    icon: 'ri-node-tree',
    items: ['Managed switches', 'Network segmentation', 'VLANs', 'Uplinks', 'Network expansion'],
  },
  {
    title: 'Wi-Fi',
    icon: 'ri-wifi-line',
    items: ['Business wireless', 'Access points', 'Coverage planning', 'Guest networks', 'Segmentation'],
  },
  {
    title: 'VPN & Remote Access',
    icon: 'ri-key-2-line',
    items: ['Site-to-site connectivity', 'Secure remote access', 'Remote workers', 'Controlled access'],
  },
  {
    title: 'Firewalls',
    icon: 'ri-shield-flash-line',
    items: ['Traffic control', 'Network boundaries', 'Access policies', 'Secure connectivity'],
  },
  {
    title: 'Multi-Site Connectivity',
    icon: 'ri-building-2-line',
    items: ['Offices', 'Remote sites', 'Cloud connectivity', 'Central services'],
  },
  {
    title: 'Network Monitoring',
    icon: 'ri-radar-line',
    items: ['Availability', 'Device health', 'Alerts', 'Fault identification'],
  },
];

export default function NetworkInfrastructureSection() {
  return (
    <section className="py-24 px-6 bg-[#0A1628] relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 100%, rgba(59,130,246,0.05) 0%, transparent 60%)' }} />
      <div className="absolute inset-0 opacity-[0.01]" style={{ backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#3B82F6] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Network infrastructure
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Reliable connectivity from desk to cloud
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {groups.map((group, i) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.15] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center mb-4">
                <i className={`${group.icon} text-lg w-5 h-5 flex items-center justify-center text-[#3B82F6]`} />
              </div>
              <h3 className="text-base font-bold text-white mb-3">{group.title}</h3>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-400">
                    <i className="ri-link w-4 h-4 flex items-center justify-center text-[#3B82F6]/70 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}