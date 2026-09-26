'use client';

import { useState } from 'react';
import { motion } from '@/components/motion';
import { riskFindings } from './security-enrichment-data';

const levels = [
  { label: 'Low', color: '#10B981', max: 4 },
  { label: 'Moderate', color: '#CA8A04', max: 9 },
  { label: 'High', color: '#F97316', max: 14 },
  { label: 'Critical', color: '#DC2626', max: 25 },
];

function severityFor(score: number) {
  return levels.find((level) => score <= level.max) ?? levels[levels.length - 1];
}

export default function RiskMatrixSection() {
  const [active, setActive] = useState<string | null>(null);
  const impacts = [5, 4, 3, 2, 1];
  const likelihoods = [1, 2, 3, 4, 5];

  const findingsAt = (likelihood: number, impact: number) =>
    riskFindings.find((f) => f.likelihood === likelihood && f.impact === impact);

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_50%,rgba(225,29,72,0.04),transparent_55%)]" />
      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Security risk matrix
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            How findings get prioritised.
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Likelihood and business impact together decide what gets fixed first. Hover a marker on
            desktop to see the example.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl p-5 sm:p-8"
        >
          <div className="flex gap-3">
            <div className="hidden sm:flex items-center justify-center w-6">
              <span className="-rotate-90 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Business Impact
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="grid gap-1.5" style={{ gridTemplateColumns: '1.75rem repeat(5, minmax(0, 1fr))' }}>
                <div />
                {likelihoods.map((n) => (
                  <div key={`h-${n}`} className="text-center text-[11px] font-semibold text-slate-400 pb-1">{n}</div>
                ))}

                {impacts.map((impact) =>
                  [
                    <div key={`y-${impact}`} className="flex items-center justify-center text-[11px] font-semibold text-slate-400">
                      {impact}
                    </div>,
                    ...likelihoods.map((likelihood) => {
                      const score = likelihood * impact;
                      const level = severityFor(score);
                      const key = `${likelihood}-${impact}`;
                      const finding = findingsAt(likelihood, impact);
                      return (
                        <div
                          key={key}
                          onMouseEnter={() => setActive(finding ? key : null)}
                          onMouseLeave={() => setActive(null)}
                          className="relative aspect-square min-h-[38px] rounded-lg border"
                          style={{ backgroundColor: `${level.color}18`, borderColor: `${level.color}33` }}
                        >
                          {finding && (
                            <button
                              type="button"
                              aria-label={finding.name}
                              onFocus={() => setActive(key)}
                              onBlur={() => setActive(null)}
                              className="absolute inset-0 flex items-center justify-center cursor-pointer"
                            >
                              <span className="relative flex items-center justify-center">
                                <span className="absolute w-7 h-7 rounded-full animate-ping opacity-30" style={{ backgroundColor: level.color }} />
                                <span
                                  className="relative w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                                  style={{ backgroundColor: level.color }}
                                >
                                  <i className={`${finding.icon} text-white w-3.5 h-3.5 flex items-center justify-center`} />
                                </span>
                              </span>
                            </button>
                          )}
                          {finding && active === key && (
                            <div className="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30 w-48 rounded-xl bg-slate-900 text-white px-3.5 py-3 shadow-xl pointer-events-none">
                              <p className="text-xs font-bold leading-snug mb-1.5">{finding.name}</p>
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: level.color }}>
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: level.color }} />
                                {level.label}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    }),
                  ]
                )}
              </div>

              <p className="text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 mt-4">
                Likelihood / Exposure
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6 pt-6 border-t border-slate-100">
            {levels.map((level) => (
              <span key={level.label} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: level.color }} />
                {level.label}
              </span>
            ))}
          </div>

          <div className="md:hidden mt-6 pt-6 border-t border-slate-100 space-y-3">
            {riskFindings.map((finding) => {
              const level = severityFor(finding.likelihood * finding.impact);
              return (
                <div key={finding.name} className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${level.color}18` }}>
                    <i className={`${finding.icon} w-4 h-4 flex items-center justify-center`} style={{ color: level.color }} />
                  </span>
                  <p className="text-sm font-medium text-slate-600 flex-1">{finding.name}</p>
                  <span className="text-xs font-bold" style={{ color: level.color }}>{level.label}</span>
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">Illustrative prioritisation — not real customer findings.</p>
        </motion.div>
      </div>
    </section>
  );
}