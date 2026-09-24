'use client';

import { motion } from '@/components/motion';

const stages = [
  { title: 'Scope & Rules', icon: 'ri-file-shield-2-line', desc: 'We agree what may be tested, when, and what must be left untouched.' },
  { title: 'AI Reconnaissance', icon: 'ri-radar-line', desc: 'Automated discovery maps every page, endpoint, asset and exposed service.' },
  { title: 'Attack Simulation', icon: 'ri-bug-2-line', desc: 'AI agents attempt thousands of attack variations continuously, not once.' },
  { title: 'Human Validation', icon: 'ri-user-star-line', desc: 'Every finding is confirmed by hand so you never receive false alarms.' },
  { title: 'Clear Reporting', icon: 'ri-file-list-3-line', desc: 'Plain-English findings, business impact and prioritised fixes.' },
  { title: 'Fix & Retest', icon: 'ri-refresh-line', desc: 'We re-run the exact attacks after your team patches to prove it is closed.' },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 px-6 bg-[#060F1E] relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(225,29,72,0.07) 0%, transparent 60%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            How the testing works
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            From first scan to verified fix.
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A structured engagement, not a one-off automated scan dump.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-7 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E11D48]/30 to-transparent" />
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 lg:gap-5">
            {stages.map((stage, i) => (
              <motion.div
                key={stage.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="relative flex lg:flex-col items-start lg:items-center gap-4 lg:gap-0 lg:text-center"
              >
                {i < stages.length - 1 && (
                  <div className="lg:hidden absolute left-6 top-12 bottom-[-2.5rem] w-px bg-white/10" aria-hidden="true" />
                )}
                <div className="relative z-10 w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-[#0A1628] border border-[#E11D48]/30 flex items-center justify-center shrink-0">
                  <i className={`${stage.icon} text-xl w-6 h-6 flex items-center justify-center text-[#E11D48]`} />
                </div>
                <div className="lg:mt-5">
                  <span className="block text-xs font-semibold text-[#E11D48] mb-1">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-lg font-bold text-white">{stage.title}</h3>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed max-w-[220px] mx-auto">{stage.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-slate-400 max-w-2xl mx-auto mt-16 leading-relaxed"
        >
          Testing runs against a staging copy where possible, and every engagement is covered by a
          written scope and authorisation so your systems are never put at risk.
        </motion.p>
      </div>
    </section>
  );
}