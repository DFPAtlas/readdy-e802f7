'use client';

import { motion } from '@/components/motion';
import { suggestedIndexes, foreignKeyBehaviour } from '../../data-model-data';

export default function IndexesKeysSection() {
  return (
    <section className="py-20 px-6 bg-[#F7F9FC]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-3">
            Indexes and key behaviour
          </p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            Useful indexes and conservative deletion.
          </h2>
          <p className="text-base text-slate-500 max-w-3xl mx-auto leading-relaxed">
            Suggested indexes are conceptual. Security records should not disappear because a parent was deleted.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-slate-200 bg-white p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <i className="ri-speed-up-line w-5 h-5 flex items-center justify-center text-[#E11D48]" aria-hidden="true" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Suggested indexes</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedIndexes.map((idx) => (
                <span key={idx} className="text-xs font-mono text-slate-600 bg-[#F7F9FC] border border-slate-200 px-2.5 py-1.5 rounded-lg">
                  {idx}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mt-4">
              Do not optimise prematurely — indexes are added against real query patterns.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-slate-200 bg-white p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <i className="ri-link-unlink-m w-5 h-5 flex items-center justify-center text-[#EA580C]" aria-hidden="true" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Foreign key behaviour</h3>
            </div>
            <div className="space-y-3 mb-4">
              {foreignKeyBehaviour.prefer.map((item) => (
                <div key={item.method} className="flex items-start gap-3">
                  <span className="text-[11px] font-bold text-slate-700 bg-[#F7F9FC] border border-slate-200 px-2 py-0.5 rounded shrink-0">
                    {item.method}
                  </span>
                  <span className="text-xs text-slate-500 leading-relaxed">{item.desc}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Applies to</p>
            <div className="flex flex-wrap gap-1.5">
              {foreignKeyBehaviour.restrict.map((r) => (
                <span key={r} className="text-[11px] font-mono text-slate-500 bg-[#F7F9FC] border border-slate-200 px-2 py-0.5 rounded">
                  {r}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mt-4">{foreignKeyBehaviour.note}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}