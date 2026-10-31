'use client';

import { useEffect, useRef, useState } from 'react';

const SECTIONS = [
  { id: 'entity-hierarchy', label: 'Entity hierarchy' },
  { id: 'design-principles', label: 'Design principles' },
  { id: 'entities', label: 'Entity catalogue' },
  { id: 'state-diagrams', label: 'State diagrams' },
  { id: 'er-diagram', label: 'ER diagram' },
  { id: 'tenant-isolation', label: 'Tenant isolation' },
  { id: 'rls-matrix', label: 'RLS policy matrix' },
  { id: 'sensitive-data', label: 'Sensitive data' },
  { id: 'retention', label: 'Retention' },
  { id: 'finding-versioning', label: 'Finding versioning' },
  { id: 'indexes-keys', label: 'Indexes and keys' },
  { id: 'implementation-order', label: 'Build order' },
  { id: 'unresolved-questions', label: 'Open questions' },
];

export default function OnThisPageNav() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);
  const [panelOpen, setPanelOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const rafRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        let current = SECTIONS[0].id;
        SECTIONS.forEach((section) => {
          const el = document.getElementById(section.id);
          if (!el) return;
          if (el.getBoundingClientRect().top <= window.innerHeight * 0.35) current = section.id;
        });
        setActiveId(current);
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (!sheetOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSheetOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sheetOpen]);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setPanelOpen(false);
    setSheetOpen(false);
  };

  const activeLabel = SECTIONS.find((section) => section.id === activeId)?.label ?? SECTIONS[0].label;

  return (
    <>
      <div className="hidden min-[1440px]:flex fixed left-5 top-1/2 -translate-y-1/2 z-40 flex-col items-start">
        <button
          type="button"
          onClick={() => setPanelOpen((value) => !value)}
          aria-expanded={panelOpen}
          aria-label="Toggle on this page navigation"
          className="mb-3 w-9 h-9 flex items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm text-slate-500 hover:text-[#E11D48] hover:border-[#E11D48]/40 transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className={`${panelOpen ? 'ri-close-line' : 'ri-list-unordered'} w-4 h-4 flex items-center justify-center`} aria-hidden="true" />
        </button>

        <div className="flex flex-col items-start gap-2.5 pl-3.5">
          {SECTIONS.map((section) => {
            const isActive = section.id === activeId;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => go(section.id)}
                aria-label={section.label}
                aria-current={isActive ? 'true' : undefined}
                className="group relative flex items-center cursor-pointer"
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    isActive
                      ? 'h-2 w-6 bg-[#E11D48] shadow-[0_0_10px_rgba(225,29,72,0.35)]'
                      : 'h-2 w-2 bg-slate-300 group-hover:bg-slate-400'
                  }`}
                />
                <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {section.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {panelOpen && (
        <div className="hidden min-[1440px]:block fixed left-[68px] top-1/2 -translate-y-1/2 z-40 w-56 rounded-xl border border-slate-200 bg-white/95 backdrop-blur-sm shadow-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">On this page</p>
          </div>
          <nav className="max-h-[56vh] overflow-y-auto p-1.5">
            {SECTIONS.map((section) => {
              const isActive = section.id === activeId;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => go(section.id)}
                  className={`w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#E11D48]/5 text-[#E11D48] font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className={`w-1 h-1 rounded-full shrink-0 ${isActive ? 'bg-[#E11D48]' : 'bg-slate-300'}`} aria-hidden="true" />
                  {section.label}
                </button>
              );
            })}
          </nav>
        </div>
      )}

      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        aria-label="Open on this page navigation"
        className="min-[1440px]:hidden fixed bottom-6 left-5 z-40 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-lg cursor-pointer whitespace-nowrap"
      >
        <i className="ri-list-unordered w-4 h-4 flex items-center justify-center text-[#E11D48]" aria-hidden="true" />
        On this page
      </button>

      {sheetOpen && (
        <div className="min-[1440px]:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <button
            type="button"
            aria-label="Close on this page navigation"
            onClick={() => setSheetOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
          />
          <div className="relative bg-white rounded-t-2xl shadow-2xl max-h-[75vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">On this page</p>
                <p className="text-sm font-semibold text-slate-900 mt-0.5 whitespace-nowrap">{activeLabel}</p>
              </div>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                aria-label="Close"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 cursor-pointer"
              >
                <i className="ri-close-line w-4 h-4 flex items-center justify-center" aria-hidden="true" />
              </button>
            </div>
            <nav className="overflow-y-auto p-2.5">
              {SECTIONS.map((section) => {
                const isActive = section.id === activeId;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => go(section.id)}
                    className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors cursor-pointer ${
                      isActive ? 'bg-[#E11D48]/5 text-[#E11D48] font-semibold' : 'text-slate-600'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? 'bg-[#E11D48]' : 'bg-slate-300'}`} aria-hidden="true" />
                    <span className="whitespace-nowrap">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}