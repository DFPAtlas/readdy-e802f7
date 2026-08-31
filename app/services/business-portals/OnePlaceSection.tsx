'use client';

import { motion } from '@/components/motion';

const before = [
  { label: 'Email chains', icon: 'ri-mail-line' },
  { label: 'Shared spreadsheets', icon: 'ri-table-line' },
  { label: 'Paper forms', icon: 'ri-file-text-line' },
  { label: 'Messaging apps', icon: 'ri-chat-3-line' },
  { label: 'Separate documents', icon: 'ri-folder-line' },
  { label: 'Manual status updates', icon: 'ri-edit-line' },
];

const after = [
  { label: 'Users', icon: 'ri-user-line' },
  { label: 'Documents', icon: 'ri-file-list-3-line' },
  { label: 'Messages', icon: 'ri-message-3-line' },
  { label: 'Tasks', icon: 'ri-task-line' },
  { label: 'Payments', icon: 'ri-bank-card-line' },
  { label: 'Reporting', icon: 'ri-bar-chart-line' },
  { label: 'Workflows', icon: 'ri-flow-chart' },
];

export default function OnePlaceSection() {
  return (
    <section className="py-24 px-6 bg-[#060F1E] relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(16,185,129,0.06) 0%, transparent 60%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#10B981] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            One place for business activity
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Replace disconnected tools with one structured workspace
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-6 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <i className="ri-mist-line w-5 h-5 flex items-center justify-center text-slate-400" />
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Before</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {before.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3 opacity-80"
                >
                  <i className={`${item.icon} w-4 h-4 flex items-center justify-center text-slate-500 shrink-0`} />
                  <span className="text-xs text-slate-400">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center"
            aria-hidden="true"
          >
            <div className="lg:rotate-0 rotate-90">
              <i className="ri-arrow-right-line text-3xl w-8 h-8 flex items-center justify-center text-[#10B981]" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-[#10B981]/30 bg-[#10B981]/[0.04] p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <i className="ri-dashboard-line w-5 h-5 flex items-center justify-center text-[#10B981]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Business Portal</h3>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 px-2.5 py-0.5 text-[10px] font-semibold text-[#10B981]">
                <i className="ri-lock-line w-3 h-3 flex items-center justify-center" />
                Connected
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5 justify-center">
              {after.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 rounded-full border border-[#10B981]/25 bg-white/[0.03] px-3.5 py-2"
                >
                  <i className={`${item.icon} w-4 h-4 flex items-center justify-center text-[#10B981] shrink-0`} />
                  <span className="text-xs text-slate-200">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-slate-400 max-w-2xl mx-auto mt-14 leading-relaxed"
        >
          The aim is not to remove every system a business uses. A portal can provide one clear
          interface while connecting to the systems already running behind it.
        </motion.p>
      </div>
    </section>
  );
}