'use client';

import { rlsPermissionMeta, type RlsPermission } from '../data-model-data';

export default function RlsPermissionChips({ perms }: { perms: RlsPermission[] }) {
  if (!perms || perms.length === 0) {
    return <span className="text-[10px] text-slate-300">—</span>;
  }
  return (
    <span className="inline-flex items-center gap-1">
      {perms.map((perm) => {
        const meta = rlsPermissionMeta.find((p) => p.id === perm);
        if (!meta) return null;
        return (
          <span
            key={perm}
            title={`${meta.label} — ${meta.desc}`}
            className={`text-[10px] font-bold border rounded px-1.5 py-0.5 ${meta.tone}`}
          >
            {meta.abbr}
          </span>
        );
      })}
    </span>
  );
}