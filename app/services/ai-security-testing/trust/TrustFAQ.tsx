'use client';

import { useState } from 'react';
import { trustFaqs } from '../trust-methodology-data';

export default function TrustFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      <div className="text-center mb-10">
        <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-4">
          Common questions
        </p>
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-3">
          Questions before booking
        </h3>
        <p className="text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Clear answers on how testing is run, what is included and what we need from you.
        </p>
      </div>

      <div className="max-w-4xl mx-auto rounded-2xl border border-slate-200/80 bg-white divide-y divide-slate-100 overflow-hidden">
        {trustFaqs.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div key={faq.q}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                id={`faq-trigger-${i}`}
                className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D48]/40 focus-visible:ring-inset transition-colors hover:bg-slate-50"
              >
                <span className="text-sm md:text-base font-semibold text-slate-800">{faq.q}</span>
                <i
                  className={`${isOpen ? 'ri-subtract-line' : 'ri-add-line'} w-5 h-5 flex items-center justify-center shrink-0 text-[#E11D48]`}
                  aria-hidden="true"
                />
              </button>
              {isOpen && (
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${i}`}
                  className="px-5 pb-5 -mt-1"
                >
                  <p className="text-sm text-slate-500 leading-relaxed max-w-3xl">{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}