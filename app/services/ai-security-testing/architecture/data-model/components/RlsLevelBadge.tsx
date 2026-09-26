'use client';

import { rlsAccessLevels, type RlsLevel } from '../data-model-data';

const lookup = Object.fromEntries(rlsAccessLevels.map((l) => [l.id, l]));

export default function RlsLevelBadge({ level }: { level: RlsLevel }) {
  const meta = lookup[level];
  return (
    <span
      title={meta.label}
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold border px-2 py-1 rounded-lg whitespace-nowrap ${meta.tone}`}
    >
      <span className="font-mono tracking-wide">{meta.abbr}</span>
    </span>
  );
}