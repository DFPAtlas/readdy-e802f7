'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from './HeroSection';
import PortalTypesSection from './PortalTypesSection';
import OnePlaceSection from './OnePlaceSection';
import CoreFeaturesSection from './CoreFeaturesSection';
import RoleBasedSection from './RoleBasedSection';
import PortalWorkflowSection from './PortalWorkflowSection';
import IntegrationsSection from './IntegrationsSection';
import IndustriesSection from './IndustriesSection';
import ProgressionSection from './ProgressionSection';
import OutcomesSection from './OutcomesSection';
import RelatedServicesSection from './RelatedServicesSection';
import FinalCTASection from './FinalCTASection';

export default function BusinessPortalsClient() {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 bg-white text-slate-800">
        <HeroSection />
        <PortalTypesSection />
        <OnePlaceSection />
        <CoreFeaturesSection />
        <RoleBasedSection />
        <PortalWorkflowSection />
        <IntegrationsSection />
        <IndustriesSection />
        <ProgressionSection />
        <OutcomesSection />
        <RelatedServicesSection />
        <FinalCTASection />
      </div>
      <Footer />
    </>
  );
}