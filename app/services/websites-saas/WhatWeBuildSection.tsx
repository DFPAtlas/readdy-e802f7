'use client';

import { motion } from '@/components/motion';

const capabilities = [
  {
    title: 'Business Websites',
    icon: 'ri-global-line',
    color: '#06B6D4',
    items: ['Company websites', 'Service websites', 'Lead generation', 'Responsive design', 'SEO-ready structure', 'Analytics integration'],
  },
  {
    title: 'E-Commerce',
    icon: 'ri-shopping-bag-3-line',
    color: '#F97316',
    items: ['Online stores', 'Product management', 'Secure checkout', 'Payments', 'Customer accounts', 'Order workflows'],
  },
  {
    title: 'Web Applications',
    icon: 'ri-window-line',
    color: '#7C3AED',
    items: ['Custom business applications', 'Dashboards', 'Booking systems', 'Job management', 'Internal tools', 'Workflow systems'],
  },
  {
    title: 'SaaS Platforms',
    icon: 'ri-cloud-line',
    color: '#10B981',
    items: ['Multi-user platforms', 'Subscription systems', 'Customer accounts', 'Admin systems', 'Billing integration', 'Role-based access'],
  },
  {
    title: 'Customer & Staff Portals',
    icon: 'ri-dashboard-line',
    color: '#A855F7',
    items: ['Client dashboards', 'Staff areas', 'Documents', 'Messaging', 'Project tracking', 'Account management'],
  },
  {
    title: 'Existing Platform Development',
    icon: 'ri-settings-3-line',
    color: '#EC4899',
    items: ['New features', 'Modernisation', 'Performance improvements', 'Integrations', 'UX improvements', 'Ongoing development'],
  },
];

export default function WhatWeBuildSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,rgba(168,85,247,0.05),transparent_55%)]" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#06B6D4] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            What we build
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            More than website development.
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Digital Footprint builds both public-facing websites and the operational software that
            runs behind them, from simple company sites to complete SaaS platforms.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group glass-card rounded-2xl p-6"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105"
                style={{ backgroundColor: `${cap.color}15` }}
              >
                <i className={`${cap.icon} text-xl w-6 h-6 flex items-center justify-center`} style={{ color: cap.color }} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{cap.title}</h3>
              <ul className="space-y-2.5">
                {cap.items.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <i className="ri-check-line w-4 h-4 flex items-center justify-center shrink-0" style={{ color: cap.color }} />
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