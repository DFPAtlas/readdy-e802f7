'use client';

import { motion } from '@/components/motion';
import { sensitiveDataRules } from '../../data-model-data';

export default function SensitiveDataSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-3">
            Sensitive information
          </p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            Minimal storage of secrets.
          </h2>
          <p className="text-base text-slate-500 max-w-3xl mx-auto leading-relaxed">
            Evidence should support remediation without becoming a liability. These rules apply across the whole model.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-red-200 bg-red-50/50 p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <i className="ri-forbid-2-line w-5 h-5 flex items-center justify-center text-[#E11D48]" aria-hidden="true" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#B91C1C]">Never store</h3>
            </div>
            <ul className="space-y-2">
              {sensitiveDataRules.never.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                  <i className="ri-close-line w-4 h-4 flex items-center justify-center shrink-0 text-[#E11D48] mt-0.5" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-slate-200 bg-white p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <i className="ri-shield-check-line w-5 h-5 flex items-center justify-center text-[#EA580C]" aria-hidden="true" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">If credentials are required</h3>
            </div>
            <ul className="space-y-2">
              {sensitiveDataRules.recommendations.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                  <i className="ri-check-line w-4 h-4 flex items-center justify-center shrink-0 text-[#EA580C] mt-0.5" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-[#F7F9FC] p-6 flex items-start gap-3">
          <i className="ri-lock-2-line w-5 h-5 flex items-center justify-center shrink-0 text-slate-400" aria-hidden="true" />
          <p className="text-sm text-slate-500 leading-relaxed">{sensitiveDataRules.note}</p>
        </div>
      </div>
    </section>
  );
}