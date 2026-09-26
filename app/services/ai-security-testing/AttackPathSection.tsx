'use client';

import { motion } from '@/components/motion';
import { attackPathNodes } from './security-enrichment-data';

export default function AttackPathSection() {
  return (
    <section className="py-24 px-6 bg-[#0A1628] relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(220,38,38,0.08) 0%, transparent 60%)' }} />
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-[#F97316] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Risk correlation
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Individual weaknesses become attack paths.
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Any one of these might look manageable alone. Connected together, they form a direct route
            to your most valuable data.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-10"
        >
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            {attackPathNodes.map((node, i) => (
              <div key={node.label} className="flex flex-col lg:flex-row items-center gap-3 flex-1 min-w-0">
                <div
                  className="w-full rounded-2xl border px-5 py-4 text-center"
                  style={{ borderColor: `${node.color}55`, backgroundColor: `${node.color}14` }}
                >
                  <span className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: node.color }}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: node.color }} />
                    {node.label}
                  </span>
                </div>
                {i < attackPathNodes.length - 1 && (
                  <i className="ri-arrow-right-line lg:w-5 lg:h-5 w-5 h-5 rotate-90 lg:rotate-0 flex items-center justify-center text-slate-500 shrink-0" />
                )}
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-slate-500 mt-8">Illustrative scenario</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 text-center">
              <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-slate-500 mb-2">Without correlation</p>
              <p className="text-2xl md:text-3xl font-bold text-slate-300">5 separate findings</p>
            </div>
            <div className="rounded-2xl border border-[#DC2626]/40 bg-[#DC2626]/10 p-6 text-center">
              <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#FCA5A5] mb-2">With DFP correlation</p>
              <p className="text-2xl md:text-3xl font-bold text-white">1 critical business risk</p>
            </div>
          </div>

          <div className="mt-10 flex items-start gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
            <div className="w-11 h-11 rounded-xl bg-[#E11D48]/15 flex items-center justify-center shrink-0">
              <i className="ri-node-tree w-5 h-5 flex items-center justify-center text-[#E11D48]" />
            </div>
            <p className="text-sm md:text-base text-slate-400 leading-relaxed">
              The Risk Correlation Agent examines how validated findings may connect so remediation can
              focus on the weaknesses that matter most.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}