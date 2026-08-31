'use client';

import { motion } from '@/components/motion';

const projectTypes = [
  'New business website',
  'Existing website redesign',
  'Online marketplace',
  'Membership platform',
  'Booking platform',
  'Customer portal',
  'Staff portal',
  'Business management system',
  'SaaS product',
  'Subscription platform',
  'Internal operational dashboard',
  'Bespoke web application',
];

export default function ProjectTypesSection() {
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
          <p className="text-[#06B6D4] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Project types
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            Projects we can help deliver
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            A few of the common starting points. These are examples of the kind of work we take on.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectTypes.map((type, i) => (
            <motion.div
              key={type}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 hover:border-[#06B6D4]/40 hover:shadow-md transition-all duration-300"
            >
              <span className="w-7 h-7 rounded-lg bg-[#06B6D4]/10 flex items-center justify-center shrink-0">
                <i className="ri-check-line text-sm w-4 h-4 flex items-center justify-center text-[#06B6D4]" />
              </span>
              <span className="text-sm font-medium text-slate-700">{type}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}