'use client';

import { motion } from '@/components/motion';
import { logicalAgents } from '../architecture-data';

export default function AgentModelSection() {
  return (
    <section className="py-20 px-6 bg-[#F7F9FC]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-3">
            Agent model
          </p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            Specialist agents, coordinated by a master agent.
          </h2>
          <p className="text-base text-slate-500 max-w-3xl mx-auto leading-relaxed">
            The Security Master Agent coordinates work. Specialist agents never receive unrestricted scope.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {logicalAgents.map((agent, i) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.04 }}
              className={`rounded-2xl p-5 border flex flex-col ${
                agent.master
                  ? 'bg-slate-950 border-slate-800 sm:col-span-2 lg:col-span-1'
                  : 'bg-white border-slate-200/80'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${agent.master ? 'bg-slate-800 border border-slate-700' : 'bg-[#E11D48]/10'}`}>
                  <i className={`${agent.icon} w-5 h-5 flex items-center justify-center ${agent.master ? 'text-[#F97316]' : 'text-[#E11D48]'}`} aria-hidden="true" />
                </div>
                {agent.master && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/30 px-2 py-0.5 rounded-full">
                    Coordinates
                  </span>
                )}
              </div>
              <h3 className={`text-sm font-bold mb-1.5 ${agent.master ? 'text-white' : 'text-slate-900'}`}>
                {agent.name}
              </h3>
              <p className={`text-xs leading-relaxed ${agent.master ? 'text-slate-400' : 'text-slate-500'}`}>
                {agent.role}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white px-5 py-4 flex items-start gap-3">
          <i className="ri-shield-check-line w-5 h-5 flex items-center justify-center shrink-0 text-[#E11D48]" aria-hidden="true" />
          <p className="text-sm text-slate-600 leading-relaxed">
            Every agent operates under the Assessment Scope Token for its engagement. No agent may self-authorise, widen its own scope or act outside approved boundaries.
          </p>
        </div>
      </div>
    </section>
  );
}