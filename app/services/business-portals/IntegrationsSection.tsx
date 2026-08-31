'use client';

import { motion } from '@/components/motion';

const categories = [
  { title: 'CRM', icon: 'ri-contacts-line', items: ['HubSpot', 'Salesforce', 'Zoho', 'Custom CRM'] },
  { title: 'Payments', icon: 'ri-bank-card-line', items: ['Stripe', 'Payment status', 'Invoice workflows'] },
  { title: 'Communications', icon: 'ri-chat-3-line', items: ['Email', 'SMS', 'Notifications', 'Support systems'] },
  { title: 'Cloud & Storage', icon: 'ri-cloud-line', items: ['Cloud file storage', 'Document systems', 'Business databases'] },
  { title: 'APIs', icon: 'ri-plug-line', items: ['Third-party APIs', 'Internal systems', 'Webhooks', 'Data services'] },
  { title: 'AI & Automation', icon: 'ri-brain-line', items: ['Workflow automation', 'AI assistants', 'Document processing', 'Automated routing'] },
];

export default function IntegrationsSection() {
  return (
    <section className="py-24 px-6 bg-[#0A1628] relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(16,185,129,0.05) 0%, transparent 60%)' }} />
      <div className="absolute inset-0 opacity-[0.01]" style={{ backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#10B981] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Connect your existing systems
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            A portal does not have to operate in isolation.
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A portal is more useful when it connects to the systems and services your business
            already relies on.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.15] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-[#10B981]/10 flex items-center justify-center mb-4">
                <i className={`${cat.icon} text-lg w-5 h-5 flex items-center justify-center text-[#10B981]`} />
              </div>
              <h3 className="text-base font-bold text-white mb-3">{cat.title}</h3>
              <ul className="space-y-2">
                {cat.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-400">
                    <i className="ri-link w-4 h-4 flex items-center justify-center text-[#10B981]/70 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-500 mt-10 max-w-xl mx-auto leading-relaxed">
          Integration availability depends on the systems, permissions and APIs available for each
          project.
        </p>
      </div>
    </section>
  );
}