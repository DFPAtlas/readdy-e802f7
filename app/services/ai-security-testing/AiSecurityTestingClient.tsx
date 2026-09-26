'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from './HeroSection';
import WhatWeTestSection from './WhatWeTestSection';
import SecurityAgentsSection from './SecurityAgentsSection';
import WhyAiSection from './WhyAiSection';
import LatestSecurityIntelligenceSection from './LatestSecurityIntelligenceSection';
import AttackSurfaceSection from './AttackSurfaceSection';
import AttackPathSection from './AttackPathSection';
import RiskMatrixSection from './RiskMatrixSection';
import FindingToSolutionSection from './FindingToSolutionSection';
import SolutionExamplesSection from './SolutionExamplesSection';
import HowItWorksSection from './HowItWorksSection';
import ThreatCoverageSection from './ThreatCoverageSection';
import ImprovementJourneySection from './ImprovementJourneySection';
import SecurityPackagesSection from './SecurityPackagesSection';
import ReportPreviewSection from './ReportPreviewSection';
import RemediationServicesSection from './RemediationServicesSection';
import BeforeAfterSection from './BeforeAfterSection';
import DeliverablesSection from './DeliverablesSection';
import SecurityWatchSection from './SecurityWatchSection';
import TrustMethodologySection from './TrustMethodologySection';
import RelatedServicesSection from './RelatedServicesSection';
import FinalCTASection from './FinalCTASection';
import SecurityInsightBand from './SecurityInsightBand';
import { securityInsights } from './security-enrichment-data';

export default function AiSecurityTestingClient() {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 bg-white text-slate-800">
        <HeroSection />
        <WhatWeTestSection />
        <SecurityInsightBand insight={securityInsights[2]} />
        <SecurityAgentsSection />
        <WhyAiSection />
        <AttackSurfaceSection />
        <LatestSecurityIntelligenceSection />
        <SecurityInsightBand insight={securityInsights[0]} />
        <AttackPathSection />
        <RiskMatrixSection />
        <FindingToSolutionSection />
        <SolutionExamplesSection />
        <SecurityInsightBand insight={securityInsights[3]} />
        <HowItWorksSection />
        <ThreatCoverageSection />
        <ImprovementJourneySection />
        <SecurityPackagesSection />
        <SecurityInsightBand insight={securityInsights[1]} />
        <ReportPreviewSection />
        <RemediationServicesSection />
        <BeforeAfterSection />
        <DeliverablesSection />
        <SecurityInsightBand insight={securityInsights[4]} />
        <SecurityWatchSection />
        <TrustMethodologySection />
        <RelatedServicesSection />
        <FinalCTASection />
      </div>
      <Footer />
    </>
  );
}