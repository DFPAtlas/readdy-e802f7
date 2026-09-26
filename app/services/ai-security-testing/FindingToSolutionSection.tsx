'use client';

import { motion } from '@/components/motion';

const actions = [
  'Enforce MFA',
  'Review administrator membership',
  'Remove unnecessary privileges',
  'Review dormant accounts',
  'Introduce privileged-access controls',
  'Retest authentication controls',
];

export default function FindingToSolutionSection() {
  return (
    <section className="py-24 px-6 bg-[#F7F9FC] relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            From finding to solution
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            A finding is only useful if it gets fixed.
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            The same team that identifies the weakness can close it — then prove it is closed.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-slate-200 bg-white p-7"
          >
            <div className="flex items-center justify-between mb-5">
              <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-slate-400">Finding</p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DC2626]/10 text-[#DC2626] text-xs font-bold">
                <i className="ri-alarm-warning-line w-3.5 h-3.5 flex items-center justify-center" />
                HIGH
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-6">Administrator account without MFA</h3>

            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 mb-1.5">Evidence</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Privileged account identified without an enforced second authentication factor.
                </p>
              </div>
              <div className="pt-5 border-t border-slate-100">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 mb-1.5">Potential impact</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Compromise of the account could provide elevated access to business systems.
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-6">Illustrative example</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-[#E11D48]/20 bg-gradient-to-b from-[#E11D48]/[0.05] to-transparent p-7"
          >
            <div className="flex items-center justify-between mb-5">
              <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#E11D48]">DFP Solution</p>
              <div className="w-9 h-9 rounded-xl bg-[#E11D48]/10 flex items-center justify-center">
                <i className="ri-shield-keyhole-line w-4 h-4 flex items-center justify-center text-[#E11D48]" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-6">Identity Hardening</h3>

            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 mb-3">Actions</p>
            <ul className="space-y-2.5">
              {actions.map((action) => (
                <li key={action} className="flex items-start gap-3 text-sm text-slate-600">
                  <i className="ri-checkbox-circle-line w-4 h-4 flex items-center justify-center text-[#E11D48] shrink-0 mt-0.5" />
                  {action}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {['Finding', 'Fix', 'Verification'].map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <span className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700">
                {step}
              </span>
              {i < 2 && <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center text-slate-300" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}