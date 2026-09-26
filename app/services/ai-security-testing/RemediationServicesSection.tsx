'use client';

import { motion } from '@/components/motion';
import { remediationServices } from './security-enrichment-data';

export default function RemediationServicesSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Remediation services
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            We can help fix what we find.
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            You can take our findings to your own team, or let ours carry out the work and verify the
            result.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {remediationServices.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="glass-card rounded-2xl p-6 flex flex-col"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: `${service.color}12` }}
              >
                <i className={`${service.icon} text-xl w-6 h-6 flex items-center justify-center`} style={{ color: service.color }} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">{service.title}</h3>
              <ul className="space-y-2 mt-auto">
                {service.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-slate-500">
                    <i className="ri-check-line w-4 h-4 flex items-center justify-center shrink-0 mt-0.5" style={{ color: service.color }} />
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