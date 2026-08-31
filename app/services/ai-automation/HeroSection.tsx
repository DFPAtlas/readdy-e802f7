'use client';

import { motion } from '@/components/motion';
import Link from 'next/link';
import HeroLightLines from '@/components/HeroLightLines';

const nodes = [
  { label: 'AI Agents', icon: 'ri-robot-line', color: '#7C3AED' },
  { label: 'Workflows', icon: 'ri-flow-chart', color: '#06B6D4' },
  { label: 'Business Systems', icon: 'ri-database-2-line', color: '#10B981' },
  { label: 'Human Approval', icon: 'ri-shield-user-line', color: '#F97316' },
  { label: 'Data', icon: 'ri-stack-line', color: '#A855F7' },
];

export default function HeroSection() {
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(124,58,237,0.08),transparent_60%)]" />
      <HeroLightLines />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[#7C3AED] text-sm font-medium mb-6">
            <i className="ri-robot-line w-4 h-4 flex items-center justify-center" />
            AI &amp; Automation
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 text-slate-900 max-w-4xl mx-auto">
            Automate the work. Keep people in control.
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
            Digital Footprint creates AI agents and connected automation systems that help
            businesses handle repetitive tasks, move information between systems and support
            customers without losing human oversight.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-9">
            <Link
              href="/contact?need=automation&need_label=AI%20and%20Automation"
              className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-white overflow-hidden whitespace-nowrap cursor-pointer transition-all duration-300 bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] hover:-translate-y-0.5 shadow-lg shadow-[#F97316]/15 hover:shadow-xl hover:shadow-[#F97316]/25 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:ring-offset-2 focus:ring-offset-white"
            >
              <span className="relative z-10">Discuss AI &amp; Automation</span>
              <i className="ri-arrow-right-line w-5 h-5 flex items-center justify-center relative z-10 group-hover:translate-x-0.5 transition-transform duration-200" />
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-slate-700 border border-slate-200 bg-white hover:border-[#7C3AED] hover:text-[#7C3AED] transition-all duration-300 whitespace-nowrap cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:ring-offset-2 focus:ring-offset-white"
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
          <div className="rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/5 overflow-hidden bg-[#0A1628] p-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {nodes.map((node, i) => (
                <div key={node.label} className="relative">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center hover:border-white/25 transition-colors">
                    <div
                      className="w-11 h-11 rounded-xl mx-auto flex items-center justify-center mb-3"
                      style={{ backgroundColor: `${node.color}20` }}
                    >
                      <i className={`${node.icon} text-lg w-5 h-5 flex items-center justify-center`} style={{ color: node.color }} />
                    </div>
                    <span className="text-xs font-semibold text-slate-200 whitespace-nowrap">{node.label}</span>
                  </div>
                  {i < nodes.length - 1 && (
                    <div className="hidden sm:block absolute top-1/2 -right-4 w-4 h-px bg-gradient-to-r from-white/20 to-transparent" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-8 flex items-center justify-center gap-3">
              <div className="h-2 w-2 rounded-full bg-[#06B6D4] animate-pulse" />
              <p className="text-xs text-slate-400">
                Connected agents, workflows, systems, approvals and data — orchestrated together.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}