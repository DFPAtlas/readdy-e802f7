'use client';

import { motion } from '@/components/motion';

const agents = [
  { title: 'Customer Support Agent', icon: 'ri-customer-service-2-line', color: '#06B6D4', desc: 'Handles common customer enquiries and escalates issues requiring staff intervention.' },
  { title: 'Lead Qualification Agent', icon: 'ri-filter-3-line', color: '#F97316', desc: 'Collects information, evaluates enquiry requirements and passes qualified leads into the business workflow.' },
  { title: 'Operations Agent', icon: 'ri-radar-line', color: '#10B981', desc: 'Monitors operational information and supports repetitive administrative processes.' },
  { title: 'Knowledge Agent', icon: 'ri-book-open-line', color: '#7C3AED', desc: 'Searches approved business information and helps staff locate relevant answers and documents.' },
  { title: 'Reporting Agent', icon: 'ri-bar-chart-box-line', color: '#A855F7', desc: 'Collects approved data sources and prepares summaries or operational reports.' },
  { title: 'Orchestrator', icon: 'ri-git-branch-line', color: '#EC4899', desc: 'Coordinates multiple approved agents or workflows where a process requires several specialised tasks.' },
];

export default function AiAgentsSection() {
  return (
    <section className="py-24 px-6 bg-[#060F1E] relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(124,58,237,0.07) 0%, transparent 60%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#7C3AED] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            AI agents
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            AI agents built for specific jobs
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            An AI agent should have a defined purpose, approved access and clear operating
            boundaries.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.15] hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: `${agent.color}18` }}
              >
                <i className={`${agent.icon} text-xl w-6 h-6 flex items-center justify-center`} style={{ color: agent.color }} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{agent.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{agent.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center"
        >
          <div className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-6 py-5 max-w-2xl">
            <div className="w-9 h-9 rounded-lg bg-[#F97316]/15 flex items-center justify-center shrink-0">
              <i className="ri-shield-keyhole-line text-lg w-5 h-5 flex items-center justify-center text-[#F97316]" />
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              AI agents should only receive the permissions and data access required for their
              specific role.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}