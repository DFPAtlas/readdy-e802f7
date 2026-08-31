'use client';

import { motion } from '@/components/motion';

const services = [
  {
    title: 'Cloud Systems',
    icon: 'ri-cloud-line',
    color: '#3B82F6',
    items: ['Cloud hosting', 'Cloud architecture', 'System migration', 'Application hosting', 'Storage', 'Cloud management'],
  },
  {
    title: 'Servers',
    icon: 'ri-server-line',
    color: '#06B6D4',
    items: ['Server configuration', 'Virtual machines', 'Application servers', 'File services', 'Performance monitoring', 'Maintenance'],
  },
  {
    title: 'Business Networks',
    icon: 'ri-git-branch-line',
    color: '#10B981',
    items: ['Network design', 'Switches', 'Wi-Fi', 'VLAN planning', 'VPN connectivity', 'Site connectivity'],
  },
  {
    title: 'Cyber Security',
    icon: 'ri-shield-keyhole-line',
    color: '#F97316',
    items: ['Security reviews', 'Firewalls', 'Endpoint protection', 'Access controls', 'Security monitoring', 'Incident preparation'],
  },
  {
    title: 'Backup & Recovery',
    icon: 'ri-archive-line',
    color: '#7C3AED',
    items: ['Backup planning', 'Data protection', 'Recovery planning', 'Off-site copies', 'Restore processes', 'Resilience planning'],
  },
  {
    title: 'IT Support',
    icon: 'ri-customer-service-2-line',
    color: '#EC4899',
    items: ['Remote support', 'On-site support', 'User issues', 'Device setup', 'Software support', 'Infrastructure troubleshooting'],
  },
];

export default function WhatWeSupportSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,rgba(59,130,246,0.06),transparent_55%)]" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#3B82F6] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            What we support
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            Infrastructure from cloud to physical network
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Digital Footprint can support the full range of technology underneath a modern business,
            from cloud services down to the devices people use every day.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group glass-card rounded-2xl p-6"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105"
                style={{ backgroundColor: `${service.color}15` }}
              >
                <i className={`${service.icon} text-xl w-6 h-6 flex items-center justify-center`} style={{ color: service.color }} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{service.title}</h3>
              <ul className="space-y-2.5">
                {service.items.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <i className="ri-check-line w-4 h-4 flex items-center justify-center shrink-0" style={{ color: service.color }} />
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