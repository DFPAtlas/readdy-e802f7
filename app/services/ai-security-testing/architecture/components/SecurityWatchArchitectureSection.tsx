'use client';

import { motion } from '@/components/motion';
import { securityWatchFlow, securityWatchBranches } from '../architecture-data';

export default function SecurityWatchArchitectureSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-3">
            Security Watch
          </p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            Continued monitoring, inside a defined scope.
          </h2>
          <p className="text-base text-slate-500 max-w-3xl mx-auto leading-relaxed">
            After assessment, Security Watch can monitor agreed assets for change. It always remains inside a defined monitoring scope.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-[#F7F9FC] p-6 md:p-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
              {securityWatchFlow.map((step, i) => (
                <div key={step} className="flex flex-col lg:flex-row lg:items-center lg:flex-1 min-w-0 gap-3">
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 lg:flex-1 min-w-0 text-center">
                    <span className="text-xs font-semibold text-slate-700">{step}</span>
                  </div>
                  {i < securityWatchFlow.length - 1 && (
                    <div className="flex items-center justify-center shrink-0 lg:w-4">
                      <i className="ri-arrow-down-line w-4 h-4 flex items-center justify-center text-slate-300 lg:hidden" aria-hidden="true" />
                      <i className="ri-arrow-right-line w-4 h-4 hidden lg:flex items-center justify-center text-slate-300" aria-hidden="true" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-6 border-t border-slate-200">
              {securityWatchBranches.map((branch) => (
                <div key={branch.label} className="rounded-xl border border-slate-200 bg-white px-4 py-4">
                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${branch.label === 'Yes' ? 'text-[#EA580C] bg-[#F97316]/10' : 'text-slate-500 bg-slate-100'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {branch.label}
                  </span>
                  <p className="text-sm text-slate-600 mt-2">{branch.outcome}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-slate-950 border border-slate-800 p-6 md:p-8 flex flex-col"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-5">
              <i className="ri-eye-line w-5 h-5 flex items-center justify-center text-[#F97316]" aria-hidden="true" />
            </div>
            <h3 className="text-base font-bold text-white mb-3">Scope remains defined</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Security Watch only monitors assets listed in the agreed monitoring scope. Material changes are reviewed by a person before any customer alert is issued.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}