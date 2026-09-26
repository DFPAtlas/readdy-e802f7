'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArchitectureHero from './components/ArchitectureHero';
import ArchitectureDiagram from './components/ArchitectureDiagram';
import CoreArchitectureSection from './components/CoreArchitectureSection';
import ExecutionEnvironments from './components/ExecutionEnvironments';
import AgentModelSection from './components/AgentModelSection';
import ScopeTokenSection from './components/ScopeTokenSection';
import ApprovalGatesSection from './components/ApprovalGatesSection';
import EngagementLifecycleSection from './components/EngagementLifecycleSection';
import EvidenceArchitectureSection from './components/EvidenceArchitectureSection';
import FindingStatesSection from './components/FindingStatesSection';
import HumanInLoopSection from './components/HumanInLoopSection';
import EmergencyStopSection from './components/EmergencyStopSection';
import DataBoundarySection from './components/DataBoundarySection';
import ReportingPipelineSection from './components/ReportingPipelineSection';
import RemediationWorkflowSection from './components/RemediationWorkflowSection';
import SecurityWatchArchitectureSection from './components/SecurityWatchArchitectureSection';
import ArchitectureSafetyStrip from './components/ArchitectureSafetyStrip';

export default function ArchitectureClient() {
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen pt-24 bg-white text-slate-800">
        <ArchitectureHero />
        <ArchitectureDiagram />
        <CoreArchitectureSection />
        <ExecutionEnvironments />
        <AgentModelSection />
        <ScopeTokenSection />
        <ApprovalGatesSection />
        <EngagementLifecycleSection />
        <EvidenceArchitectureSection />
        <FindingStatesSection />
        <HumanInLoopSection />
        <EmergencyStopSection />
        <DataBoundarySection />
        <ReportingPipelineSection />
        <RemediationWorkflowSection />
        <SecurityWatchArchitectureSection />
        <ArchitectureSafetyStrip />
      </main>
      <Footer />
    </>
  );
}