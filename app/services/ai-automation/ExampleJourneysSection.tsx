'use client';

import { motion } from '@/components/motion';

const journeys = [
  {
    title: 'New Sales Enquiry',
    icon: 'ri-user-add-line',
    color: '#06B6D4',
    steps: ['Website enquiry', 'Capture details', 'AI qualification', 'CRM record', 'Sales notification', 'Human follow-up'],
  },
  {
    title: 'Customer Support',
    icon: 'ri-customer-service-2-line',
    color: '#7C3AED',
    steps: ['Customer request', 'Identify request', 'Search approved knowledge', 'Provide response or recommendation', 'Escalate if required', 'Record outcome'],
  },
  {
    title: 'Document Processing',
    icon: 'ri-file-copy-2-line',
    color: '#10B981',
    steps: ['Document received', 'Identify document', 'Extract required information', 'Validate data', 'Human review where required', 'Update business system'],
  },
];

export default function ExampleJourneysSection() {
  return (
    <section className="py-24 px-6 bg-[#0A1628] relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(124,58,237,0.06) 0%, transparent 60%)' }} />
      <div className="absolute inset-0 opacity-[0.01]" style={{ backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#06B6D4] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Example automation journeys
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            What an automated workflow could look like
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Illustrative examples — not every workflow can or should be fully automated.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {journeys.map((journey, i) => (
            <motion.div
              key={journey.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${journey.color}18` }}
                >
                  <i className={`${journey.icon} text-lg w-5 h-5 flex items-center justify-center`} style={{ color: journey.color }} />
                </div>
                <h3 className="text-lg font-bold text-white">{journey.title}</h3>
              </div>

              <ol className="space-y-0">
                {journey.steps.map((step, s) => (
                  <li key={step} className="relative flex items-start gap-3 pb-5 last:pb-0">
                    {s < journey.steps.length - 1 && (
                      <span className="absolute left-[13px] top-7 bottom-0 w-px bg-white/10" aria-hidden="true" />
                    )}
                    <span
                      className="relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold"
                      style={{ backgroundColor: `${journey.color}20`, color: journey.color }}
                    >
                      {s + 1}
                    </span>
                    <span className="text-sm text-slate-300 pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}