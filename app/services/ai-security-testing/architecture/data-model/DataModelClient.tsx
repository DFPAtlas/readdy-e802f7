'use client';

import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DataModelHero from './components/DataModelHero';
import EntityHierarchyDiagram from './components/EntityHierarchyDiagram';
import DesignPrinciplesSection from './components/DesignPrinciplesSection';
import EntityCatalogue from './components/EntityCatalogue';
import StateDiagramsSection from './components/StateDiagramsSection';
import TenantIsolationSection from './components/TenantIsolationSection';
import RlsPolicyMatrixSection from './components/RlsPolicyMatrixSection';
import SensitiveDataSection from './components/SensitiveDataSection';
import RetentionSection from './components/RetentionSection';
import FindingVersioningSection from './components/FindingVersioningSection';
import IndexesKeysSection from './components/IndexesKeysSection';
import ErDiagramSection from './components/ErDiagramSection';
import ImplementationOrderSection from './components/ImplementationOrderSection';
import UnresolvedQuestionsSection from './components/UnresolvedQuestionsSection';
import DataModelSafetyStrip from './components/DataModelSafetyStrip';

export default function DataModelClient() {
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) return;
      const target = document.getElementById(hash);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const timer = window.setTimeout(scrollToHash, 120);
    window.addEventListener('hashchange', scrollToHash);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('hashchange', scrollToHash);
    };
  }, []);

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen pt-24 bg-white text-slate-800">
        <DataModelHero />
        <EntityHierarchyDiagram />
        <DesignPrinciplesSection />
        <EntityCatalogue />
        <StateDiagramsSection />
        <ErDiagramSection />
        <TenantIsolationSection />
        <RlsPolicyMatrixSection />
        <SensitiveDataSection />
        <RetentionSection />
        <FindingVersioningSection />
        <IndexesKeysSection />
        <ImplementationOrderSection />
        <UnresolvedQuestionsSection />
        <DataModelSafetyStrip />
      </main>
      <Footer />
    </>
  );
}