'use client';

import { Check, X, Minus, Circle } from 'lucide-react';
import type { RunnerCase } from '@/lib/uat-runner';

interface CaseNavigatorProps {
  cases: RunnerCase[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

function statusIcon(status: string): { el: React.ReactNode; cls: string; label: string } {
  switch (status) {
    case 'passed':
      return { el: <Check className="h-3.5 w-3.5" />, cls: 'bg-emerald-500 text-white', label: 'Pass' };
    case 'failed':
      return { el: <X className="h-3.5 w-3.5" />, cls: 'bg-red-500 text-white', label: 'Fail' };
    case 'blocked':
      return { el: <Minus className="h-3.5 w-3.5" />, cls: 'bg-amber-500 text-white', label: 'Blocked' };
    case 'skipped':
      return { el: <Minus className="h-3.5 w-3.5" />, cls: 'bg-slate-400 text-white', label: 'Skipped' };
    case 'in_progress':
      return { el: <Circle className="h-3.5 w-3.5" />, cls: 'bg-sky-400 text-white', label: 'In Progress' };
    default:
      return { el: <Circle className="h-3.5 w-3.5" />, cls: 'bg-slate-200 text-slate-400', label: 'Not Started' };
  }
}

export default function CaseNavigator({ cases, currentIndex, onSelect }: CaseNavigatorProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-1" role="tablist" aria-label="Test cases">
      {cases.map((c, i) => {
        const { el, cls, label } = statusIcon(c.status);
        const active = i === currentIndex;
        return (
          <button
            key={c.id}
            onClick={() => onSelect(i)}
            title={`${c.reference}: ${label}`}
            aria-label={`${c.reference}: ${label}`}
            aria-selected={active}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-all cursor-pointer ${
              active ? 'border-[#2878d0] ring-2 ring-[#2878d0]/20' : 'border-transparent'
            }`}
          >
            <span className={`flex h-7 w-7 items-center justify-center rounded-full ${cls}`}>{el}</span>
          </button>
        );
      })}
    </div>
  );
}