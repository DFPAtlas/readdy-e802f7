'use client';

import { motion } from '@/components/motion';

const deliverables = [
  { title: 'Executive Summary', icon: 'ri-file-text-line', color: '#E11D48', desc: 'A one-page view of your overall security posture for leadership and boards.' },
  { title: 'Prioritised Findings', icon: 'ri-alert-line', color: '#F97316', desc: 'Every issue scored by severity and business impact, not just technical detail.' },
  { title: 'Proof & Evidence', icon: 'ri-screenshot-2-line', color: '#7C3AED', desc: 'Reproduction steps and evidence so your developers can verify each finding.' },
  { title: 'Remediation Guidance', icon: 'ri-tools-line', color: '#0891B2', desc: 'Concrete, prioritised actions with effort estimates for your team or ours.' },
  { title: 'Retest Verification', icon: 'ri-refresh-line', color: '#10B981', desc: 'We re-attack fixed issues and confirm in writing that they are genuinely closed.' },
  { title: 'Ongoing Monitoring', icon: 'ri-radar-line', color: '#0D9488', desc: 'Optional continuous testing so new code does not quietly reopen old risks.' },
];

export default function DeliverablesSection() {
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
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            What you receive
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Evidence you can act on immediately.
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            No 200-page PDF full of jargon. You get the findings that matter, what they mean for the
            business, and how to close them.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deliverables.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.15] hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: `${item.color}18` }}
              >
                <i className={`${item.icon} text-xl w-6 h-6 flex items-center justify-center`} style={{ color: item.color }} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}