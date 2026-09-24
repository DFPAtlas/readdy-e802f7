'use client';

import { motion } from '@/components/motion';
import Link from 'next/link';

const related = [
  { title: 'Cloud & Infrastructure', icon: 'ri-cloud-line', color: '#3B82F6', desc: 'Servers, networks, firewalls and monitoring to harden what we test.', href: '/services/cloud-infrastructure' },
  { title: 'AI & Automation', icon: 'ri-robot-line', color: '#7C3AED', desc: 'Build AI agents and workflows on secure foundations from day one.', href: '/services/ai-automation' },
  { title: 'Websites & SaaS', icon: 'ri-code-s-slash-line', color: '#06B6D4', desc: 'Our development team can implement every fix we recommend.', href: '/services/websites-saas' },
];

export default function RelatedServicesSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Related services
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            Testing is only part of the picture
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {related.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                href={service.href}
                className="group block glass-card rounded-2xl p-6 h-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E11D48] focus:ring-offset-2 focus:ring-offset-white"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105"
                  style={{ backgroundColor: `${service.color}15` }}
                >
                  <i className={`${service.icon} text-xl w-6 h-6 flex items-center justify-center`} style={{ color: service.color }} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-[#E11D48] transition-colors">{service.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{service.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: service.color }}>
                  Learn more
                  <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-200" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}