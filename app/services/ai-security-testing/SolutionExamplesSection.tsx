'use client';

import { motion } from '@/components/motion';
import { solutionExamples } from './security-enrichment-data';

export default function SolutionExamplesSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,rgba(124,58,237,0.04),transparent_55%)]" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Solution patterns
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            Every finding comes with a way forward.
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            These are typical examples of how a problem becomes a concrete, prioritised fix.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {solutionExamples.map((item, i) => (
            <motion.div
              key={item.solution}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card rounded-2xl p-6 flex flex-col"
            >
              <div className="flex items-start gap-3 mb-5">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${item.color}12` }}
                >
                  <i className={`${item.icon} text-lg w-5 h-5 flex items-center justify-center`} style={{ color: item.color }} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-slate-400 mb-1">Problem</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.problem}</p>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100 mt-auto">
                <p className="text-[11px] uppercase tracking-[0.16em] font-semibold mb-3" style={{ color: item.color }}>
                  DFP Solution
                </p>
                <h3 className="text-lg font-bold text-slate-900 mb-4">{item.solution}</h3>
                <ul className="space-y-2">
                  {item.items.map((action) => (
                    <li key={action} className="flex items-start gap-2.5 text-sm text-slate-500">
                      <i className="ri-check-line w-4 h-4 flex items-center justify-center shrink-0 mt-0.5" style={{ color: item.color }} />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-xs text-slate-400 mt-8">Illustrative examples — no exploit detail is shared.</p>
      </div>
    </section>
  );
}