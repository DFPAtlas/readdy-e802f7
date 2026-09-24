'use client';

import { motion } from '@/components/motion';
import Link from 'next/link';
import HeroLightLines from '@/components/HeroLightLines';

const findings = [
  { name: 'Authentication bypass on admin route', severity: 'Critical', color: '#DC2626' },
  { name: 'Unauthenticated API data exposure', severity: 'High', color: '#EA580C' },
  { name: 'Outdated dependency with known CVE', severity: 'Medium', color: '#CA8A04' },
  { name: 'Missing rate limiting on login', severity: 'Medium', color: '#CA8A04' },
];

export default function HeroSection() {
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
            AI Security Testing
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 text-slate-900 max-w-4xl mx-auto">
            Find your weaknesses before attackers do.
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
            Digital Footprint uses AI-driven attack simulation to probe your websites, applications,
            APIs and cloud systems the way a real adversary would — then tells you exactly what to
            fix, in plain English.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-9">
            <Link
              href="/contact?need=security&need_label=AI%20Security%20Testing"
              className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-white overflow-hidden whitespace-nowrap cursor-pointer transition-all duration-300 bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] hover:-translate-y-0.5 shadow-lg shadow-[#F97316]/15 hover:shadow-xl hover:shadow-[#F97316]/25 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:ring-offset-2 focus:ring-offset-white"
            >
              <span className="relative z-10">Request a Security Test</span>
              <i className="ri-arrow-right-line w-5 h-5 flex items-center justify-center relative z-10 group-hover:translate-x-0.5 transition-transform duration-200" />
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Link>
            <Link
              href="/services/cloud-infrastructure"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-slate-700 border border-slate-200 bg-white hover:border-[#E11D48] hover:text-[#E11D48] transition-all duration-300 whitespace-nowrap cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E11D48] focus:ring-offset-2 focus:ring-offset-white"
            >
              Explore Cyber Security
              <i className="ri-external-link-line w-4 h-4 flex items-center justify-center" />
            </Link>
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
              <span className="ml-3 text-xs font-medium text-slate-500">AI security assessment — running</span>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Attack surface coverage</span>
                <span className="text-[#E11D48]">87%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full w-[87%] rounded-full bg-gradient-to-r from-[#E11D48] to-[#F97316]" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Endpoints tested', value: '412', color: '#E11D48' },
                  { label: 'Attack paths', value: '68', color: '#F97316' },
                  { label: 'Issues found', value: '11', color: '#CA8A04' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg border border-slate-100 p-3">
                    <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

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
          </div>
        </motion.div>
      </div>
    </section>
  );
}