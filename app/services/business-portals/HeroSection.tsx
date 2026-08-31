'use client';

import { motion } from '@/components/motion';
import Link from 'next/link';
import HeroLightLines from '@/components/HeroLightLines';

const roles = [
  { label: 'Customers', icon: 'ri-user-heart-line', color: '#10B981' },
  { label: 'Staff', icon: 'ri-team-line', color: '#06B6D4' },
  { label: 'Managers', icon: 'ri-bar-chart-line', color: '#F97316' },
  { label: 'Admins', icon: 'ri-shield-user-line', color: '#7C3AED' },
];

export default function HeroSection() {
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(16,185,129,0.08),transparent_60%)]" />
      <HeroLightLines />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-sm font-medium mb-6">
            <i className="ri-dashboard-line w-4 h-4 flex items-center justify-center" />
            Business Portals
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 text-slate-900 max-w-4xl mx-auto">
            Give everyone the right information in one place.
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
            Digital Footprint builds secure customer, staff and business portals that bring
            documents, communication, workflows and operational information together in one
            structured digital workspace.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-9">
            <Link
              href="/contact?need=portal&need_label=Business%20Portal"
              className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-white overflow-hidden whitespace-nowrap cursor-pointer transition-all duration-300 bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] hover:-translate-y-0.5 shadow-lg shadow-[#F97316]/15 hover:shadow-xl hover:shadow-[#F97316]/25 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:ring-offset-2 focus:ring-offset-white"
            >
              <span className="relative z-10">Discuss Your Portal</span>
              <i className="ri-arrow-right-line w-5 h-5 flex items-center justify-center relative z-10 group-hover:translate-x-0.5 transition-transform duration-200" />
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-slate-700 border border-slate-200 bg-white hover:border-[#10B981] hover:text-[#10B981] transition-all duration-300 whitespace-nowrap cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:ring-offset-2 focus:ring-offset-white"
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
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 px-3 py-1 text-xs font-medium text-[#10B981]">
                <i className="ri-lock-line w-3.5 h-3.5 flex items-center justify-center" />
                Secure workspace
              </span>
            </div>
            <div className="flex">
              <div className="hidden sm:block w-44 border-r border-slate-100 bg-slate-50/50 p-4 space-y-2">
                <div className="h-2.5 w-20 rounded-full bg-[#10B981]/40" />
                <div className="h-2 w-full rounded-full bg-slate-200" />
                <div className="h-2 w-full rounded-full bg-slate-200" />
                <div className="h-2 w-3/4 rounded-full bg-slate-200" />
                <div className="h-2 w-5/6 rounded-full bg-slate-200" />
                <div className="h-2 w-2/3 rounded-full bg-slate-200" />
              </div>
              <div className="flex-1 p-5 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="h-3 w-28 rounded-full bg-slate-300" />
                  <div className="flex gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                      <i className="ri-checkbox-circle-line w-3 h-3 flex items-center justify-center" />
                      Active
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700">
                      <i className="ri-time-line w-3 h-3 flex items-center justify-center" />
                      Pending
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {roles.map((role) => (
                    <div key={role.label} className="rounded-lg border border-slate-100 p-3 space-y-2 text-center">
                      <div
                        className="w-8 h-8 rounded-lg mx-auto flex items-center justify-center"
                        style={{ backgroundColor: `${role.color}18` }}
                      >
                        <i className={`${role.icon} text-sm w-4 h-4 flex items-center justify-center`} style={{ color: role.color }} />
                      </div>
                      <span className="block text-[11px] font-semibold text-slate-600">{role.label}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-slate-100 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <i className="ri-message-3-line text-[#10B981] w-4 h-4 flex items-center justify-center" />
                      <span className="text-[11px] font-semibold text-slate-600">Messages</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2 w-full rounded-full bg-slate-200" />
                      <div className="h-2 w-3/4 rounded-full bg-slate-200" />
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-100 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <i className="ri-file-list-3-line text-[#06B6D4] w-4 h-4 flex items-center justify-center" />
                      <span className="text-[11px] font-semibold text-slate-600">Documents</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2 w-full rounded-full bg-slate-200" />
                      <div className="h-2 w-1/2 rounded-full bg-slate-200" />
                    </div>
                  </div>
                </div>
                <div className="h-20 rounded-lg bg-slate-100 flex items-center justify-center">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-24 rounded-full bg-slate-300" />
                    <div className="h-8 w-px bg-slate-200" />
                    <div className="h-2 w-16 rounded-full bg-slate-300" />
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