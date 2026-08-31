'use client';

import { motion } from '@/components/motion';

const layers = [
  {
    title: 'Identity & Access',
    icon: 'ri-fingerprint-line',
    color: '#3B82F6',
    desc: 'Control who can access systems and services.',
  },
  {
    title: 'Network Protection',
    icon: 'ri-shield-flash-line',
    color: '#06B6D4',
    desc: 'Use appropriate network boundaries, firewall rules and segmentation.',
  },
  {
    title: 'Device Protection',
    icon: 'ri-computer-line',
    color: '#10B981',
    desc: 'Protect supported business endpoints and devices.',
  },
  {
    title: 'Monitoring',
    icon: 'ri-eye-2-line',
    color: '#F97316',
    desc: 'Identify unusual behaviour, failures or security events where appropriate.',
  },
  {
    title: 'Recovery',
    icon: 'ri-archive-line',
    color: '#7C3AED',
    desc: 'Maintain backups and recovery processes for important systems and data.',
  },
];

export default function CyberSecuritySection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_50%,rgba(249,115,22,0.05),transparent_55%)]" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#3B82F6] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Cyber security layer
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            Security should be part of the infrastructure, not added afterwards.
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Security is built from several connected layers rather than a single product or
            one-off measure.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {layers.map((layer, i) => (
            <motion.div
              key={layer.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="group glass-card rounded-2xl p-6"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105"
                style={{ backgroundColor: `${layer.color}15` }}
              >
                <i className={`${layer.icon} text-xl w-6 h-6 flex items-center justify-center`} style={{ color: layer.color }} />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">{layer.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{layer.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center"
        >
          <div className="inline-flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 max-w-2xl">
            <i className="ri-information-line text-xl w-6 h-6 flex items-center justify-center text-[#3B82F6] shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 leading-relaxed">
              Security controls should be selected after understanding the systems, data and risks
              involved. No single product provides complete protection.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}