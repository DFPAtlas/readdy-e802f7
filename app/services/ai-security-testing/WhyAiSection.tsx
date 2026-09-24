'use client';

import { motion } from '@/components/motion';

const points = [
  { title: 'Continuous, not annual', icon: 'ri-loop-right-line', color: '#E11D48', desc: 'AI agents keep probing your systems as they change, rather than once a year.' },
  { title: 'Finds logic flaws', icon: 'ri-lightbulb-line', color: '#F97316', desc: 'AI explores unusual paths and business logic abuse that fixed scanners miss.' },
  { title: 'No false alarms', icon: 'ri-check-double-line', color: '#10B981', desc: 'Automated discovery is always confirmed by a human before it reaches your report.' },
  { title: 'Built alongside your systems', icon: 'ri-node-tree', color: '#0891B2', desc: 'The same team that builds your platforms tests them and can fix what we find.' },
];

export default function WhyAiSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_50%,rgba(225,29,72,0.04),transparent_55%)]" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Why AI-driven testing
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            Faster coverage, sharper findings.
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            AI lets us test far more, far more often — while keeping a human in the loop on every
            conclusion we give you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((point, i) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group glass-card rounded-2xl p-6"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105"
                style={{ backgroundColor: `${point.color}15` }}
              >
                <i className={`${point.icon} text-xl w-6 h-6 flex items-center justify-center`} style={{ color: point.color }} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{point.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{point.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 rounded-2xl border border-slate-200 bg-slate-50/60 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#E11D48]/10 flex items-center justify-center shrink-0">
              <i className="ri-lock-2-line text-xl w-6 h-6 flex items-center justify-center text-[#E11D48]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Testing done responsibly</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xl">
                Every engagement runs under a written scope and authorisation. We work on staging
                copies where possible, never disrupt live services, and handle all data under strict
                confidentiality.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-600 whitespace-nowrap">
            <i className="ri-shield-check-line w-4 h-4 flex items-center justify-center text-[#E11D48]" />
            Authorised testing only
          </span>
        </motion.div>
      </div>
    </section>
  );
}