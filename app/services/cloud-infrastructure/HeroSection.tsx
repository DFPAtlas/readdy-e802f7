'use client';

import { motion } from '@/components/motion';
import Link from 'next/link';
import HeroLightLines from '@/components/HeroLightLines';

const nodes = [
  { label: 'Cloud', icon: 'ri-cloud-line', color: '#3B82F6' },
  { label: 'Servers', icon: 'ri-server-line', color: '#06B6D4' },
  { label: 'Firewall', icon: 'ri-shield-flash-line', color: '#F97316' },
  { label: 'Network', icon: 'ri-git-branch-line', color: '#7C3AED' },
  { label: 'Devices', icon: 'ri-computer-line', color: '#10B981' },
];

export default function HeroSection() {
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(59,130,246,0.08),transparent_60%)]" />
      <HeroLightLines />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-sm font-medium mb-6">
            <i className="ri-server-line w-4 h-4 flex items-center justify-center" />
            Cloud &amp; Infrastructure
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 text-slate-900 max-w-4xl mx-auto">
            The technology behind your business needs a strong foundation.
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
            Digital Footprint helps organisations design, connect, secure and support the cloud,
            server and network infrastructure that keeps their websites, software and teams
            operating.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-9">
            <Link
              href="/contact?need=infrastructure&need_label=Cloud%20and%20Infrastructure"
              className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-white overflow-hidden whitespace-nowrap cursor-pointer transition-all duration-300 bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] hover:-translate-y-0.5 shadow-lg shadow-[#F97316]/15 hover:shadow-xl hover:shadow-[#F97316]/25 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:ring-offset-2 focus:ring-offset-white"
            >
              <span className="relative z-10">Discuss Your Infrastructure</span>
              <i className="ri-arrow-right-line w-5 h-5 flex items-center justify-center relative z-10 group-hover:translate-x-0.5 transition-transform duration-200" />
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-slate-700 border border-slate-200 bg-white hover:border-[#3B82F6] hover:text-[#3B82F6] transition-all duration-300 whitespace-nowrap cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 focus:ring-offset-white"
            >
              View All Services
              <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center" />
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
              <div className="ml-3 flex-1 h-2 rounded-full bg-slate-200" />
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20 px-3 py-1 text-xs font-medium text-[#3B82F6]">
                <i className="ri-pulse-line w-3.5 h-3.5 flex items-center justify-center" />
                Connected system
              </span>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center gap-2 mb-5">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-200" />
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Infrastructure map</span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-200" />
              </div>

              <div className="relative">
                <div className="hidden sm:block absolute left-1/2 top-1/2 w-[80%] h-px bg-gradient-to-r from-[#3B82F6]/25 via-slate-200 to-[#3B82F6]/25 -translate-x-1/2 -translate-y-1/2" />

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {nodes.map((node, i) => (
                    <div
                      key={node.label}
                      className={`relative z-10 rounded-xl border border-slate-100 bg-white p-4 text-center shadow-sm ${i === 0 ? 'sm:col-start-2' : ''}`}
                    >
                      <div
                        className="w-10 h-10 rounded-lg mx-auto flex items-center justify-center mb-2"
                        style={{ backgroundColor: `${node.color}15` }}
                      >
                        <i className={`${node.icon} text-lg w-5 h-5 flex items-center justify-center`} style={{ color: node.color }} />
                      </div>
                      <span className="block text-xs font-semibold text-slate-600">{node.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-lg border border-slate-100 p-3 flex items-center gap-2.5">
                  <i className="ri-database-2-line text-[#3B82F6] w-4 h-4 flex items-center justify-center" />
                  <div className="flex-1">
                    <div className="h-2 w-full rounded-full bg-slate-200 mb-1.5" />
                    <div className="h-2 w-3/4 rounded-full bg-slate-200" />
                  </div>
                </div>
                <div className="rounded-lg border border-slate-100 p-3 flex items-center gap-2.5">
                  <i className="ri-eye-2-line text-[#10B981] w-4 h-4 flex items-center justify-center" />
                  <div className="flex-1">
                    <div className="h-2 w-full rounded-full bg-slate-200 mb-1.5" />
                    <div className="h-2 w-2/3 rounded-full bg-slate-200" />
                  </div>
                </div>
                <div className="rounded-lg border border-slate-100 p-3 flex items-center gap-2.5">
                  <i className="ri-archive-line text-[#F97316] w-4 h-4 flex items-center justify-center" />
                  <div className="flex-1">
                    <div className="h-2 w-full rounded-full bg-slate-200 mb-1.5" />
                    <div className="h-2 w-1/2 rounded-full bg-slate-200" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}