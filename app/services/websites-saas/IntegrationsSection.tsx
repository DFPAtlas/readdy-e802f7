'use client';

import { motion } from '@/components/motion';

const categories = [
  { title: 'Payments', icon: 'ri-bank-card-line', items: ['Stripe'] },
  { title: 'CRM', icon: 'ri-contacts-line', items: ['HubSpot', 'Salesforce', 'Zoho', 'Custom CRM'] },
  { title: 'Cloud', icon: 'ri-cloud-line', items: ['AWS', 'Microsoft Azure', 'Google Cloud'] },
  { title: 'Communications', icon: 'ri-chat-3-line', items: ['Email', 'SMS', 'Voice', 'Notifications'] },
  { title: 'Automation', icon: 'ri-flow-chart', items: ['APIs', 'Webhooks', 'Workflow automation', 'AI agents'] },
];

export default function IntegrationsSection() {
  return (
    <section className="py-24 px-6 bg-[#0A1628] relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(6,182,212,0.05) 0%, transparent 60%)' }} />
      <div className="absolute inset-0 opacity-[0.01]" style={{ backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#06B6D4] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Common integrations
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Designed to connect with the tools you use.
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Digital Footprint platforms can integrate with common services across payments, CRM,
            cloud, communications and automation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.15] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-[#06B6D4]/10 flex items-center justify-center mb-4">
                <i className={`${cat.icon} text-lg w-5 h-5 flex items-center justify-center text-[#06B6D4]`} />
              </div>
              <h3 className="text-base font-bold text-white mb-3">{cat.title}</h3>
              <ul className="space-y-2">
                {cat.items.map((item) => (
                  <li key={item} className="text-sm text-slate-400">{item}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-500 mt-10 max-w-xl mx-auto leading-relaxed">
          Integration availability depends on the systems and services used by each project.
        </p>
      </div>
    </section>
  );
}