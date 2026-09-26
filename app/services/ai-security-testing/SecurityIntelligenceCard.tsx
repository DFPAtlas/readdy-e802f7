'use client';

import { motion } from '@/components/motion';
import Link from 'next/link';
import type { SecurityIntelligenceItem } from './security-enrichment-data';

export default function SecurityIntelligenceCard({ item }: { item: SecurityIntelligenceItem }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card rounded-2xl p-6 flex flex-col"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-5">
        <span
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-[0.12em] border whitespace-nowrap"
          style={{ color: item.accent, backgroundColor: `${item.accent}0A`, borderColor: `${item.accent}26` }}
        >
          <i className={`${item.icon} w-3.5 h-3.5 flex items-center justify-center`} />
          {item.label}
        </span>
        <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">{item.edition}</span>
      </div>

      <h3 className="text-lg font-bold text-slate-900 leading-snug mb-3">{item.title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed mb-5">{item.summary}</p>

      {item.type === 'intelligence' && item.whyItMatters && (
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-1.5">Why it matters</p>
          <p className="text-sm text-slate-600 leading-relaxed">{item.whyItMatters}</p>
        </div>
      )}

      {item.type === 'lab' && item.flow && (
        <div className="mb-5">
          <div className="flex flex-wrap items-center gap-2">
            {item.flow.map((step, i) => (
              <span key={step} className="flex items-center gap-2">
                <span
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border whitespace-nowrap"
                  style={{ color: '#9A3412', backgroundColor: '#F9731614', borderColor: '#F9731633' }}
                >
                  {step}
                </span>
                {i < item.flow!.length - 1 && (
                  <i className="ri-arrow-right-line w-3.5 h-3.5 flex items-center justify-center text-slate-300" />
                )}
              </span>
            ))}
          </div>
          {item.outcome && (
            <p className="text-sm text-slate-600 leading-relaxed mt-4">{item.outcome}</p>
          )}
          {item.illustrative && (
            <span className="inline-flex items-center gap-1.5 mt-4 px-3 py-1.5 rounded-lg bg-slate-900/[0.04] border border-slate-200 text-[11px] font-semibold text-slate-500">
              <i className="ri-information-line w-3.5 h-3.5 flex items-center justify-center" />
              Illustrative lab scenario
            </span>
          )}
        </div>
      )}

      {item.type === 'fix' && (
        <div className="mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-2">Problem</p>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">{item.problem}</p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-2.5">Recommended controls</p>
          <ul className="space-y-2">
            {item.controls?.map((control) => (
              <li key={control} className="flex items-start gap-2.5 text-sm text-slate-500">
                <i className="ri-check-line w-4 h-4 flex items-center justify-center shrink-0 mt-0.5" style={{ color: item.accent }} />
                {control}
              </li>
            ))}
          </ul>
        </div>
      )}

      {item.type === 'ai' && (
        <div className="mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-2.5">Check</p>
          <ul className="space-y-2">
            {item.checks?.map((check) => (
              <li key={check} className="flex items-start gap-2.5 text-sm text-slate-500">
                <i className="ri-question-line w-4 h-4 flex items-center justify-center shrink-0 mt-0.5" style={{ color: item.accent }} />
                {check}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-auto pt-5 border-t border-slate-100">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-1.5" style={{ color: item.accent }}>
          {item.solutionLabel}
        </p>
        <p className="text-sm font-semibold text-slate-700 leading-relaxed mb-4">{item.solution}</p>

        <div className="flex flex-wrap gap-2 mb-5">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-[11px] font-medium text-slate-500"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link
          href={item.ctaRoute}
          className="group inline-flex items-center gap-2 text-sm font-semibold whitespace-nowrap cursor-pointer transition-colors duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-[#E11D48] focus:ring-offset-2 rounded-md"
          style={{ color: item.accent }}
        >
          {item.ctaLabel}
          <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-200" />
        </Link>
      </div>
    </motion.article>
  );
}