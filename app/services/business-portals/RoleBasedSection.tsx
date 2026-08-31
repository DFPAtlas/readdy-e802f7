'use client';

import { motion } from '@/components/motion';

const roles = [
  {
    title: 'Customer',
    icon: 'ri-user-heart-line',
    color: '#10B981',
    label: 'Can see',
    items: ['Their account', 'Their documents', 'Their messages', 'Their jobs or projects', 'Their invoices'],
  },
  {
    title: 'Staff',
    icon: 'ri-team-line',
    color: '#06B6D4',
    label: 'Can see',
    items: ['Assigned work', 'Customer information', 'Internal tasks', 'Documents', 'Operational tools'],
  },
  {
    title: 'Manager',
    icon: 'ri-bar-chart-line',
    color: '#F97316',
    label: 'Can see',
    items: ['Team activity', 'Workload', 'Approvals', 'Reports', 'Exceptions'],
  },
  {
    title: 'Administrator',
    icon: 'ri-shield-user-line',
    color: '#7C3AED',
    label: 'Can see',
    items: ['Users', 'Permissions', 'Configuration', 'Reporting', 'System management'],
  },
];

export default function RoleBasedSection() {
  return (
    <section className="py-24 px-6 bg-[#0A1628] relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 100%, rgba(16,185,129,0.05) 0%, transparent 60%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#10B981] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Role-based experience
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Different users. Different access.
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            One portal can present different tools and information depending on who is signed in and
            what their role requires.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {roles.map((role, i) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.15] hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: `${role.color}18` }}
              >
                <i className={`${role.icon} text-xl w-6 h-6 flex items-center justify-center`} style={{ color: role.color }} />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{role.title}</h3>
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-3">{role.label}</p>
              <ul className="space-y-2">
                {role.items.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-slate-400">
                    <i className="ri-check-line w-4 h-4 flex items-center justify-center shrink-0" style={{ color: role.color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center"
        >
          <div className="inline-flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-6 py-4 max-w-2xl">
            <i className="ri-shield-check-line text-xl w-6 h-6 flex items-center justify-center text-[#10B981] shrink-0 mt-0.5" />
            <p className="text-sm text-slate-300 leading-relaxed">
              Access should be based on what each person needs to do, not simply whether they have
              an account.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}