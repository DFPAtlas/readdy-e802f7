'use client';

import { motion } from '@/components/motion';
import { findingVersioning } from '../../data-model-data';

export default function FindingVersioningSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-3">
            Finding versioning
          </p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            Historical state is retained when a finding changes.
          </h2>
          <p className="text-base text-slate-500 max-w-3xl mx-auto leading-relaxed">
            A finding keeps one clean current state, while an append-only history records every consequential change.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-6"
        >
          {findingVersioning.concept.map((c, i) => (
            <div key={c.table} className="rounded-2xl border border-slate-200 bg-[#F7F9FC] p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-900 font-mono">{c.table}</span>
                <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-[#E11D48]">
                  {i === 0 ? '·' : '*'}
                </span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">{c.role}</p>
            </div>
          ))}
        </motion.div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 max-w-4xl mx-auto">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-3">Changes recorded in history</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {findingVersioning.changes.map((change) => (
              <span key={change} className="text-xs font-semibold text-slate-600 bg-[#F7F9FC] border border-slate-200 px-3 py-1.5 rounded-full">
                {change}
              </span>
            ))}
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">{findingVersioning.note}</p>
        </div>
      </div>
    </section>
  );
}