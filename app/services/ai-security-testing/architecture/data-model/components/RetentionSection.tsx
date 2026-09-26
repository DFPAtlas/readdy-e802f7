'use client';

import { motion } from '@/components/motion';
import { retentionClasses, retentionNote } from '../data-model-data';

export default function RetentionSection() {
  return (
    <section className="py-20 px-6 bg-[#F7F9FC]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-3">
            Data retention
          </p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            Five proposed retention classes.
          </h2>
          <p className="text-base text-slate-500 max-w-3xl mx-auto leading-relaxed">
            Retention is configurable so policy can change without redesigning the schema.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          {retentionClasses.map((cls, i) => (
            <motion.div
              key={cls.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <span className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F7F9FC] border border-slate-200 mb-3">
                <i className={`${cls.icon} w-4 h-4 flex items-center justify-center text-[#E11D48]`} aria-hidden="true" />
              </span>
              <h3 className="text-sm font-bold text-slate-900 mb-1">{cls.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{cls.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 flex items-start gap-3">
          <i className="ri-calendar-schedule-line w-5 h-5 flex items-center justify-center shrink-0 text-[#EA580C]" aria-hidden="true" />
          <p className="text-sm text-slate-500 leading-relaxed">{retentionNote}</p>
        </div>
      </div>
    </section>
  );
}