'use client';

import { motion } from '@/components/motion';

const categories = [
  { title: 'CRM', icon: 'ri-contacts-line', items: ['HubSpot', 'Salesforce', 'Zoho', 'Custom CRM systems'] },
  { title: 'Communications', icon: 'ri-chat-3-line', items: ['Email', 'SMS', 'Notifications', 'Voice platforms', 'Contact forms'] },
  { title: 'Payments', icon: 'ri-bank-card-line', items: ['Stripe', 'Payment events', 'Invoice workflows'] },
  { title: 'Websites & Portals', icon: 'ri-global-line', items: ['Website forms', 'Customer accounts', 'Staff portals', 'Admin dashboards'] },
  { title: 'Business APIs', icon: 'ri-plug-line', items: ['Third-party APIs', 'Webhooks', 'Internal APIs', 'Data services'] },
  { title: 'AI & Knowledge', icon: 'ri-brain-line', items: ['Approved business documents', 'Knowledge bases', 'AI models', 'Search systems'] },
];

export default function SystemConnectionsSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_100%,rgba(16,185,129,0.05),transparent_55%)]" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#7C3AED] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Business system connections
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            Connect the systems you already use
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Automation becomes more useful when business systems can exchange information with each
            other.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group glass-card rounded-2xl p-6"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105"
                style={{ backgroundColor: '#7C3AED15' }}
              >
                <i className={`${cat.icon} text-xl w-6 h-6 flex items-center justify-center text-[#7C3AED]`} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{cat.title}</h3>
              <ul className="space-y-2.5">
                {cat.items.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <i className="ri-link w-4 h-4 flex items-center justify-center shrink-0 text-[#7C3AED]" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-500 mt-10 max-w-xl mx-auto leading-relaxed">
          Integration options depend on the APIs and access provided by each platform.
        </p>
      </div>
    </section>
  );
}