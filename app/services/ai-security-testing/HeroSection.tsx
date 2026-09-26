'use client';

import { motion } from '@/components/motion';
import Link from 'next/link';
import HeroLightLines from '@/components/HeroLightLines';

const trustPoints = [
  'Authorised testing only',
  'Human-validated findings',
  'Clear remediation plan',
];

const agents = [
  { name: 'Recon Agent', status: 'Complete', tone: '#0891B2' },
  { name: 'Web Security Agent', status: 'Active', tone: '#E11D48' },
  { name: 'Cloud Agent', status: 'Active', tone: '#F97316' },
  { name: 'Identity Agent', status: 'Analysing', tone: '#7C3AED' },
  { name: 'Email Security Agent', status: 'Analysing', tone: '#0D9488' },
  { name: 'Risk Correlation Agent', status: 'Active', tone: '#CA8A04' },
];

const metrics = [
  { label: 'Assets discovered', value: '42', color: '#0891B2' },
  { label: 'Systems assessed', value: '18', color: '#E11D48' },
  { label: 'Attack paths', value: '7', color: '#F97316' },
  { label: 'Findings', value: '11', color: '#CA8A04' },
];

const findings = [
  { name: 'Publicly accessible customer database', severity: 'Critical', color: '#DC2626' },
  { name: 'Administrator account without MFA', severity: 'High', color: '#EA580C' },
  { name: 'Unauthenticated API data exposure', severity: 'High', color: '#EA580C' },
  { name: 'Email spoofing protection incomplete', severity: 'Medium', color: '#CA8A04' },
];

const attackPath = [
  'Exposed credentials',
  'Account access',
  'Cloud administration',
  'Customer database',
];

export default function HeroSection() {
  const scrollToWhatWeTest = () => {
    document.getElementById('what-we-test')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(225,29,72,0.07),transparent_60%)]" />
      <HeroLightLines />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E11D48]/10 border border-[#E11D48]/20 text-[#E11D48] text-sm font-medium mb-6">
            <i className="ri-shield-keyhole-line w-4 h-4 flex items-center justify-center" />
            AI-Powered Security Assessment
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 text-slate-900 max-w-4xl mx-auto">
            Find your weaknesses before attackers do.
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
            Digital Footprint combines specialised AI security agents, proven security tools and
            human review to examine your authorised digital attack surface — finding weaknesses,
            connecting attack paths and showing you exactly what to fix.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 mt-7">
            {trustPoints.map((point) => (
              <div key={point} className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
                <i className="ri-shield-check-line w-4 h-4 flex items-center justify-center text-[#E11D48]" />
                {point}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-9">
            <Link
              href="/contact?need=security&need_label=AI%20Security%20Assessment"
              className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-white overflow-hidden whitespace-nowrap cursor-pointer transition-all duration-300 bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] hover:-translate-y-0.5 shadow-lg shadow-[#F97316]/15 hover:shadow-xl hover:shadow-[#F97316]/25 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:ring-offset-2 focus:ring-offset-white"
            >
              <span className="relative z-10">Request a Security Assessment</span>
              <i className="ri-arrow-right-line w-5 h-5 flex items-center justify-center relative z-10 group-hover:translate-x-0.5 transition-transform duration-200" />
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Link>
            <button
              type="button"
              onClick={scrollToWhatWeTest}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-slate-700 border border-slate-200 bg-white hover:border-[#E11D48] hover:text-[#E11D48] transition-all duration-300 whitespace-nowrap cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E11D48] focus:ring-offset-2 focus:ring-offset-white"
            >
              See What We Test
              <i className="ri-arrow-down-line w-4 h-4 flex items-center justify-center" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="max-w-4xl mx-auto"
          aria-hidden="true"
        >
          <div className="rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/5 overflow-hidden bg-white">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="ml-3 text-xs font-medium text-slate-500">
                DFP Security Command — Assessment Active
              </span>
              <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] animate-pulse" />
                Illustrative
              </span>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
                {agents.map((agent) => (
                  <div
                    key={agent.name}
                    className="flex items-center gap-2 rounded-lg border border-slate-100 px-3 py-2.5"
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0 animate-pulse"
                      style={{ backgroundColor: agent.tone }}
                    />
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-slate-700 truncate">{agent.name}</p>
                      <p className="text-[10px] font-medium" style={{ color: agent.tone }}>
                        {agent.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {metrics.map((stat) => (
                  <div key={stat.label} className="rounded-lg border border-slate-100 p-3">
                    <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 -mt-1.5">Illustrative assessment</p>

              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Findings preview
                </p>
                <div className="rounded-lg border border-slate-100 divide-y divide-slate-100">
                  {findings.map((f) => (
                    <div key={f.name} className="flex items-center justify-between gap-3 px-3 py-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: f.color }} />
                        <span className="text-xs text-slate-600 truncate">{f.name}</span>
                      </div>
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold whitespace-nowrap"
                        style={{ backgroundColor: `${f.color}15`, color: f.color }}
                      >
                        {f.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-slate-100 bg-slate-50/60 p-3.5">
                <div className="flex items-center gap-2 mb-3">
                  <i className="ri-git-branch-line w-4 h-4 flex items-center justify-center text-[#E11D48]" />
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Attack Path 01
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-1.5">
                  {attackPath.map((node, i) => (
                    <div key={node} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5">
                      <span className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-600 text-center sm:text-left">
                        {node}
                      </span>
                      {i < attackPath.length - 1 && (
                        <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center text-slate-300 rotate-90 sm:rotate-0 self-center" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex items-start gap-2 mt-3">
                  <i className="ri-error-warning-line w-4 h-4 flex items-center justify-center text-[#EA580C] shrink-0" />
                  <p className="text-[11px] text-slate-500">
                    Business impact: Potential customer data exposure
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-lg border border-emerald-100 bg-emerald-50/50 px-3.5 py-3">
                <i className="ri-shield-check-line w-4 h-4 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-semibold text-emerald-700">Controlled &amp; authorised</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Every assessment operates within a written scope defining approved systems,
                    testing boundaries and permitted activity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}