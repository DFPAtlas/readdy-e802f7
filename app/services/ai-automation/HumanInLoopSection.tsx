'use client';

import { motion } from '@/components/motion';

const controls = [
  { title: 'Approval Gates', icon: 'ri-check-double-line', color: '#06B6D4', desc: 'Sensitive or high-impact actions can require a person to approve them before execution.' },
  { title: 'Permission Boundaries', icon: 'ri-key-2-line', color: '#7C3AED', desc: 'Agents should only access the systems, tools and data needed for their role.' },
  { title: 'Audit Trails', icon: 'ri-history-line', color: '#10B981', desc: 'Important actions and decisions can be recorded for review.' },
  { title: 'Escalation Rules', icon: 'ri-arrow-up-circle-line', color: '#F97316', desc: 'When an agent cannot safely or confidently complete a task, the workflow can pass it to a member of staff.' },
];

export default function HumanInLoopSection() {
  return (
    <section className="py-24 px-6 bg-[#0A1628] relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 100%, rgba(249,115,22,0.05) 0%, transparent 60%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#06B6D4] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Human-in-the-loop controls
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Automation with human oversight
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Control and governance can be built into automation so that people stay in charge of the
            important decisions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {controls.map((control, i) => (
            <motion.div
              key={control.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.15] hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: `${control.color}18` }}
              >
                <i className={`${control.icon} text-xl w-6 h-6 flex items-center justify-center`} style={{ color: control.color }} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{control.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{control.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}