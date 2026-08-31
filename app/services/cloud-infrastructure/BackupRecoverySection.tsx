'use client';

import { motion } from '@/components/motion';

const steps = [
  { title: 'Production Data', icon: 'ri-database-2-line' },
  { title: 'Primary Backup', icon: 'ri-hard-drive-2-line' },
  { title: 'Secondary / Off-Site Copy', icon: 'ri-cloud-line' },
  { title: 'Recovery Process', icon: 'ri-restart-line' },
  { title: 'Restore & Verify', icon: 'ri-check-double-line' },
];

const questions = [
  {
    title: 'What Is Protected?',
    icon: 'ri-file-search-line',
    color: '#3B82F6',
    desc: 'Identify important systems, applications, configurations and data.',
  },
  {
    title: 'How Often?',
    icon: 'ri-time-line',
    color: '#06B6D4',
    desc: 'Determine appropriate backup frequency based on how quickly information changes.',
  },
  {
    title: 'Where Is It Stored?',
    icon: 'ri-map-pin-line',
    color: '#10B981',
    desc: 'Avoid relying entirely on the same system or location as the production data.',
  },
  {
    title: 'Can It Be Restored?',
    icon: 'ri-refresh-line',
    color: '#F97316',
    desc: 'Backups are only useful if recovery procedures can be tested and understood.',
  },
];

export default function BackupRecoverySection() {
  return (
    <section className="py-24 px-6 bg-[#060F1E] relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(59,130,246,0.06) 0%, transparent 60%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#3B82F6] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Backup &amp; recovery
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Plan for failure before failure happens.
          </h2>
        </motion.div>

        <div className="relative max-w-4xl mx-auto mb-16">
          <div className="hidden lg:block absolute top-7 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3B82F6]/30 to-transparent" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="relative flex lg:flex-col items-start lg:items-center gap-4 lg:gap-0 lg:text-center"
              >
                <div className="relative z-10 w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-[#0A1628] border border-[#3B82F6]/30 flex items-center justify-center shrink-0">
                  <i className={`${step.icon} text-xl w-6 h-6 flex items-center justify-center text-[#3B82F6]`} />
                </div>
                <div className="lg:mt-5">
                  <span className="block text-xs font-semibold text-[#3B82F6] mb-1">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-sm font-bold text-white max-w-[160px] mx-auto leading-snug">{step.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {questions.map((q, i) => (
            <motion.div
              key={q.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.15] hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${q.color}18` }}
              >
                <i className={`${q.icon} text-lg w-5 h-5 flex items-center justify-center`} style={{ color: q.color }} />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{q.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{q.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}