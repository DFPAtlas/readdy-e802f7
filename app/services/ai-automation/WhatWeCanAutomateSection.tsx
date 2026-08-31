'use client';

import { motion } from '@/components/motion';

const capabilities = [
  {
    title: 'Customer Enquiries',
    icon: 'ri-chat-smile-3-line',
    color: '#06B6D4',
    items: ['Initial customer questions', 'FAQ responses', 'Enquiry routing', 'Information collection', 'Support triage', 'Escalation to staff'],
  },
  {
    title: 'Lead Qualification',
    icon: 'ri-filter-3-line',
    color: '#F97316',
    items: ['Lead capture', 'Qualification questions', 'CRM updates', 'Follow-up workflows', 'Sales notifications', 'Appointment routing'],
  },
  {
    title: 'Business Administration',
    icon: 'ri-tools-line',
    color: '#7C3AED',
    items: ['Repetitive data entry', 'Record updates', 'Internal notifications', 'Document handling', 'Task creation', 'Status tracking'],
  },
  {
    title: 'Documents & Information',
    icon: 'ri-file-text-line',
    color: '#10B981',
    items: ['Document classification', 'Information extraction', 'Data validation', 'Summarisation', 'Search', 'Structured data capture'],
  },
  {
    title: 'Operational Workflows',
    icon: 'ri-flow-chart',
    color: '#A855F7',
    items: ['Approvals', 'Job workflows', 'Scheduling', 'Ticket routing', 'Status changes', 'Escalations'],
  },
  {
    title: 'Reporting & Monitoring',
    icon: 'ri-bar-chart-grouped-line',
    color: '#EC4899',
    items: ['Scheduled reports', 'Operational summaries', 'Alerts', 'KPI monitoring', 'Exception detection', 'Management notifications'],
  },
];

export default function WhatWeCanAutomateSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,rgba(124,58,237,0.06),transparent_55%)]" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#7C3AED] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            What we can automate
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            Where AI and automation can help
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Automation is about supporting your team and removing repetitive work — not replacing
            the people who make decisions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group glass-card rounded-2xl p-6"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105"
                style={{ backgroundColor: `${cap.color}15` }}
              >
                <i className={`${cap.icon} text-xl w-6 h-6 flex items-center justify-center`} style={{ color: cap.color }} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{cap.title}</h3>
              <ul className="space-y-2.5">
                {cap.items.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <i className="ri-check-line w-4 h-4 flex items-center justify-center shrink-0" style={{ color: cap.color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}