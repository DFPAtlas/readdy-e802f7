'use client';

import { motion } from '@/components/motion';

const agents = [
  {
    name: 'Recon Agent',
    icon: 'ri-radar-line',
    color: '#0891B2',
    status: 'Discovery',
    description:
      'Maps authorised domains, subdomains, exposed services, technologies and externally visible assets.',
    capabilities: ['Attack surface discovery', 'Domain and subdomain mapping', 'Service identification', 'Technology fingerprinting'],
  },
  {
    name: 'Web Security Agent',
    icon: 'ri-global-line',
    color: '#E11D48',
    status: 'Analysing',
    description:
      'Reviews authorised websites and applications for authentication, access-control, session and application-security weaknesses.',
    capabilities: ['Authentication', 'Access control', 'Session security', 'Application exposure'],
  },
  {
    name: 'Cloud Security Agent',
    icon: 'ri-cloud-line',
    color: '#2563EB',
    status: 'Analysing',
    description:
      'Reviews cloud and hosted systems for exposed resources, insecure configuration, excessive access and secret-management risks.',
    capabilities: ['Cloud configuration', 'Storage exposure', 'Database access', 'Secrets and permissions'],
  },
  {
    name: 'Identity Agent',
    icon: 'ri-shield-user-line',
    color: '#7C3AED',
    status: 'Reviewing',
    description:
      'Examines authorised identity controls, account privileges and authentication protections.',
    capabilities: ['MFA posture', 'Privileged accounts', 'Dormant accounts', 'Role and permission risk'],
  },
  {
    name: 'Email Security Agent',
    icon: 'ri-mail-send-line',
    color: '#0D9488',
    status: 'Complete',
    description:
      "Examines the organisation's email security posture and externally visible anti-spoofing controls.",
    capabilities: ['SPF', 'DKIM', 'DMARC', 'Mail exposure'],
  },
  {
    name: 'Vulnerability Intelligence Agent',
    icon: 'ri-bug-2-line',
    color: '#CA8A04',
    status: 'Correlating',
    description:
      'Correlates discovered technologies and configurations with known security vulnerabilities and relevant threat intelligence.',
    capabilities: ['Known vulnerabilities', 'Version risk', 'Security advisories', 'Exposure correlation'],
  },
  {
    name: 'AI / LLM Security Agent',
    icon: 'ri-robot-2-line',
    color: '#DB2777',
    status: 'Testing',
    description:
      'Assesses authorised AI systems, agents and chat interfaces for weaknesses specific to AI-enabled applications.',
    capabilities: ['Prompt injection exposure', 'Tool permission boundaries', 'Sensitive context exposure', 'RAG / knowledge access controls'],
  },
  {
    name: 'Risk Correlation Agent',
    icon: 'ri-flow-chart',
    color: '#F97316',
    status: 'Correlating',
    description:
      'Connects individual findings into attack paths and prioritises them using technical severity, exposure and potential business impact.',
    capabilities: ['Attack-path analysis', 'Finding correlation', 'Risk prioritisation', 'Business-impact mapping'],
    highlighted: true,
  },
];

const flow = ['Discover', 'Investigate', 'Validate', 'Correlate', 'Prioritise', 'Remediate'];

const scopeControls = [
  { label: 'Authorised assets', icon: 'ri-checkbox-multiple-line' },
  { label: 'Allowed test methods', icon: 'ri-equalizer-line' },
  { label: 'Defined testing window', icon: 'ri-time-line' },
  { label: 'Excluded systems', icon: 'ri-forbid-2-line' },
];

export default function SecurityAgentsSection() {
  return (
    <section id="security-agents" className="py-24 px-6 relative overflow-hidden bg-[#F8FAFC] scroll-mt-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(225,29,72,0.05),transparent_55%)]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            AI Security Team
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            Specialist agents. One coordinated assessment.
          </h2>
          <p className="text-lg text-slate-500 max-w-3xl mx-auto leading-relaxed">
            Instead of relying on one scanner, Digital Footprint uses specialised AI-assisted
            security agents that examine different parts of your authorised environment, share
            evidence and correlate findings into a single view of risk.
          </p>
          <div className="mt-6 inline-flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left max-w-2xl">
            <i className="ri-information-line w-4 h-4 flex items-center justify-center text-[#E11D48] shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-slate-500">
              AI assists discovery and analysis. Material findings are reviewed before they are
              presented to the client.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative flex flex-col items-center"
        >
          <div className="relative w-full max-w-xl rounded-2xl p-6 text-center bg-white border-2 border-[#E11D48]/40 shadow-xl shadow-[#E11D48]/10">
            <div className="absolute -inset-3 rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(225,29,72,0.12),transparent_70%)] -z-10" aria-hidden="true" />
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#E11D48]/10 mb-4">
              <i className="ri-shield-star-line text-2xl w-7 h-7 flex items-center justify-center text-[#E11D48]" aria-hidden="true" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#E11D48]">
                Coordinator
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                Active
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">DFP Security Master Agent</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Controls assessment scope, assigns work, correlates evidence and keeps every agent
              inside the agreed testing boundaries.
            </p>
          </div>

          <div className="hidden md:flex flex-col items-center" aria-hidden="true">
            <span className="w-px h-8 bg-slate-300" />
            <span className="w-2 h-2 rounded-full bg-[#E11D48]" />
            <span className="w-3/5 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
            <span className="w-px h-6 bg-slate-300 -mt-6" />
          </div>
          <div className="md:hidden h-8 w-px bg-slate-300" aria-hidden="true" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-2 md:mt-10">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className={`relative glass-card rounded-2xl p-5 flex flex-col bg-white ${
                agent.highlighted ? 'ring-2 ring-[#F97316]/50' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${agent.color}15` }}
                >
                  <i className={`${agent.icon} text-lg w-5 h-5 flex items-center justify-center`} style={{ color: agent.color }} aria-hidden="true" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: agent.color }} aria-hidden="true" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: agent.color }}>
                      {agent.status}
                    </span>
                  </span>
                  {agent.highlighted && (
                    <span className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-[#F97316]">
                      Risk layer
                    </span>
                  )}
                </div>
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">{agent.name}</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed mb-4 flex-1">{agent.description}</p>
              <ul className="space-y-1.5 pt-4 border-t border-slate-100">
                {agent.capabilities.map((cap) => (
                  <li key={cap} className="flex items-center gap-2 text-[12px] text-slate-600">
                    <i className="ri-check-line w-3.5 h-3.5 flex items-center justify-center shrink-0" style={{ color: agent.color }} aria-hidden="true" />
                    {cap}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="flex flex-col md:flex-row md:flex-wrap md:items-center md:justify-center gap-2">
            {flow.map((step, i) => (
              <div key={step} className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
                <span className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 whitespace-nowrap">
                  {step}
                </span>
                {i < flow.length - 1 && (
                  <i className="ri-arrow-right-line w-5 h-5 flex items-center justify-center text-[#E11D48] rotate-90 md:rotate-0 self-center" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-10 max-w-3xl mx-auto">
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">
              One finding rarely tells the whole story.
            </h3>
            <p className="text-slate-500 leading-relaxed">
              A weak account, exposed service and cloud permission may look unrelated on their own.
              The correlation layer examines how findings could connect so the final report focuses
              on meaningful attack paths rather than a long list of scanner alerts.
            </p>
          </div>
        </motion.div>

        <div className="max-w-3xl mx-auto mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-6 md:p-8 bg-white"
          >
            <div className="flex items-center gap-2.5 mb-5">
              <i className="ri-shield-check-line w-5 h-5 flex items-center justify-center text-[#E11D48]" aria-hidden="true" />
              <h3 className="text-lg font-bold text-slate-900">Rules of Engagement</h3>
            </div>
            <p className="text-sm text-slate-500 mb-5">Every agent operates inside an approved scope</p>
            <ul className="grid sm:grid-cols-2 gap-3">
              {scopeControls.map((control) => (
                <li key={control.label} className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-3">
                  <i className={`${control.icon} w-4 h-4 flex items-center justify-center text-[#E11D48] shrink-0`} aria-hidden="true" />
                  <span className="text-[13px] font-medium text-slate-600">{control.label}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3">
              <span className="text-[13px] text-slate-500">Out-of-scope target</span>
              <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center text-slate-300" aria-hidden="true" />
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#DC2626]/10 text-[#DC2626] text-[11px] font-bold uppercase tracking-wider">
                <i className="ri-lock-line w-3.5 h-3.5 flex items-center justify-center" aria-hidden="true" />
                Blocked
              </span>
            </div>
            <p className="mt-5 text-[11px] text-slate-400 leading-relaxed">
              Agents only act on approved assets, methods and time windows. Activity outside the
              agreed scope is prevented and logged.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}