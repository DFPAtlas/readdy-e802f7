'use client';

import type { ReactNode } from 'react';
import { motion } from '@/components/motion';
import {
  engagementStateFlow,
  engagementSideStates,
  findingStateFlow,
  findingAltEnds,
  approvalStateFlow,
} from '../data-model-data';

function FlowRow({ states, accent }: { states: string[]; accent?: boolean }) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-3">
      {states.map((state, i) => (
        <div key={state} className="flex flex-col lg:flex-row lg:items-center lg:flex-1 min-w-0 gap-3">
          <div className={`rounded-xl border bg-white px-4 py-3 lg:flex-1 min-w-0 text-center ${accent ? 'border-[#E11D48]/30' : 'border-slate-200'}`}>
            <span className="text-xs font-semibold text-slate-700">{state}</span>
          </div>
          {i < states.length - 1 && (
            <span className="flex items-center justify-center shrink-0 lg:w-4" aria-hidden="true">
              <i className="ri-arrow-down-line w-4 h-4 flex items-center justify-center text-slate-300 lg:hidden" />
              <i className="ri-arrow-right-line w-4 h-4 hidden lg:flex items-center justify-center text-slate-300" />
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function DiagramCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-[#F7F9FC] p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 mb-5">{label}</p>
      {children}
    </div>
  );
}

export default function StateDiagramsSection() {
  return (
    <section className="py-20 px-6 bg-[#F7F9FC]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-3">
            State models
          </p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            Clear lifecycles for engagements, findings and approvals.
          </h2>
          <p className="text-base text-slate-500 max-w-3xl mx-auto leading-relaxed">
            Every state change is recorded so progress, validation and authorisation can be reconstructed over time.
          </p>
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <DiagramCard label="Engagement lifecycle">
              <FlowRow states={engagementStateFlow} />
              <div className="mt-5 pt-4 border-t border-slate-200 flex flex-wrap items-center gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Allowed at any stage</span>
                {engagementSideStates.map((s) => (
                  <span key={s} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-full">
                    <i className="ri-shuffle-line w-3.5 h-3.5 flex items-center justify-center text-[#EA580C]" aria-hidden="true" />
                    {s}
                  </span>
                ))}
              </div>
            </DiagramCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <DiagramCard label="Finding lifecycle">
              <FlowRow states={findingStateFlow} accent />
              <div className="mt-5 pt-4 border-t border-slate-200 flex flex-wrap items-center gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Alternative ends</span>
                {findingAltEnds.map((s) => (
                  <span key={s} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-full">
                    <i className="ri-arrow-right-s-line w-3.5 h-3.5 flex items-center justify-center text-[#EA580C]" aria-hidden="true" />
                    {s}
                  </span>
                ))}
              </div>
            </DiagramCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <DiagramCard label="Approval lifecycle">
              <FlowRow states={approvalStateFlow.main} />
              <div className="mt-5 pt-4 border-t border-slate-200 space-y-2">
                {approvalStateFlow.alternatives.map((alt) => (
                  <span key={alt} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <i className="ri-git-branch-line w-4 h-4 flex items-center justify-center text-[#EA580C]" aria-hidden="true" />
                    {alt}
                  </span>
                ))}
              </div>
            </DiagramCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}