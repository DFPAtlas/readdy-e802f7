'use client';

import { motion } from '@/components/motion';

const steps = [
  { title: 'Trigger', icon: 'ri-flashlight-line', desc: 'An event starts the workflow.' },
  { title: 'Collect Data', icon: 'ri-inbox-archive-line', desc: 'Gather the relevant information.' },
  { title: 'Apply Rules', icon: 'ri-list-check-3', desc: 'Follow the defined process.' },
  { title: 'AI Assistance', icon: 'ri-robot-line', desc: 'Interpret or classify where helpful.' },
  { title: 'Human Approval', icon: 'ri-shield-user-line', desc: 'A person approves where needed.' },
  { title: 'Action', icon: 'ri-send-plane-line', desc: 'Complete the task.' },
  { title: 'Audit Record', icon: 'ri-file-search-line', desc: 'Log what happened for review.' },
];

const triggers = ['form submitted', 'email received', 'customer request', 'CRM record changed', 'scheduled process', 'system event'];

export default function AutomationFlowSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_30%,rgba(6,182,212,0.05),transparent_55%)]" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#7C3AED] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Automation flow
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            From event to completed workflow
          </h2>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-7 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7C3AED]/30 to-transparent" />
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 lg:gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="relative flex lg:flex-col items-start lg:items-center gap-4 lg:gap-0 lg:text-center"
              >
                {i < steps.length - 1 && (
                  <div className="lg:hidden absolute left-6 top-12 bottom-[-2.5rem] w-px bg-slate-200" aria-hidden="true" />
                )}
                <div className="relative z-10 w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-white border border-[#7C3AED]/30 flex items-center justify-center shrink-0 shadow-sm">
                  <i className={`${step.icon} text-xl w-6 h-6 flex items-center justify-center text-[#7C3AED]`} />
                </div>
                <div className="lg:mt-5">
                  <span className="block text-xs font-semibold text-[#7C3AED] mb-1">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-base font-bold text-slate-800">{step.title}</h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-[180px] mx-auto">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-slate-500 mr-1">Example triggers:</span>
          {triggers.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
            >
              <i className="ri-play-circle-line w-3.5 h-3.5 flex items-center justify-center text-[#F97316]" />
              {t}
            </span>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-slate-500 max-w-2xl mx-auto mt-12 leading-relaxed"
        >
          Automation does not have to mean removing human decisions. Approval stages can remain
          part of any workflow where judgement, risk or accountability is required.
        </motion.p>
      </div>
    </section>
  );
}