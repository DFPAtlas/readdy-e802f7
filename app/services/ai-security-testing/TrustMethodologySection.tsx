'use client';

import type { ReactNode } from 'react';
import { motion } from '@/components/motion';
import MethodologyTimeline from './trust/MethodologyTimeline';
import RulesOfEngagementPanel from './trust/RulesOfEngagementPanel';
import HumanOversightFlow from './trust/HumanOversightFlow';
import CriticalFindingPanel from './trust/CriticalFindingPanel';
import SafeTestingPrinciples from './trust/SafeTestingPrinciples';
import TrustFAQ from './trust/TrustFAQ';
import TrustStrip from './trust/TrustStrip';

function Block({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 mb-2">{eyebrow}</h3>
      <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-5">{title}</h4>
      {children}
    </motion.div>
  );
}

export default function TrustMethodologySection() {
  return (
    <section className="py-24 px-6 bg-[#F7F9FC] relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
            How we work
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            Controlled testing. Clear boundaries. Human oversight.
          </h2>
          <p className="text-lg text-slate-500 max-w-3xl mx-auto leading-relaxed mb-4">
            Security testing should improve your security posture without creating unnecessary risk. Every Digital Footprint assessment begins with a defined scope, agreed rules of engagement and human oversight.
          </p>
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">
            <i className="ri-shield-check-line w-4 h-4 flex items-center justify-center text-[#E11D48]" aria-hidden="true" />
            No active testing begins until scope and authorisation have been agreed
          </span>
        </motion.div>

        <div className="space-y-14">
          <Block eyebrow="Methodology" title="Six controlled steps from scope to retest">
            <MethodologyTimeline />
          </Block>

          <Block eyebrow="Boundaries" title="Defined before any testing begins">
            <RulesOfEngagementPanel />
          </Block>

          <Block eyebrow="Human oversight" title="Where AI assists, and where people decide">
            <HumanOversightFlow />
          </Block>

          <CriticalFindingPanel />

          <Block eyebrow="Safe testing" title="How we reduce risk to your systems">
            <SafeTestingPrinciples />
          </Block>

          <TrustFAQ />

          <TrustStrip />
        </div>
      </div>
    </section>
  );
}