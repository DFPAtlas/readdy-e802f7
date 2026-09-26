'use client';

import { motion } from '@/components/motion';

const layers = [
  { title: 'Organisation', items: ['organisations'], accent: 'slate' },
  { title: 'Engagement', items: ['security_engagements', 'engagement_assets'], accent: 'slate' },
  { title: 'Scope · Assets · Approvals', items: ['engagement_scope', 'scope_assets', 'approval_requests'], accent: 'red' },
  { title: 'Runs', items: ['assessment_runs'], accent: 'slate' },
  { title: 'Agent Tasks', items: ['security_agents', 'agent_tasks', 'scope_validation_events'], accent: 'slate' },
  { title: 'Findings', items: ['findings'], accent: 'red' },
  { title: 'Evidence + Attack Paths', items: ['finding_evidence', 'attack_paths', 'attack_path_nodes'], accent: 'slate' },
  { title: 'Remediation', items: ['remediation_actions'], accent: 'slate' },
  { title: 'Retest', items: ['retest_records'], accent: 'slate' },
  { title: 'Reports', items: ['security_reports', 'report_findings'], accent: 'slate' },
];

const watchChain = ['Security Watch Config', 'Security Watch Events', 'Escalated Finding'];

export default function ErDiagramSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-3">
            Entity relationship diagram
          </p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            How the proposed entities relate.
          </h2>
          <p className="text-base text-slate-500 max-w-3xl mx-auto leading-relaxed">
            The core chain runs from organisation to report. Security Watch attaches to the organisation and its engagement baseline.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-slate-200/80 bg-[#F7F9FC] p-6 md:p-8"
        >
          <ol className="space-y-2">
            {layers.map((layer, i) => (
              <li key={layer.title} className="flex flex-col items-stretch">
                <div className={`rounded-xl border bg-white px-4 py-3 ${layer.accent === 'red' ? 'border-[#E11D48]/30' : 'border-slate-200'}`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 mr-1">{layer.title}</span>
                    {layer.items.map((item) => (
                      <span key={item} className="text-[11px] font-mono text-slate-500 bg-[#F7F9FC] border border-slate-200 px-2 py-0.5 rounded">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                {i < layers.length - 1 && (
                  <span className="flex justify-center py-1" aria-hidden="true">
                    <i className="ri-arrow-down-line w-4 h-4 flex items-center justify-center text-slate-300" />
                  </span>
                )}
              </li>
            ))}
          </ol>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 mb-4">Security Watch branch</p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              {watchChain.map((node, i) => (
                <div key={node} className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center">
                    <span className="text-xs font-semibold text-slate-700">{node}</span>
                  </div>
                  {i < watchChain.length - 1 && (
                    <span className="flex items-center justify-center" aria-hidden="true">
                      <i className="ri-arrow-down-line w-4 h-4 flex items-center justify-center text-slate-300 sm:hidden" />
                      <i className="ri-arrow-right-line w-4 h-4 hidden sm:flex items-center justify-center text-slate-300" />
                    </span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mt-4">
              Monitoring stays inside a defined monitoring scope. A material change can be reviewed by a human and escalated into a finding.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}