'use client';

import { motion } from '@/components/motion';
import { scopeTokenFields } from '../architecture-data';

export default function ScopeTokenSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-3">
            Scope control
          </p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            The Assessment Scope Token.
          </h2>
          <p className="text-base text-slate-500 max-w-3xl mx-auto leading-relaxed">
            Each approved job is passed to an agent as a scope token. Agents must only work within this scope. This is a design concept, not an authentication implementation yet.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 rounded-2xl border border-slate-200/80 bg-[#F7F9FC] p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Scope token contents</p>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                Illustrative
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {scopeTokenFields.map((field) => (
                <div key={field.label} className="rounded-xl bg-white border border-slate-200 px-4 py-3 flex items-center gap-2.5">
                  <i className={`${field.icon} w-4 h-4 flex items-center justify-center text-[#E11D48]`} aria-hidden="true" />
                  <span className="text-sm text-slate-600">{field.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 rounded-2xl bg-slate-950 border border-slate-800 p-6 flex flex-col"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-5">Scope validation</p>

            <div className="rounded-xl bg-slate-900/80 border border-slate-800 px-4 py-3 text-sm text-slate-200 flex items-center gap-2.5">
              <i className="ri-focus-3-line w-4 h-4 flex items-center justify-center text-[#F97316]" aria-hidden="true" />
              Requested target
            </div>

            <div className="flex justify-center py-2">
              <i className="ri-arrow-down-line w-5 h-5 flex items-center justify-center text-slate-600" aria-hidden="true" />
            </div>

            <div className="rounded-xl bg-slate-900/80 border border-slate-800 px-4 py-3 text-sm text-slate-200 flex items-center gap-2.5">
              <i className="ri-shield-keyhole-line w-4 h-4 flex items-center justify-center text-[#F97316]" aria-hidden="true" />
              Scope validation
            </div>

            <div className="flex justify-center py-2">
              <i className="ri-arrow-down-line w-5 h-5 flex items-center justify-center text-slate-600" aria-hidden="true" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 flex items-center justify-center gap-2">
                <i className="ri-checkbox-circle-line w-4 h-4 flex items-center justify-center text-emerald-400" aria-hidden="true" />
                <span className="text-sm font-bold text-emerald-300">ALLOWED</span>
              </div>
              <div className="rounded-xl bg-[#E11D48]/10 border border-[#E11D48]/30 px-4 py-3 flex items-center justify-center gap-2">
                <i className="ri-close-circle-line w-4 h-4 flex items-center justify-center text-[#F97316]" aria-hidden="true" />
                <span className="text-sm font-bold text-[#F97316]">BLOCKED</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mt-5">
              Targets outside permitted assets are blocked before any agent runs.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}