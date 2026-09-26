'use client';

import { motion } from '@/components/motion';
import { stopEffects } from '../architecture-data';

export default function EmergencyStopSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-slate-950 border border-[#E11D48]/40 p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-7">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E11D48]/15 border border-[#E11D48]/40 flex items-center justify-center shrink-0">
                <i className="ri-stop-circle-line w-6 h-6 flex items-center justify-center text-[#F97316]" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Global control</p>
                <h2 className="text-xl md:text-2xl font-bold text-white">STOP ASSESSMENT</h2>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 self-start md:self-auto text-[11px] font-bold uppercase tracking-wider text-white bg-[#E11D48] px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              Emergency stop
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {stopEffects.map((effect) => (
              <div key={effect} className="rounded-xl bg-slate-900/80 border border-slate-800 px-4 py-3 flex items-start gap-2.5">
                <i className="ri-arrow-right-s-line w-4 h-4 flex items-center justify-center shrink-0 mt-0.5 text-[#F97316]" aria-hidden="true" />
                <span className="text-sm text-slate-200">{effect}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mt-6">
            When activated, no new jobs are assigned and agents receive the stop state. Where an external process cannot be stopped immediately, DFP Command records the stop request and the operator who raised it.
          </p>
        </motion.div>
      </div>
    </section>
  );
}