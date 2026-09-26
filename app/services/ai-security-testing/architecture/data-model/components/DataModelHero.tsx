'use client';

import { motion } from '@/components/motion';
import Link from 'next/link';
import { safetyWording } from '../../architecture-data';

export default function DataModelHero() {
  return (
    <section className="pt-14 pb-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Proposed security service data model
          </p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-5">
            The data model required to run security assessments through DFP Command.
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed mb-6 max-w-3xl">
            A proposed schema design supporting organisations, engagements, authorised scope, approvals, runs, agents, findings, evidence, attack paths, remediation, retesting, reporting and Security Watch — with strong tenant isolation.
          </p>

          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#B45309] bg-amber-50 border border-amber-200 px-3 py-1 rounded-full mb-6">
            <i className="ri-draft-line w-4 h-4 flex items-center justify-center" aria-hidden="true" />
            Proposal only — not the existing live Supabase schema
          </span>

          <div className="flex flex-wrap items-center gap-2 mb-8">
            {safetyWording.map((word) => (
              <span key={word} className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full">
                {word}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/services/ai-security-testing/architecture"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 px-4 py-2.5 rounded-full transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-node-tree w-4 h-4 flex items-center justify-center text-slate-500" aria-hidden="true" />
              Back to service architecture
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}