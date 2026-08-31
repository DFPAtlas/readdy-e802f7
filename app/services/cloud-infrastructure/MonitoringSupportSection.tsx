'use client';

import { motion } from '@/components/motion';

const categories = [
  {
    title: 'Infrastructure Health',
    icon: 'ri-heart-pulse-line',
    color: '#3B82F6',
    items: ['Server health', 'Storage', 'Resource use', 'Connectivity'],
  },
  {
    title: 'Network Health',
    icon: 'ri-radar-line',
    color: '#06B6D4',
    items: ['Switches', 'Connectivity', 'Access points', 'Network availability'],
  },
  {
    title: 'Service Health',
    icon: 'ri-global-line',
    color: '#10B981',
    items: ['Websites', 'Applications', 'Business services'],
  },
  {
    title: 'Backup Status',
    icon: 'ri-archive-line',
    color: '#F97316',
    items: ['Backup completion', 'Failures', 'Storage issues'],
  },
  {
    title: 'Security Signals',
    icon: 'ri-alarm-warning-line',
    color: '#7C3AED',
    items: ['Relevant alerts', 'Access events', 'Infrastructure warnings'],
  },
  {
    title: 'Support Requests',
    icon: 'ri-customer-service-2-line',
    color: '#EC4899',
    items: ['User issues', 'Faults', 'Troubleshooting', 'Escalation'],
  },
];

export default function MonitoringSupportSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_100%,rgba(59,130,246,0.05),transparent_55%)]" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#3B82F6] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Monitoring &amp; support
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            Know when something needs attention.
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Monitoring and support help keep systems healthy and get issues noticed and resolved.
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
              className="group glass-card rounded-2xl p-6"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105"
                style={{ backgroundColor: `${cat.color}15` }}
              >
                <i className={`${cat.icon} text-lg w-5 h-5 flex items-center justify-center`} style={{ color: cat.color }} />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-3">{cat.title}</h3>
              <ul className="space-y-2">
                {cat.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                    <i className="ri-check-line w-4 h-4 flex items-center justify-center shrink-0" style={{ color: cat.color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-500 mt-10 max-w-xl mx-auto leading-relaxed">
          Monitoring options depend on the infrastructure and support agreement in place.
        </p>
      </div>
    </section>
  );
}