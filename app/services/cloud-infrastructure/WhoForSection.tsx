'use client';

import { motion } from '@/components/motion';

const useCases = [
  { label: 'New office setup', icon: 'ri-building-4-line' },
  { label: 'Existing network upgrade', icon: 'ri-arrow-up-circle-line' },
  { label: 'Cloud migration', icon: 'ri-cloud-line' },
  { label: 'New business platform deployment', icon: 'ri-rocket-line' },
  { label: 'Remote working infrastructure', icon: 'ri-home-8-line' },
  { label: 'Multi-site connectivity', icon: 'ri-git-branch-line' },
  { label: 'Server replacement', icon: 'ri-server-line' },
  { label: 'Backup improvement', icon: 'ri-archive-line' },
  { label: 'Wi-Fi upgrade', icon: 'ri-wifi-line' },
  { label: 'Security improvement project', icon: 'ri-shield-keyhole-line' },
  { label: 'CCTV infrastructure', icon: 'ri-vidicon-line' },
  { label: 'Business continuity planning', icon: 'ri-shield-check-line' },
  { label: 'Ongoing IT support', icon: 'ri-customer-service-2-line' },
  { label: 'Application hosting', icon: 'ri-global-line' },
  { label: 'Hybrid cloud environment', icon: 'ri-stack-line' },
];

export default function WhoForSection() {
  return (
    <section className="py-24 px-6 bg-[#060F1E] relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 100%, rgba(59,130,246,0.06) 0%, transparent 60%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#3B82F6] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Who this service is for
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Infrastructure support for growing businesses
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            These are the kinds of situations where businesses typically benefit from infrastructure
            planning, delivery or support.
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
          {useCases.map((useCase, i) => (
            <motion.div
              key={useCase.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-2.5 rounded-full border border-white/[0.1] bg-white/[0.03] px-4 py-2.5 hover:border-[#3B82F6]/40 transition-colors"
            >
              <i className={`${useCase.icon} w-4 h-4 flex items-center justify-center text-[#3B82F6] shrink-0`} />
              <span className="text-sm text-slate-300">{useCase.label}</span>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-500 mt-10 max-w-xl mx-auto leading-relaxed">
          These are examples only.
        </p>
      </div>
    </section>
  );
}