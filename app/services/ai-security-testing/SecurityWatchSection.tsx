'use client';

import { motion } from '@/components/motion';
import Link from 'next/link';
import { monitoringExamples } from './security-enrichment-data';

export default function SecurityWatchSection() {
  return (
    <section className="py-24 px-6 bg-[#0A1628] relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(8,145,178,0.08) 0%, transparent 60%)' }} />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0891B2]/12 border border-[#0891B2]/25 mb-5">
              <i className="ri-radar-line w-4 h-4 flex items-center justify-center text-[#22D3EE]" />
              <span className="text-xs font-semibold text-[#22D3EE] uppercase tracking-[0.12em]">DFP Security Watch</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
              Security changes after the assessment.
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed mb-5">
              New systems appear, configurations change and new vulnerabilities are disclosed. DFP
              Security Watch is designed to provide continuing visibility after the initial assessment.
            </p>
            <p className="text-sm text-slate-500 leading-relaxed mb-8">
              Designed for continuous monitoring. Available as an ongoing service — we will confirm
              current availability when we scope your engagement.
            </p>
            <Link
              href="/contact?need=security&need_label=Security%20Watch"
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-white border border-[#22D3EE]/40 bg-[#0891B2]/15 hover:bg-[#0891B2]/25 hover:border-[#22D3EE]/70 hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:ring-offset-2 focus:ring-offset-[#0A1628]"
            >
              Ask About Security Watch
              <i className="ri-arrow-right-line w-5 h-5 flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-8"
          >
            <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-slate-500 mb-5">
              Monitoring examples
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {monitoringExamples.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 hover:border-[#22D3EE]/30 transition-colors duration-300"
                >
                  <i className={`${item.icon} w-4 h-4 flex items-center justify-center text-[#22D3EE] shrink-0`} />
                  <span className="text-sm text-slate-300 leading-snug">{item.label}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-5">Illustrative examples of change signals.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}