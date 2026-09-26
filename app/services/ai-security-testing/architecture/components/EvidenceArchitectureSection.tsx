'use client';

import { motion } from '@/components/motion';
import { evidenceFields } from '../architecture-data';

export default function EvidenceArchitectureSection() {
  return (
    <section className="py-20 px-6 bg-[#F7F9FC]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-3">
            Evidence architecture
          </p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            Every finding preserves a complete evidence record.
          </h2>
          <p className="text-base text-slate-500 max-w-3xl mx-auto leading-relaxed">
            Evidence supports remediation and retest. Sensitive values are masked where possible and secrets are not stored unnecessarily.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Evidence record fields</p>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              Illustrative schema
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {evidenceFields.map((field) => (
              <span key={field} className="inline-flex items-center gap-2 text-sm text-slate-600 bg-[#F7F9FC] border border-slate-200 px-3 py-2 rounded-xl">
                <i className="ri-record-circle-line w-4 h-4 flex items-center justify-center text-[#E11D48]" aria-hidden="true" />
                {field}
              </span>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-start gap-3">
            <i className="ri-eye-off-line w-5 h-5 flex items-center justify-center shrink-0 text-[#EA580C]" aria-hidden="true" />
            <p className="text-sm text-slate-500 leading-relaxed">
              Evidence captures enough context to reproduce a validated finding without storing passwords, tokens or unnecessary secrets.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}