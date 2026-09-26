'use client';

import { motion } from '@/components/motion';
import { isolationRoles } from '../data-model-data';

export default function TenantIsolationSection() {
  return (
    <section className="py-20 px-6 bg-[#F7F9FC]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-3">
            Tenant isolation
          </p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            Every operational record is attributable to an organisation.
          </h2>
          <p className="text-base text-slate-500 max-w-3xl mx-auto leading-relaxed">
            A conceptual row-level access strategy. Policies themselves are not implemented in this proposal.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {isolationRoles.map((role, i) => (
            <motion.div
              key={role.role}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#F7F9FC] border border-slate-200 mb-4">
                <i className={`${role.icon} w-5 h-5 flex items-center justify-center text-[#E11D48]`} aria-hidden="true" />
              </span>
              <h3 className="text-base font-bold text-slate-900 mb-3">{role.role}</h3>
              <ul className="space-y-2">
                {role.rules.map((rule) => (
                  <li key={rule} className="flex items-start gap-2 text-sm text-slate-500 leading-relaxed">
                    <i className="ri-check-line w-4 h-4 flex items-center justify-center shrink-0 text-slate-400 mt-0.5" aria-hidden="true" />
                    {rule}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <i className="ri-separator w-5 h-5 flex items-center justify-center text-[#E11D48]" aria-hidden="true" />
            <span className="text-sm font-bold text-slate-800">Customer A data &#8800; Customer B data</span>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Cross-customer RAG context is not permitted. Retrieval and correlation are scoped to a single organisation and engagement.
          </p>
        </div>
      </div>
    </section>
  );
}