'use client';

import { motion } from '@/components/motion';

const vectors = [
  'Broken access control',
  'Injection attacks',
  'Authentication flaws',
  'Sensitive data exposure',
  'Security misconfiguration',
  'Vulnerable components',
  'API abuse',
  'Cloud storage leaks',
  'Prompt injection',
  'Session hijacking',
  'Weak credentials',
  'Phishing entry points',
  'Privilege escalation',
  'Missing rate limits',
  'Exposed admin panels',
  'Insecure integrations',
];

export default function ThreatCoverageSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_50%,rgba(225,29,72,0.04),transparent_55%)]" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
              Threat coverage
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-5">
              We think like the attacker, so you do not have to.
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed mb-6">
              Our AI testing engine is trained on the same weaknesses that cause the majority of real
              breaches, then mapped back to recognised frameworks so your team knows exactly which
              risk is which.
            </p>
            <p className="text-base text-slate-500 leading-relaxed mb-8">
              Findings are aligned to OWASP Top 10, and cloud checks follow CIS benchmark guidance.
              Where AI systems are in play, we also test for prompt injection, data leakage and
              unsafe tool use.
            </p>

            <div className="flex flex-wrap gap-3">
              {['OWASP Top 10', 'MITRE ATT&CK', 'CIS Benchmarks', 'GDPR aware'].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-600"
                >
                  <i className="ri-shield-check-line w-4 h-4 flex items-center justify-center text-[#E11D48]" />
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-7"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-5">
              Attack paths we actively simulate
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {vectors.map((vector) => (
                <div key={vector} className="flex items-center gap-2.5 text-sm text-slate-600">
                  <i className="ri-flashlight-line w-4 h-4 flex items-center justify-center shrink-0 text-[#E11D48]" />
                  {vector}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}