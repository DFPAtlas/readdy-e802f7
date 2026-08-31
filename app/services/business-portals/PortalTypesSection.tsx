'use client';

import { motion } from '@/components/motion';

const portals = [
  {
    title: 'Customer Portals',
    icon: 'ri-user-heart-line',
    color: '#10B981',
    items: ['Account information', 'Documents', 'Messages', 'Project updates', 'Payments', 'Support requests'],
  },
  {
    title: 'Staff Portals',
    icon: 'ri-team-line',
    color: '#06B6D4',
    items: ['Internal information', 'Tasks', 'Forms', 'Documents', 'Notices', 'Operational tools'],
  },
  {
    title: 'Contractor Portals',
    icon: 'ri-tools-line',
    color: '#F97316',
    items: ['Job information', 'Availability', 'Documents', 'Compliance information', 'Updates', 'Communication'],
  },
  {
    title: 'Supplier Portals',
    icon: 'ri-truck-line',
    color: '#7C3AED',
    items: ['Orders', 'Documents', 'Status updates', 'Requests', 'Communication', 'Account information'],
  },
  {
    title: 'Management Dashboards',
    icon: 'ri-bar-chart-2-line',
    color: '#A855F7',
    items: ['KPIs', 'Operational status', 'Reports', 'Alerts', 'Team activity', 'Exceptions'],
  },
  {
    title: 'Admin Portals',
    icon: 'ri-settings-3-line',
    color: '#EC4899',
    items: ['User management', 'Permissions', 'Content management', 'Workflow controls', 'Reporting', 'System settings'],
  },
];

export default function PortalTypesSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,rgba(16,185,129,0.06),transparent_55%)]" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#10B981] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Types of portals
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            Portals built around the people using them
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            A portal can be tailored to whichever group of people needs a clearer, more structured
            way to work with your business.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portals.map((portal, i) => (
            <motion.div
              key={portal.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group glass-card rounded-2xl p-6"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105"
                style={{ backgroundColor: `${portal.color}15` }}
              >
                <i className={`${portal.icon} text-xl w-6 h-6 flex items-center justify-center`} style={{ color: portal.color }} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{portal.title}</h3>
              <ul className="space-y-2.5">
                {portal.items.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <i className="ri-check-line w-4 h-4 flex items-center justify-center shrink-0" style={{ color: portal.color }} />
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