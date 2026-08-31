'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from './HeroSection';
import WhatWeCanAutomateSection from './WhatWeCanAutomateSection';
import AiAgentsSection from './AiAgentsSection';
import AutomationFlowSection from './AutomationFlowSection';
import HumanInLoopSection from './HumanInLoopSection';
import SystemConnectionsSection from './SystemConnectionsSection';
import ExampleJourneysSection from './ExampleJourneysSection';
import StartSmallSection from './StartSmallSection';
import SuitableProjectsSection from './SuitableProjectsSection';
import WhyDFPSection from './WhyDFPSection';
import RelatedServicesSection from './RelatedServicesSection';
import FinalCTASection from './FinalCTASection';

export default function AiAutomationClient() {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 bg-white text-slate-800">
        <HeroSection />
        <WhatWeCanAutomateSection />
        <AiAgentsSection />
        <AutomationFlowSection />
        <HumanInLoopSection />
        <SystemConnectionsSection />
        <ExampleJourneysSection />
        <StartSmallSection />
        <SuitableProjectsSection />
        <WhyDFPSection />
        <RelatedServicesSection />
        <FinalCTASection />
      </div>
      <Footer />
    </>
  );
}