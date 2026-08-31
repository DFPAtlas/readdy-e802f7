'use client';

import { motion } from '@/components/motion';

const stages = [
  { title: 'Website', icon: 'ri-global-line', desc: 'A professional site that presents your business and attracts customers.' },
  { title: 'Lead Capture', icon: 'ri-inbox-line', desc: 'Turn visitors into enquiries with forms, quotes and follow-ups.' },
  { title: 'Customer Portal', icon: 'ri-dashboard-line', desc: 'Give clients a secure space to track projects, documents and invoices.' },
  { title: 'Business Automation', icon: 'ri-settings-3-line', desc: 'Automate repetitive admin, workflows and notifications.' },
  { title: 'Integrated Platform', icon: 'ri-node-tree', desc: 'Connect your website, portal and tools into one system.' },
  { title: 'SaaS Product', icon: 'ri-rocket-line', desc: 'Package your platform as a product others can subscribe to.' },
];

export default function JourneySection() {
  return (
    <section className="py-24 px-6 bg-[#060F1E] relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(6,182,212,0.05) 0%, transparent 60%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#06B6D4] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Website to business system journey
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            One project can grow into a platform.
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Digital Footprint projects are designed to expand as your business develops.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-7 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#06B6D4]/30 to-transparent" />
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 lg:gap-5">
            {stages.map((stage, i) => (
              <motion.div
                key={stage.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="relative flex lg:flex-col items-start lg:items-center gap-4 lg:gap-0 lg:text-center"
              >
                {i < stages.length - 1 && (
                  <div className="lg:hidden absolute left-6 top-12 bottom-[-2.5rem] w-px bg-white/10" aria-hidden="true" />
                )}
                <div className="relative z-10 w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-[#0A1628] border border-[#06B6D4]/30 flex items-center justify-center shrink-0">
                  <i className={`${stage.icon} text-xl w-6 h-6 flex items-center justify-center text-[#06B6D4]`} />
                </div>
                <div className="lg:mt-5">
                  <span className="block text-xs font-semibold text-[#06B6D4] mb-1">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-lg font-bold text-white">{stage.title}</h3>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed max-w-[220px] mx-auto">{stage.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-slate-400 max-w-2xl mx-auto mt-16 leading-relaxed"
        >
          You do not need to build everything at once. Digital Footprint can start with the system
          your business needs today and expand it as your requirements grow.
        </motion.p>
      </div>
    </section>
  );
}