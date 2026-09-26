'use client';

import { motion } from '@/components/motion';
import Link from 'next/link';
import { safetyWording } from '../architecture-data';

export default function ArchitectureHero() {
  return (
    <section className="pt-14 pb-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Service architecture
          </p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-5">
            How the assessment service is designed to operate.
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed mb-6 max-w-3xl">
            A controlled, authorised and observable pipeline that moves a customer from enquiry to retest and ongoing monitoring — with human approval at every consequential step.
          </p>

          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500 bg-[#F7F9FC] border border-slate-200 px-3 py-1 rounded-full mb-6">
            <i className="ri-information-line w-4 h-4 flex items-center justify-center text-slate-400" aria-hidden="true" />
            Architecture &amp; design documentation — not active testing
          </span>

          <div className="flex flex-wrap gap-2">
            {safetyWording.map((word) => (
              <span key={word} className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full">
                {word}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/services/ai-security-testing/architecture/data-model"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 px-4 py-2.5 rounded-full transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-database-2-line w-4 h-4 flex items-center justify-center text-[#E11D48]" aria-hidden="true" />
              Proposed data model &amp; schema
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}