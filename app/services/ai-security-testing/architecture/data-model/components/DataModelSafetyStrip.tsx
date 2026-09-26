'use client';

import { motion } from '@/components/motion';
import Link from 'next/link';

const items = [
  { label: 'Proposal only', desc: 'No live schema changed' },
  { label: 'Isolated', desc: 'Organisation & engagement scoped' },
  { label: 'Scoped', desc: 'Explicit asset permissions' },
  { label: 'Human-approved', desc: 'Approval gates recorded' },
  { label: 'Evidence-led', desc: 'Traceable to source' },
];

export default function DataModelSafetyStrip() {
  return (
    <section className="py-16 px-6 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-8"
        >
          {items.map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-200 bg-[#F7F9FC] p-4">
              <p className="text-sm font-bold text-slate-800 mb-1">{item.label}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </motion.div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/services/ai-security-testing/architecture"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 px-4 py-2.5 rounded-full transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-node-tree w-4 h-4 flex items-center justify-center text-slate-500" aria-hidden="true" />
            Service architecture
          </Link>
          <Link
            href="/services/ai-security-testing"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#E11D48] hover:bg-[#BE123C] px-4 py-2.5 rounded-full transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-shield-keyhole-line w-4 h-4 flex items-center justify-center" aria-hidden="true" />
            AI Security Testing
          </Link>
        </div>
      </div>
    </section>
  );
}