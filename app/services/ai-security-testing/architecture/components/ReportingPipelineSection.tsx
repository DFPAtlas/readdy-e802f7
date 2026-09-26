'use client';

import { motion } from '@/components/motion';
import { reportingPipeline, reportOutputs } from '../architecture-data';

export default function ReportingPipelineSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-3">
            Reporting pipeline
          </p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            From validated findings to a reviewed client report.
          </h2>
          <p className="text-base text-slate-500 max-w-3xl mx-auto leading-relaxed">
            Reporting is evidence-led and passes through human review before it reaches the customer.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-slate-200/80 bg-[#F7F9FC] p-6 md:p-8 mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            {reportingPipeline.map((step, i) => (
              <div key={step} className="flex flex-col lg:flex-row lg:items-center lg:flex-1 min-w-0 gap-3">
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 lg:flex-1 min-w-0 text-center">
                  <span className="text-xs font-semibold text-slate-700">{step}</span>
                </div>
                {i < reportingPipeline.length - 1 && (
                  <div className="flex items-center justify-center shrink-0 lg:w-4">
                    <i className="ri-arrow-down-line w-4 h-4 flex items-center justify-center text-slate-300 lg:hidden" aria-hidden="true" />
                    <i className="ri-arrow-right-line w-4 h-4 hidden lg:flex items-center justify-center text-slate-300" aria-hidden="true" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 mb-5">The report contains</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {reportOutputs.map((item) => (
              <div key={item} className="rounded-xl border border-slate-200 bg-[#F7F9FC] px-4 py-3 flex items-center gap-2.5">
                <i className="ri-file-chart-line w-4 h-4 flex items-center justify-center text-[#E11D48]" aria-hidden="true" />
                <span className="text-sm text-slate-600">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}