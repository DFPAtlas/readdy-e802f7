'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from './HeroSection';
import WhatWeTestSection from './WhatWeTestSection';
import HowItWorksSection from './HowItWorksSection';
import ThreatCoverageSection from './ThreatCoverageSection';
import DeliverablesSection from './DeliverablesSection';
import WhyAiSection from './WhyAiSection';
import RelatedServicesSection from './RelatedServicesSection';
import FinalCTASection from './FinalCTASection';

export default function AiSecurityTestingClient() {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 bg-white text-slate-800">
        <HeroSection />
        <WhatWeTestSection />
        <HowItWorksSection />
        <ThreatCoverageSection />
        <DeliverablesSection />
        <WhyAiSection />
        <RelatedServicesSection />
        <FinalCTASection />
      </div>
      <Footer />
    </>
  );
}