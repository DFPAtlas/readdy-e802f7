'use client';

import { motion } from '@/components/motion';

const features = [
  {
    title: 'Accounts & Access',
    icon: 'ri-key-2-line',
    color: '#10B981',
    items: ['Secure sign-in', 'User profiles', 'Role-based permissions', 'Account management', 'Access controls', 'Password recovery'],
  },
  {
    title: 'Documents',
    icon: 'ri-folder-5-line',
    color: '#06B6D4',
    items: ['Uploads', 'Downloads', 'Document libraries', 'Categories', 'Version information', 'Controlled access'],
  },
  {
    title: 'Communication',
    icon: 'ri-message-3-line',
    color: '#F97316',
    items: ['Messages', 'Notifications', 'Email alerts', 'Updates', 'Support requests', 'Announcements'],
  },
  {
    title: 'Workflow',
    icon: 'ri-flow-chart',
    color: '#7C3AED',
    items: ['Tasks', 'Status changes', 'Approvals', 'Forms', 'Assignments', 'Escalations'],
  },
  {
    title: 'Commercial',
    icon: 'ri-bank-card-line',
    color: '#A855F7',
    items: ['Quotes', 'Orders', 'Invoices', 'Payments', 'Subscription information', 'Account history'],
  },
  {
    title: 'Reporting',
    icon: 'ri-bar-chart-grouped-line',
    color: '#EC4899',
    items: ['Dashboards', 'Filters', 'Reports', 'Activity history', 'Operational views', 'Export options'],
  },
];

export default function CoreFeaturesSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_30%,rgba(6,182,212,0.05),transparent_55%)]" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#10B981] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Core portal features
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            The features your portal needs depend on the job it has to do.
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            These are the building blocks a portal can bring together — not every portal needs
            every feature.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group glass-card rounded-2xl p-6"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105"
                style={{ backgroundColor: `${feature.color}15` }}
              >
                <i className={`${feature.icon} text-xl w-6 h-6 flex items-center justify-center`} style={{ color: feature.color }} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{feature.title}</h3>
              <ul className="space-y-2.5">
                {feature.items.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <i className="ri-check-line w-4 h-4 flex items-center justify-center shrink-0" style={{ color: feature.color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-500 mt-10 max-w-xl mx-auto leading-relaxed">
          These are possible features, not a promise that every portal includes everything.
        </p>
      </div>
    </section>
  );
}