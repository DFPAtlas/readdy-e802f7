'use client';

import { motion } from '@/components/motion';
import Link from 'next/link';
import { attackSurfaceNodes, attackSurfaceOutputs } from './security-enrichment-data';

const legend = [
  { label: 'Known', color: '#10B981' },
  { label: 'Unexpected', color: '#F97316' },
  { label: 'Review required', color: '#CA8A04' },
  { label: 'Exposed', color: '#DC2626' },
];

export default function AttackSurfaceSection() {
  return (
    <>
      <section className="py-24 px-6 bg-[#F7F9FC] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(225,29,72,0.05),transparent_55%)]" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
              External view
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
              What does your business look like from the outside?
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Digital Footprint builds an authorised external view of your organisation before deeper
              testing begins.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-6 md:p-10"
          >
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-10">
              {legend.map((item) => (
                <span key={item.label} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.label}
                </span>
              ))}
            </div>

            <div className="flex justify-center">
              <div className="relative rounded-2xl border border-[#E11D48]/20 bg-gradient-to-b from-[#E11D48]/[0.06] to-transparent px-8 py-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#E11D48]/10 flex items-center justify-center mx-auto mb-3">
                  <i className="ri-building-2-line text-2xl w-7 h-7 flex items-center justify-center text-[#E11D48]" />
                </div>
                <p className="text-base font-bold text-slate-900">Northwind Trading Ltd</p>
                <p className="text-xs text-slate-500 mt-1">Fictional company · Illustrative</p>
              </div>
            </div>

            <div className="flex justify-center">
              <span className="w-px h-10 bg-gradient-to-b from-[#E11D48]/30 to-slate-200" />
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-10" />

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {attackSurfaceNodes.map((node, i) => (
                <motion.div
                  key={node.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="relative rounded-2xl border border-slate-200 bg-white p-4 text-center hover:-translate-y-1 hover:border-slate-300 transition-all duration-300"
                >
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 w-px h-5 bg-slate-200" />
                  <span className="absolute -top-[22px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: node.color }} />
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                    style={{ backgroundColor: `${node.color}12` }}
                  >
                    <i className={`${node.icon} text-lg w-5 h-5 flex items-center justify-center`} style={{ color: node.color }} />
                  </div>
                  <p className="text-sm font-semibold text-slate-700 leading-snug mb-2">{node.label}</p>
                  <span
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-full"
                    style={{ color: node.color, backgroundColor: `${node.color}12` }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: node.color }} />
                    {node.status}
                  </span>
                </motion.div>
              ))}
            </div>

            <p className="text-center text-xs text-slate-400 mt-8">
              Illustrative attack surface — no Digital Footprint customer data is shown.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E11D48]/8 border border-[#E11D48]/15 mb-5">
              <i className="ri-focus-3-line w-4 h-4 flex items-center justify-center text-[#E11D48]" />
              <span className="text-xs font-semibold text-[#E11D48] uppercase tracking-[0.12em]">DFP Attack Surface Discovery</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-5">
              DFP Attack Surface Discovery
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed mb-8">
              Our reconnaissance and security agents build an inventory of authorised externally
              visible assets, helping uncover systems the organisation may have forgotten or does not
              realise are exposed.
            </p>
            <Link
              href="/contact?need=security&need_label=Attack%20Surface%20Assessment"
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-[#E11D48] to-[#BE123C] hover:from-[#BE123C] hover:to-[#9F1239] hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap cursor-pointer shadow-lg shadow-[#E11D48]/15 focus:outline-none focus:ring-2 focus:ring-[#E11D48] focus:ring-offset-2"
            >
              Assess My Attack Surface
              <i className="ri-arrow-right-line w-5 h-5 flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {attackSurfaceOutputs.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="glass-card rounded-2xl p-5 flex items-center gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-slate-900/5 flex items-center justify-center shrink-0">
                  <i className={`${item.icon} text-lg w-5 h-5 flex items-center justify-center text-slate-700`} />
                </div>
                <p className="text-sm font-semibold text-slate-700 leading-snug">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}