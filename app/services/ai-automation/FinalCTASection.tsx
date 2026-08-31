'use client';

import { motion } from '@/components/motion';
import Link from 'next/link';

export default function FinalCTASection() {
  return (
    <section className="py-24 px-6 bg-[#060F1E] relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(124,58,237,0.08) 0%, transparent 60%)' }} />
      <div className="absolute inset-0 opacity-[0.01]" style={{ backgroundImage: 'radial-gradient(circle, rgba(124,58,237,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-px bg-gradient-to-r from-transparent via-[#7C3AED]/25 to-transparent" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">
            Have a process that takes too much time?
          </h2>
          <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
            Show us how the process works today. We can help identify where automation or AI could
            make it simpler.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact?need=automation&need_label=AI%20and%20Automation"
              className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-white overflow-hidden whitespace-nowrap cursor-pointer transition-all duration-300 bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] hover:-translate-y-0.5 shadow-lg shadow-[#F97316]/15 hover:shadow-xl hover:shadow-[#F97316]/25 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:ring-offset-2 focus:ring-offset-[#060F1E]"
            >
              <span className="relative z-10">Discuss AI &amp; Automation</span>
              <i className="ri-arrow-right-line w-5 h-5 flex items-center justify-center relative z-10 group-hover:translate-x-0.5 transition-transform duration-200" />
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Link>
            <Link
              href="/services/websites-saas"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-slate-200 border border-white/15 hover:border-[#06B6D4]/50 hover:text-[#06B6D4] transition-all duration-300 whitespace-nowrap cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:ring-offset-2 focus:ring-offset-[#060F1E]"
            >
              Explore Websites &amp; SaaS
              <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}