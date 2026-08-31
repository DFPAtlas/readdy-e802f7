'use client';

import { motion } from '@/components/motion';
import Link from 'next/link';
import HeroLightLines from '@/components/HeroLightLines';

export default function HeroSection() {
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(6,182,212,0.07),transparent_60%)]" />
      <HeroLightLines />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#06B6D4]/10 border border-[#06B6D4]/20 text-[#06B6D4] text-sm font-medium mb-6">
            <i className="ri-code-s-slash-line w-4 h-4 flex items-center justify-center" />
            Websites &amp; SaaS
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 text-slate-900 max-w-4xl mx-auto">
            Digital platforms built around your business.
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
            From professional business websites to complete SaaS platforms, Digital Footprint
            designs and develops systems that help organisations attract customers, manage
            operations and grow.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-9">
            <Link
              href="/contact?need=website&need_label=Websites%20and%20SaaS"
              className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-white overflow-hidden whitespace-nowrap cursor-pointer transition-all duration-300 bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] hover:-translate-y-0.5 shadow-lg shadow-[#F97316]/15 hover:shadow-xl hover:shadow-[#F97316]/25 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:ring-offset-2 focus:ring-offset-white"
            >
              <span className="relative z-10">Discuss Your Project</span>
              <i className="ri-arrow-right-line w-5 h-5 flex items-center justify-center relative z-10 group-hover:translate-x-0.5 transition-transform duration-200" />
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Link>
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-slate-700 border border-slate-200 bg-white hover:border-[#06B6D4] hover:text-[#06B6D4] transition-all duration-300 whitespace-nowrap cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:ring-offset-2 focus:ring-offset-white"
            >
              View Our Work
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
              <div className="ml-3 flex-1 h-2 rounded-full bg-slate-200" />
            </div>
            <div className="flex">
              <div className="hidden sm:block w-40 border-r border-slate-100 bg-slate-50/50 p-4 space-y-2">
                <div className="h-2.5 w-16 rounded-full bg-[#06B6D4]/30" />
                <div className="h-2 w-full rounded-full bg-slate-200" />
                <div className="h-2 w-full rounded-full bg-slate-200" />
                <div className="h-2 w-3/4 rounded-full bg-slate-200" />
                <div className="h-2 w-5/6 rounded-full bg-slate-200" />
              </div>
              <div className="flex-1 p-5 space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  {['#06B6D4', '#A855F7', '#10B981'].map((c) => (
                    <div key={c} className="rounded-lg border border-slate-100 p-3 space-y-2">
                      <div className="h-2 w-10 rounded-full" style={{ backgroundColor: c }} />
                      <div className="h-2 w-full rounded-full bg-slate-200" />
                      <div className="h-2 w-2/3 rounded-full bg-slate-200" />
                    </div>
                  ))}
                </div>
                <div className="h-24 rounded-lg bg-slate-100" />
                <div className="flex gap-2">
                  <div className="h-2 w-1/3 rounded-full bg-slate-200" />
                  <div className="h-2 w-1/4 rounded-full bg-slate-200" />
                  <div className="h-2 w-1/5 rounded-full bg-slate-200" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}