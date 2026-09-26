'use client';

import { motion } from '@/components/motion';

const chain = [
  { label: 'Organisation', icon: 'ri-building-2-line' },
  { label: 'Security Engagement', icon: 'ri-shield-keyhole-line' },
  { label: 'Scope', icon: 'ri-focus-3-line' },
  { label: 'Assessment Runs', icon: 'ri-play-circle-line' },
  { label: 'Agent Tasks', icon: 'ri-task-line' },
  { label: 'Findings', icon: 'ri-alert-line' },
  { label: 'Evidence', icon: 'ri-file-search-line' },
  { label: 'Attack Paths', icon: 'ri-node-tree' },
  { label: 'Remediation', icon: 'ri-tools-line' },
  { label: 'Retest', icon: 'ri-refresh-line' },
  { label: 'Report', icon: 'ri-file-chart-line' },
];

export default function EntityHierarchyDiagram() {
  return (
    <section className="pb-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-slate-200/80 bg-[#F7F9FC] p-6 md:p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Entity hierarchy</p>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
              Logical model
            </span>
          </div>

          <ol className="space-y-2">
            {chain.map((item, i) => (
              <li key={item.label} className="flex flex-col items-stretch">
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F7F9FC] border border-slate-200 shrink-0">
                    <i className={`${item.icon} w-4 h-4 flex items-center justify-center text-[#E11D48]`} aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                </div>
                {i < chain.length - 1 && (
                  <span className="flex justify-center py-1" aria-hidden="true">
                    <i className="ri-arrow-down-line w-4 h-4 flex items-center justify-center text-slate-300" />
                  </span>
                )}
              </li>
            ))}
          </ol>

          <div className="mt-6 pt-5 border-t border-slate-200 flex items-start gap-3">
            <i className="ri-radar-line w-5 h-5 flex items-center justify-center shrink-0 text-[#EA580C]" aria-hidden="true" />
            <p className="text-sm text-slate-500 leading-relaxed">
              A Security Watch subscription attaches to the organisation and its engagement baseline, so ongoing monitoring stays inside a defined, authorised scope.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}