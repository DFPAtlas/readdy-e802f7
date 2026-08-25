'use client';

export interface AuthDebugEntry {
  time: string;
  label: string;
  detail: string;
  level: 'info' | 'ok' | 'warn' | 'err';
}

const LEVEL_COLORS: Record<AuthDebugEntry['level'], string> = {
  info: 'text-cyan-300',
  ok: 'text-emerald-300',
  warn: 'text-amber-300',
  err: 'text-red-400',
};

export function AuthDebugBanner({ entries }: { entries: AuthDebugEntry[] }) {
  if (entries.length === 0) return null;
  const latest = entries[entries.length - 1];
  return (
    <div className="rounded-xl border border-cyan-500/30 bg-[#0B1120] p-3 text-left">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-300">Debug Trace</span>
        <span className="text-[10px] text-slate-500">
          {entries.length} step{entries.length === 1 ? '' : 's'} ·{' '}
          <span className={LEVEL_COLORS[latest.level]}>{latest.label}</span>
        </span>
      </div>
      <div className="space-y-1 max-h-64 overflow-y-auto font-mono text-[11px] leading-relaxed">
        {entries.map((e, i) => (
          <div key={i} className="flex gap-2 items-start">
            <span className="text-slate-600 shrink-0 w-[52px]">{e.time}</span>
            <span className={`shrink-0 ${LEVEL_COLORS[e.level]}`}>[{e.label}]</span>
            <span className="text-slate-300 break-all">{e.detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
}