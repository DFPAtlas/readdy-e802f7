'use client';

import { motion } from '@/components/motion';

type Package = {
  name: string;
  label: string;
  featured?: boolean;
  description: string;
  bestFor: string;
  intro?: string;
  includes: string[];
  deliverables: string[];
  cta: string;
  ctaRoute: string;
};

const packages: Package[] = [
  {
    name: 'DFP AI Security Scan',
    label: 'Foundation',
    description:
      'A focused external assessment designed to show how your organisation appears from the internet and identify obvious exposure.',
    bestFor:
      'Small businesses, new websites and organisations wanting a first security baseline.',
    includes: [
      'External attack-surface discovery',
      'Website and web-application checks',
      'DNS review',
      'TLS and certificate checks',
      'Email security posture',
      'Exposed service discovery',
      'Known vulnerability correlation',
      'Human review of material findings',
      'Prioritised remediation summary',
    ],
    deliverables: ['External Security Assessment Report'],
    cta: 'Request a Security Scan',
    ctaRoute: '/contact?need=security&need_label=AI%20Security%20Scan',
  },
  {
    name: 'DFP AI Security Assessment',
    label: 'Most comprehensive',
    featured: true,
    description:
      'A deeper authorised assessment across your applications, cloud services, identity controls, infrastructure and AI-enabled systems.',
    bestFor:
      'Businesses with customer data, cloud infrastructure, internal systems or growing digital operations.',
    intro: 'Everything in AI Security Scan, plus:',
    includes: [
      'Cloud security review',
      'Identity and privileged-access review',
      'API and integration testing',
      'Business portal / SaaS assessment',
      'Database and storage configuration review',
      'AI / LLM security review where applicable',
      'Attack-path analysis',
      'Risk correlation',
      'Cyber Essentials readiness mapping',
      'Human validation',
      'Remediation workshop',
      'Retest of agreed fixes',
    ],
    deliverables: [
      'Executive summary',
      'Technical findings',
      'Evidence pack',
      'Attack-path analysis',
      'Prioritised remediation plan',
      'Retest outcome',
    ],
    cta: 'Request a Full Assessment',
    ctaRoute: '/contact?need=security&need_label=Full%20AI%20Security%20Assessment',
  },
  {
    name: 'DFP Security Watch',
    label: 'Ongoing',
    description:
      'Continuing security visibility after the initial assessment, designed to identify meaningful changes to your external attack surface and security posture.',
    bestFor:
      'Businesses that want ongoing awareness rather than relying solely on periodic point-in-time assessments.',
    intro: 'Monitoring examples:',
    includes: [
      'New domain or subdomain',
      'New exposed service',
      'DNS change',
      'TLS or certificate change',
      'New relevant vulnerability',
      'Security configuration regression',
      'Credential exposure signal',
      'Material external attack-surface change',
    ],
    deliverables: [
      'Periodic security review',
      'Prioritised alerts',
      'Trend reporting',
      'Recommended action',
      'Escalation of material findings',
    ],
    cta: 'Ask About Security Watch',
    ctaRoute: '/contact?need=security&need_label=Security%20Watch',
  },
];

const comparisonRows: { feature: string; scan: string; assessment: string; watch: string }[] = [
  { feature: 'External attack surface', scan: 'Included', assessment: 'Included', watch: 'Included' },
  { feature: 'Website / application testing', scan: 'Included', assessment: 'Included', watch: 'Not included' },
  { feature: 'Email security review', scan: 'Included', assessment: 'Included', watch: 'Optional' },
  { feature: 'Cloud security review', scan: 'Not included', assessment: 'Included', watch: 'Optional' },
  { feature: 'Identity review', scan: 'Not included', assessment: 'Included', watch: 'Optional' },
  { feature: 'AI system review', scan: 'Not included', assessment: 'Optional', watch: 'Optional' },
  { feature: 'Attack-path analysis', scan: 'Optional', assessment: 'Included', watch: 'Included' },
  { feature: 'Human validation', scan: 'Included', assessment: 'Included', watch: 'Not included' },
  { feature: 'Remediation plan', scan: 'Included', assessment: 'Included', watch: 'Optional' },
  { feature: 'Retest', scan: 'Optional', assessment: 'Included', watch: 'Optional' },
  { feature: 'Ongoing monitoring', scan: 'Not included', assessment: 'Optional', watch: 'Included' },
];

const engagementSteps = [
  { title: 'Scope call', desc: 'Agree what is in and out of scope.' },
  { title: 'Written authorisation', desc: 'Confirm permission before any work.' },
  { title: 'Assessment', desc: 'AI-assisted, human-reviewed testing.' },
  { title: 'Findings & remediation', desc: 'Evidence-led findings and fixes.' },
  { title: 'Retest / monitoring', desc: 'Verify fixes or keep watching.' },
];

const decisions = [
  { prompt: 'I only want to know what is visible from the internet', answer: 'AI Security Scan' },
  { prompt: 'I want my wider systems, cloud and identity reviewed', answer: 'AI Security Assessment' },
  { prompt: 'I want ongoing visibility after the assessment', answer: 'Security Watch' },
];

const accent = '#E11D48';
const accentOrange = '#EA580C';

function ValueTag({ value, light }: { value: string; light?: boolean }) {
  if (value === 'Included') {
    return (
      <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${light ? 'text-emerald-700' : 'text-emerald-600'}`}>
        <i className="ri-check-line w-4 h-4 flex items-center justify-center" />
        Included
      </span>
    );
  }
  if (value === 'Optional') {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500">
        <i className="ri-subtract-line w-4 h-4 flex items-center justify-center" />
        Optional
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300">
      <i className="ri-close-line w-4 h-4 flex items-center justify-center" />
      Not included
    </span>
  );
}

function PackageCard({ pkg, index }: { pkg: Package; index: number }) {
  const color = pkg.featured ? accent : accentOrange;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className={`relative rounded-2xl p-6 md:p-7 flex flex-col border ${
        pkg.featured
          ? 'bg-white border-[#E11D48]/40 shadow-[0_18px_40px_rgba(225,29,72,0.12)]'
          : 'glass-card border-slate-200'
      }`}
    >
      {pkg.featured && (
        <span className="absolute -top-3 left-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E11D48] text-white text-[11px] font-bold uppercase tracking-[0.1em]">
          <i className="ri-star-fill w-3.5 h-3.5 flex items-center justify-center" />
          {pkg.label}
        </span>
      )}

      <div className="flex items-center justify-between gap-3 mb-5">
        <span
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] border"
          style={{ color, backgroundColor: `${color}0F`, borderColor: `${color}26` }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
          {pkg.featured ? 'Primary service' : pkg.label}
        </span>
        <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">Quoted to scope</span>
      </div>

      <h3 className="text-xl font-bold tracking-tight text-slate-900 mb-3">{pkg.name}</h3>
      <p className="text-sm text-slate-500 leading-relaxed mb-5">{pkg.description}</p>

      <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 mb-6">
        <p className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-400 mb-1.5">Best for</p>
        <p className="text-sm text-slate-600 leading-relaxed">{pkg.bestFor}</p>
      </div>

      {pkg.intro && <p className="text-xs font-semibold text-slate-400 mb-3">{pkg.intro}</p>}
      <ul className="space-y-2.5 mb-6">
        {pkg.includes.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
            <i className="ri-check-line w-4 h-4 flex items-center justify-center shrink-0 mt-0.5" style={{ color }} />
            {item}
          </li>
        ))}
      </ul>

      <div className="pt-5 border-t border-slate-100 mt-auto">
        <p className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-400 mb-2.5">
          {pkg.deliverables.length > 1 ? 'Deliverables' : 'Deliverable'}
        </p>
        <ul className="flex flex-wrap gap-2 mb-6">
          {pkg.deliverables.map((d) => (
            <li
              key={d}
              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-medium text-slate-600"
            >
              {d}
            </li>
          ))}
        </ul>
        <a
          href={pkg.ctaRoute}
          className={`inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-opacity hover:opacity-90 ${
            pkg.featured ? 'bg-[#E11D48] text-white' : 'bg-slate-900 text-white'
          }`}
        >
          {pkg.cta}
          <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center" />
        </a>
      </div>
    </motion.div>
  );
}

export default function SecurityPackagesSection() {
  return (
    <section className="py-24 px-6 bg-[#F7F9FC] relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Security Services
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            Choose the level of assurance your business needs.
          </h2>
          <p className="text-lg text-slate-500 max-w-3xl mx-auto leading-relaxed">
            Start with an external security assessment, go deeper across your systems and identity, or
            continue monitoring after remediation.
          </p>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed mt-4">
            Scope and final cost depend on the number of systems, applications, users and environments
            included in the assessment.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20">
          {packages.map((pkg, i) => (
            <PackageCard key={pkg.name} pkg={pkg} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-2">
              Compare the service levels
            </h3>
            <p className="text-sm text-slate-400">
              Pricing is based on assessment depth, asset count and environment complexity.
            </p>
          </div>

          <div className="hidden md:block rounded-2xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs uppercase tracking-[0.12em] font-semibold text-slate-400">Feature</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-[0.12em] font-semibold text-slate-500">AI Security Scan</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-[0.12em] font-semibold text-[#E11D48]">AI Security Assessment</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-[0.12em] font-semibold text-slate-500">Security Watch</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 1 ? 'bg-slate-50/60' : ''}>
                    <td className="px-6 py-3.5 text-sm font-medium text-slate-700">{row.feature}</td>
                    <td className="px-6 py-3.5"><ValueTag value={row.scan} /></td>
                    <td className="px-6 py-3.5"><ValueTag value={row.assessment} /></td>
                    <td className="px-6 py-3.5"><ValueTag value={row.watch} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {comparisonRows.map((row) => (
              <div key={row.feature} className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-800 mb-3">{row.feature}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-medium text-slate-400">AI Security Scan</span>
                    <ValueTag value={row.scan} />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-medium text-slate-400">AI Security Assessment</span>
                    <ValueTag value={row.assessment} />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-medium text-slate-400">Security Watch</span>
                    <ValueTag value={row.watch} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-2">What happens next?</h3>
            <p className="text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Every engagement begins with a defined scope so Digital Footprint knows exactly which systems
              may be assessed and which must remain untouched.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {engagementSteps.map((step, i) => (
              <div key={step.title} className="glass-card rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#E11D48]/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-[#E11D48]">{i + 1}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)] p-7 md:p-9"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-6">
                Not sure which assessment you need?
              </h3>
              <div className="space-y-3">
                {decisions.map((d) => (
                  <div
                    key={d.prompt}
                    className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 rounded-xl bg-slate-50 border border-slate-100 p-4"
                  >
                    <p className="text-sm text-slate-600 flex-1">{d.prompt}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#E11D48] whitespace-nowrap">
                      <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center" />
                      {d.answer}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <a
              href="/contact?need=security&need_label=Security%20Services%20Enquiry"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#E11D48] text-white text-sm font-semibold whitespace-nowrap hover:opacity-90 transition-opacity"
            >
              Talk to Digital Footprint
              <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}