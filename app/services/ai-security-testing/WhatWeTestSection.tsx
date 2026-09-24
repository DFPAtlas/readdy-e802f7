'use client';

import { motion } from '@/components/motion';

const targets = [
  {
    title: 'Websites & Web Apps',
    icon: 'ri-global-line',
    color: '#E11D48',
    items: ['Login and session flows', 'Form and input handling', 'Access control', 'File uploads', 'Business logic abuse', 'Third-party embeds'],
  },
  {
    title: 'APIs & Integrations',
    icon: 'ri-plug-line',
    color: '#F97316',
    items: ['Authentication tokens', 'Rate limiting', 'Data exposure', 'Permission checks', 'Webhook security', 'Partner integrations'],
  },
  {
    title: 'Cloud & Infrastructure',
    icon: 'ri-cloud-line',
    color: '#0891B2',
    items: ['Storage permissions', 'Exposed services', 'Secrets management', 'Network boundaries', 'Server hardening', 'Backup exposure'],
  },
  {
    title: 'Accounts & Identity',
    icon: 'ri-shield-user-line',
    color: '#7C3AED',
    items: ['Password policy', 'Multi-factor enforcement', 'Privilege escalation', 'Staff account risk', 'Offboarding gaps', 'Session hijacking'],
  },
  {
    title: 'AI Systems & Chatbots',
    icon: 'ri-robot-2-line',
    color: '#10B981',
    items: ['Prompt injection', 'Data leakage', 'Tool misuse', 'Model guardrails', 'Knowledge base exposure', 'Cost abuse'],
  },
  {
    title: 'People & Process',
    icon: 'ri-mail-send-line',
    color: '#0D9488',
    items: ['Phishing simulation', 'Awareness testing', 'Vendor risk', 'Document handling', 'Incident readiness', 'Policy gaps'],
  },
];

export default function WhatWeTestSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,rgba(225,29,72,0.04),transparent_55%)]" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            What we test
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            Your whole attack surface, not just the website.
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Most breaches start somewhere unexpected. We test the systems, accounts and processes
            that attackers actually target.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {targets.map((target, i) => (
            <motion.div
              key={target.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group glass-card rounded-2xl p-6"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105"
                style={{ backgroundColor: `${target.color}15` }}
              >
                <i className={`${target.icon} text-xl w-6 h-6 flex items-center justify-center`} style={{ color: target.color }} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{target.title}</h3>
              <ul className="space-y-2.5">
                {target.items.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <i className="ri-check-line w-4 h-4 flex items-center justify-center shrink-0" style={{ color: target.color }} />
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