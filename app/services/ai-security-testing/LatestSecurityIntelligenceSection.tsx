'use client';

import { motion } from '@/components/motion';
import SecurityIntelligenceCard from './SecurityIntelligenceCard';
import { securityIntelligence } from './security-enrichment-data';

export default function LatestSecurityIntelligenceSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(225,29,72,0.04),transparent_55%)]" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            Security intelligence
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            Latest Security Intelligence
          </h2>
          <p className="text-lg text-slate-500 max-w-3xl mx-auto leading-relaxed">
            Short practical updates from Digital Footprint on attack surface, identity, cloud,
            application and AI security.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {securityIntelligence.map((item) => (
            <SecurityIntelligenceCard key={item.title} item={item} />
          ))}
        </div>

        <p className="text-center text-xs text-slate-400 mt-10 max-w-2xl mx-auto leading-relaxed">
          Security Intelligence is editorial content from Digital Footprint and is updated periodically.
        </p>
      </div>
    </section>
  );
}