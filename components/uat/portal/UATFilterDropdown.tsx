'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface FilterOption {
  value: string;
  label: string;
}

interface UATFilterDropdownProps {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

export default function UATFilterDropdown({ label, value, options, onChange }: UATFilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm transition hover:border-[#2878d0]/40 cursor-pointer whitespace-nowrap"
      >
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
        <span className="font-semibold text-[#17325c]">{selected?.label || 'Any'}</span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-30 mt-2 w-56 rounded-xl border border-slate-100 bg-white p-1.5 shadow-lg">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-left text-slate-600 hover:bg-slate-50 cursor-pointer whitespace-nowrap"
            >
              <span>{o.label}</span>
              {o.value === value && <Check className="h-4 w-4 text-[#2878d0]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}