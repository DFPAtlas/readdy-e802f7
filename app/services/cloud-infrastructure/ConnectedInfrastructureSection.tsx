'use client';

import { motion } from '@/components/motion';

const layers = [
  { title: 'Users & Devices', icon: 'ri-computer-line', desc: 'Staff, customers and the devices they use.' },
  { title: 'Business Network', icon: 'ri-git-branch-line', desc: 'Switches, Wi-Fi and site connectivity.' },
  { title: 'Firewall & Secure Connectivity', icon: 'ri-shield-flash-line', desc: 'Boundaries, VPNs and access control.' },
  { title: 'Cloud / Servers', icon: 'ri-server-line', desc: 'Hosting, storage and computing resources.' },
  { title: 'Websites • Portals • Business Applications • AI', icon: 'ri-layout-grid-line', desc: 'The systems that run on top of it all.' },
];

export default function ConnectedInfrastructureSection() {
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
            Connected infrastructure
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Your systems are connected. Your infrastructure should be designed that way.
          </h2>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {layers.map((layer, i) => (
            <div key={layer.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5"
              >
                <div className="w-11 h-11 rounded-xl bg-[#3B82F6]/15 flex items-center justify-center shrink-0">
                  <i className={`${layer.icon} text-lg w-5 h-5 flex items-center justify-center text-[#3B82F6]`} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{layer.title}</h3>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">{layer.desc}</p>
                </div>
              </motion.div>
              {i < layers.length - 1 && (
                <div className="flex justify-center py-1.5" aria-hidden="true">
                  <i className="ri-arrow-down-line w-5 h-5 flex items-center justify-center text-[#3B82F6]/60" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-start gap-3 rounded-2xl border border-[#10B981]/25 bg-[#10B981]/[0.05] p-4"
          >
            <i className="ri-eye-2-line text-lg w-5 h-5 flex items-center justify-center text-[#10B981] shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-white">Monitoring</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Watching the layers so problems are noticed.</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="flex items-start gap-3 rounded-2xl border border-[#F97316]/25 bg-[#F97316]/[0.05] p-4"
          >
            <i className="ri-archive-line text-lg w-5 h-5 flex items-center justify-center text-[#F97316] shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-white">Backup &amp; Recovery</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Protecting data and planning for recovery.</p>
            </div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-slate-400 max-w-2xl mx-auto mt-14 leading-relaxed"
        >
          Digital infrastructure is not just a server or a broadband connection. Applications,
          users, networks, security, cloud services and recovery processes all need to work
          together.
        </motion.p>
      </div>
    </section>
  );
}