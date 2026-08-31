'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from './HeroSection';
import WhatWeBuildSection from './WhatWeBuildSection';
import JourneySection from './JourneySection';
import HowWeBuildSection from './HowWeBuildSection';
import IntegrationsSection from './IntegrationsSection';
import ProjectTypesSection from './ProjectTypesSection';
import WhyDFPSection from './WhyDFPSection';
import RelatedServicesSection from './RelatedServicesSection';
import FinalCTASection from './FinalCTASection';

export default function WebsitesSaaSClient() {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 bg-white text-slate-800">
        <HeroSection />
        <WhatWeBuildSection />
        <JourneySection />
        <HowWeBuildSection />
        <IntegrationsSection />
        <ProjectTypesSection />
        <WhyDFPSection />
        <RelatedServicesSection />
        <FinalCTASection />
      </div>
      <Footer />
    </>
  );
}