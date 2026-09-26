'use client';

import { motion } from '@/components/motion';
import { commandResponsibilities, orchestratorResponsibilities, orchestratorNote } from '../architecture-data';

export default function CoreArchitectureSection() {
  return (
    <section className="py-20 px-6 bg-[#F7F9FC]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-3">
            Core architecture
          </p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            A control plane and an orchestrator, kept separate.
          </h2>
          <p className="text-base text-slate-500 max-w-3xl mx-auto leading-relaxed">
            DFP Command is the source of truth for engagement state. Orchestration coordinates approved work but holds no authority over scope.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 rounded-2xl bg-slate-950 border border-slate-800 p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                <i className="ri-command-line w-5 h-5 flex items-center justify-center text-[#F97316]" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">DFP Command</h3>
                <p className="text-xs text-slate-400">Central control plane</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {commandResponsibilities.map((item) => (
                <div key={item} className="rounded-xl bg-slate-900/80 border border-slate-800 px-4 py-3 text-sm text-slate-200 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-400 mt-5 leading-relaxed">
              DFP Command should be the source of truth for engagement state, authorisation and approvals.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-slate-200/80 bg-white p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-[#E11D48]/10 flex items-center justify-center">
                <i className="ri-flow-chart w-5 h-5 flex items-center justify-center text-[#E11D48]" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">n8n Security Orchestrator</h3>
                <p className="text-xs text-slate-400">Orchestration layer</p>
              </div>
            </div>

            <ul className="space-y-2.5">
              {orchestratorResponsibilities.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <i className="ri-checkbox-circle-line w-4 h-4 flex items-center justify-center shrink-0 mt-0.5 text-[#E11D48]" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="mt-6 rounded-2xl border border-[#F97316]/30 bg-[#F97316]/5 px-5 py-4 flex items-start gap-3">
          <i className="ri-information-line w-5 h-5 flex items-center justify-center shrink-0 text-[#EA580C]" aria-hidden="true" />
          <p className="text-sm text-slate-600 leading-relaxed">{orchestratorNote}</p>
        </div>
      </div>
    </section>
  );
}