'use client';

import { motion } from '@/components/motion';

const industries = [
  {
    title: 'Professional Services',
    icon: 'ri-briefcase-line',
    items: ['Client documents', 'Project updates', 'Communication', 'Billing'],
  },
  {
    title: 'Property',
    icon: 'ri-building-2-line',
    items: ['Property information', 'Maintenance', 'Documents', 'Tenant or landlord communication'],
  },
  {
    title: 'Security',
    icon: 'ri-shield-line',
    items: ['Staff information', 'Jobs', 'Compliance', 'Incident records'],
  },
  {
    title: 'Construction & Contractors',
    icon: 'ri-tools-line',
    items: ['Projects', 'Jobs', 'Documents', 'Progress', 'Evidence'],
  },
  {
    title: 'Membership Organisations',
    icon: 'ri-user-star-line',
    items: ['Member accounts', 'Resources', 'Payments', 'Communication'],
  },
  {
    title: 'Internal Business Operations',
    icon: 'ri-settings-3-line',
    items: ['Staff tools', 'Approvals', 'Dashboards', 'Reporting'],
  },
];

export default function IndustriesSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_100%,rgba(16,185,129,0.05),transparent_55%)]" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#10B981] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Portals for different industries
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            The same portal approach can support very different businesses.
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            A portal is a way of organising information and workflows — it can be shaped to the way
            any industry actually operates.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry, i) => (
            <motion.div
              key={industry.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group glass-card rounded-2xl p-6"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105"
                style={{ backgroundColor: '#10B98115' }}
              >
                <i className={`${industry.icon} text-xl w-6 h-6 flex items-center justify-center text-[#10B981]`} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{industry.title}</h3>
              <p className="text-xs uppercase tracking-wider text-slate-400 mb-3">Potential uses</p>
              <ul className="space-y-2.5">
                {industry.items.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <i className="ri-check-line w-4 h-4 flex items-center justify-center shrink-0 text-[#10B981]" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-500 mt-10 max-w-xl mx-auto leading-relaxed">
          These are example use cases only.
        </p>
      </div>
    </section>
  );
}