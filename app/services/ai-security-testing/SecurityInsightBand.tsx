'use client';

import { motion } from '@/components/motion';
import type { SecurityInsight } from './security-enrichment-data';

export default function SecurityInsightBand({ insight }: { insight: SecurityInsight }) {
  return (
    <section className="py-10 px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto rounded-2xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-7 p-6 md:p-7">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${insight.color}12` }}
          >
            <i className={`${insight.icon} text-2xl w-7 h-7 flex items-center justify-center`} style={{ color: insight.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-slate-400 mb-2">
              Security Insight
            </p>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-2">
              {insight.title}
            </h3>
            <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-4xl">{insight.body}</p>
          </div>
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap shrink-0 border"
            style={{ color: insight.color, backgroundColor: `${insight.color}0A`, borderColor: `${insight.color}26` }}
          >
            <i className="ri-price-tag-3-line w-4 h-4 flex items-center justify-center" />
            {insight.tag}
          </span>
        </div>
      </motion.div>
    </section>
  );
}