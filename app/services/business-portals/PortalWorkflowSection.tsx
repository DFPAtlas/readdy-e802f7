'use client';

import { motion } from '@/components/motion';

const steps = [
  { title: 'Request Created', icon: 'ri-add-circle-line', desc: 'A request is raised.' },
  { title: 'Information Collected', icon: 'ri-inbox-archive-line', desc: 'The right details are gathered.' },
  { title: 'Assigned', icon: 'ri-user-add-line', desc: 'The work is given to the right person.' },
  { title: 'Work In Progress', icon: 'ri-loader-4-line', desc: 'The task is being worked on.' },
  { title: 'Customer Updated', icon: 'ri-notification-3-line', desc: 'The customer is kept informed.' },
  { title: 'Approval', icon: 'ri-shield-check-line', desc: 'The outcome is approved.' },
  { title: 'Completed', icon: 'ri-checkbox-circle-line', desc: 'The work is finished.' },
  { title: 'Record Retained', icon: 'ri-history-line', desc: 'A record is kept for reference.' },
];

const useCases = ['customer project', 'service request', 'contractor job', 'quotation', 'document approval', 'support ticket'];

export default function PortalWorkflowSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_50%,rgba(16,185,129,0.05),transparent_55%)]" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#10B981] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Portal workflow example
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            A portal can manage the full journey
          </h2>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-7 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#10B981]/30 to-transparent" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="relative flex lg:flex-col items-start lg:items-center gap-4 lg:gap-0 lg:text-center"
              >
                <div className="relative z-10 w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-white border border-[#10B981]/30 flex items-center justify-center shrink-0 shadow-sm">
                  <i className={`${step.icon} text-xl w-6 h-6 flex items-center justify-center text-[#10B981]`} />
                </div>
                <div className="lg:mt-5">
                  <span className="block text-xs font-semibold text-[#10B981] mb-1">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-base font-bold text-slate-800">{step.title}</h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-[180px] mx-auto">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-slate-500 max-w-2xl mx-auto mt-12 leading-relaxed"
        >
          The exact stages can be designed around the workflow used by the business.
        </motion.p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-slate-500 mr-1">Example use cases:</span>
          {useCases.map((useCase) => (
            <span
              key={useCase}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
            >
              <i className="ri-briefcase-line w-3.5 h-3.5 flex items-center justify-center text-[#10B981]" />
              {useCase}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}