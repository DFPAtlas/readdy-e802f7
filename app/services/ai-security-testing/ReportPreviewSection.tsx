'use client';

import { useState } from 'react';
import { motion } from '@/components/motion';
import { reportTabs } from './report-preview-data';
import ReportExecSummary from './report/ReportExecSummary';
import ReportFindings from './report/ReportFindings';
import ReportAttackPaths from './report/ReportAttackPaths';
import ReportRemediation from './report/ReportRemediation';
import ReportRetest from './report/ReportRetest';
import ReportAudienceSection from './report/ReportAudienceSection';

function ActiveReportView({ active }: { active: string }) {
  switch (active) {
    case 'findings':
      return <ReportFindings />;
    case 'paths':
      return <ReportAttackPaths />;
    case 'remediation':
      return <ReportRemediation />;
    case 'retest':
      return <ReportRetest />;
    default:
      return <ReportExecSummary />;
  }
}

export default function ReportPreviewSection() {
  const [active, setActive] = useState('summary');

  return (
    <section className="py-24 px-6 bg-[#F7F9FC] relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            What you receive
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            A report your technical team and directors can both use.
          </h2>
          <p className="text-lg text-slate-500 max-w-3xl mx-auto leading-relaxed mb-4">
            Digital Footprint turns validated security findings into evidence, attack paths, business impact and a prioritised remediation plan.
          </p>
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">
            <i className="ri-information-line w-4 h-4 flex items-center justify-center text-slate-400" />
            Illustrative report preview
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-slate-200/80 bg-white shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)] overflow-hidden"
        >
          <div className="hidden md:flex items-center gap-1 px-3 pt-3 border-b border-slate-100 bg-slate-50/60">
            {reportTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-t-lg transition-colors cursor-pointer whitespace-nowrap ${
                  active === tab.id ? 'bg-white text-[#E11D48] border-x border-t border-slate-100' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <i className={`${tab.icon} w-4 h-4 flex items-center justify-center`} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="md:hidden p-4 border-b border-slate-100 bg-slate-50/60">
            <div className="flex flex-wrap gap-2">
              {reportTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActive(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                    active === tab.id ? 'bg-[#E11D48] text-white' : 'bg-white text-slate-500 border border-slate-200'
                  }`}
                >
                  <i className={`${tab.icon} w-4 h-4 flex items-center justify-center`} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 sm:p-6 md:p-8">
            <ActiveReportView active={active} />
          </div>
        </motion.div>

        <ReportAudienceSection />
      </div>
    </section>
  );
}