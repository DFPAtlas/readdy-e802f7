'use client';

import { motion } from '@/components/motion';

const factors = [
  'application requirements',
  'users',
  'storage',
  'integrations',
  'resilience',
  'security',
  'budget',
  'growth requirements',
];

const platforms = [
  {
    title: 'AWS',
    icon: 'ri-amazon-line',
    color: '#F97316',
    items: ['Application hosting', 'Storage', 'Databases', 'Networking', 'Scalable cloud services'],
  },
  {
    title: 'Microsoft Azure',
    icon: 'ri-microsoft-line',
    color: '#3B82F6',
    items: ['Microsoft-connected environments', 'Virtual systems', 'Identity integration', 'Cloud workloads'],
  },
  {
    title: 'Google Cloud',
    icon: 'ri-google-fill',
    color: '#10B981',
    items: ['Cloud applications', 'Data services', 'Hosting', 'Integrated cloud workloads'],
  },
  {
    title: 'Private / Hybrid Infrastructure',
    icon: 'ri-stack-line',
    color: '#7C3AED',
    items: ['Local servers', 'Private virtualisation', 'Cloud-connected systems', 'Hybrid workloads'],
  },
];

export default function CloudPlatformsSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_30%,rgba(59,130,246,0.05),transparent_55%)]" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-[#3B82F6] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Cloud platforms
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            Cloud infrastructure designed around the workload
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            The right environment depends on what the systems need to do and how the business is
            likely to grow.
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-14">
          {factors.map((factor) => (
            <span
              key={factor}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
            >
              <i className="ri-checkbox-circle-line w-3.5 h-3.5 flex items-center justify-center text-[#3B82F6]" />
              {factor}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {platforms.map((platform, i) => (
            <motion.div
              key={platform.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="group glass-card rounded-2xl p-6"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105"
                style={{ backgroundColor: `${platform.color}15` }}
              >
                <i className={`${platform.icon} text-xl w-6 h-6 flex items-center justify-center`} style={{ color: platform.color }} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-4">{platform.title}</h3>
              <p className="text-xs uppercase tracking-wider text-slate-400 mb-3">Possible uses</p>
              <ul className="space-y-2.5">
                {platform.items.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <i className="ri-check-line w-4 h-4 flex items-center justify-center shrink-0" style={{ color: platform.color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-500 mt-10 max-w-xl mx-auto leading-relaxed">
          Platform selection depends on the technical and commercial requirements of each project.
        </p>
      </div>
    </section>
  );
}