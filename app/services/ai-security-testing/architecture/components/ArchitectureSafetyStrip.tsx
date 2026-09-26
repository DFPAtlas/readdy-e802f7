'use client';

import { motion } from '@/components/motion';
import { safetyWording } from '../architecture-data';

export default function ArchitectureSafetyStrip() {
  return (
    <section className="pb-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-slate-950 border border-slate-800 p-6 md:p-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F97316] mb-2">
                Design principles
              </p>
              <h2 className="text-lg md:text-xl font-bold text-white mb-3">
                Authorised by design. Human-reviewed by default.
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                This page documents how the service is intended to operate. No active scanning, agent deployment, backend integration or automated testing logic is included here.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {safetyWording.map((word) => (
                <span key={word} className="text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-full">
                  {word}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}