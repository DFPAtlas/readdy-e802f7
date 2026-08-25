'use client';

import { Check } from 'lucide-react';
import {
  PORTAL_ACCESS_ROLES,
  PORTAL_ACCESS_ROLE_LABELS,
  PORTAL_ACCESS_ROLE_DESCRIPTIONS,
  type PortalAccessRole,
} from '@/lib/portal-access';

interface PortalRolePickerProps {
  value: string;
  onChange: (role: string) => void;
}

export default function PortalRolePicker({ value, onChange }: PortalRolePickerProps) {
  return (
    <div className="space-y-2">
      {PORTAL_ACCESS_ROLES.map((role: PortalAccessRole) => {
        const selected = value === role;
        return (
          <button
            key={role}
            type="button"
            onClick={() => onChange(role)}
            className={`w-full text-left flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
              selected
                ? 'bg-[#06B6D4]/10 border-[#06B6D4]/40'
                : 'bg-white/[0.02] border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.18)]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                selected ? 'border-[#06B6D4]' : 'border-[rgba(255,255,255,0.20)]'
              }`}
            >
              {selected && <Check className="w-3 h-3 text-[#06B6D4]" />}
            </div>
            <div>
              <p className={`text-sm font-semibold ${selected ? 'text-[#06B6D4]' : 'text-white'}`}>
                {PORTAL_ACCESS_ROLE_LABELS[role]}
              </p>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{PORTAL_ACCESS_ROLE_DESCRIPTIONS[role]}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}