'use client';

import { useState } from 'react';
import type { Entity } from '../data-model-data';

export default function EntityCard({ entity }: { entity: Entity }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#F7F9FC] border border-slate-200 shrink-0 text-[11px] font-bold text-[#E11D48]">
              {entity.index}
            </span>
            <h3 className="text-sm font-bold text-slate-900 font-mono break-words">{entity.key}</h3>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
            Table
          </span>
        </div>

        <p className="text-sm text-slate-500 leading-relaxed mb-4">{entity.purpose}</p>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#E11D48] transition-colors cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D48]/40 rounded"
        >
          <i className={`${open ? 'ri-subtract-line' : 'ri-add-line'} w-4 h-4 flex items-center justify-center`} aria-hidden="true" />
          {open ? 'Hide fields' : `Show ${entity.fields.length} fields`}
        </button>
      </div>

      {open && (
        <div className="px-5 pb-5 border-t border-slate-100 pt-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {entity.fields.map((field) => (
              <span key={field.name} className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-[#F7F9FC] border border-slate-200 px-2.5 py-1.5 rounded-lg">
                <span className="font-mono">{field.name}</span>
                {field.note && <span className="text-slate-400">— {field.note}</span>}
              </span>
            ))}
          </div>

          {entity.states && (
            <div className="mb-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                {entity.key === 'findings' ? 'Severity values' : entity.states.includes('domain') ? 'Asset types' : 'Values'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {entity.states.map((s) => (
                  <span key={s} className="text-[11px] font-mono text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {entity.note && (
            <div className="flex items-start gap-2 mt-3 pt-3 border-t border-slate-100">
              <i className="ri-information-line w-4 h-4 flex items-center justify-center shrink-0 text-[#EA580C] mt-0.5" aria-hidden="true" />
              <p className="text-xs text-slate-500 leading-relaxed">{entity.note}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}