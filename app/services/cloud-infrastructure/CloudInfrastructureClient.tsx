'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from './HeroSection';
import WhatWeSupportSection from './WhatWeSupportSection';
import ConnectedInfrastructureSection from './ConnectedInfrastructureSection';
import CloudPlatformsSection from './CloudPlatformsSection';
import NetworkInfrastructureSection from './NetworkInfrastructureSection';
import CyberSecuritySection from './CyberSecuritySection';
import BackupRecoverySection from './BackupRecoverySection';
import MonitoringSupportSection from './MonitoringSupportSection';
import PhysicalSecuritySection from './PhysicalSecuritySection';
import InfrastructureJourneySection from './InfrastructureJourneySection';
import WhoForSection from './WhoForSection';
import WhyDFPSection from './WhyDFPSection';
import RelatedServicesSection from './RelatedServicesSection';
import FinalCTASection from './FinalCTASection';

export default function CloudInfrastructureClient() {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 bg-white text-slate-800">
        <HeroSection />
        <WhatWeSupportSection />
        <ConnectedInfrastructureSection />
        <CloudPlatformsSection />
        <NetworkInfrastructureSection />
        <CyberSecuritySection />
        <BackupRecoverySection />
        <MonitoringSupportSection />
        <PhysicalSecuritySection />
        <InfrastructureJourneySection />
        <WhoForSection />
        <WhyDFPSection />
        <RelatedServicesSection />
        <FinalCTASection />
      </div>
      <Footer />
    </>
  );
}