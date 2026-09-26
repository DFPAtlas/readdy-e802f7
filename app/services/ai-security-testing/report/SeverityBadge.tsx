import type { Severity } from '../report-preview-data';

const toneMap: Record<string, { bg: string; text: string; dot: string }> = {
  Critical: { bg: 'bg-[#E11D48]/10', text: 'text-[#E11D48]', dot: 'bg-[#E11D48]' },
  High: { bg: 'bg-[#F97316]/10', text: 'text-[#EA580C]', dot: 'bg-[#F97316]' },
  Medium: { bg: 'bg-[#F59E0B]/10', text: 'text-[#B45309]', dot: 'bg-[#F59E0B]' },
  Low: { bg: 'bg-slate-100', text: 'text-slate-500', dot: 'bg-slate-400' },
};

export default function SeverityBadge({ severity, className = '' }: { severity: Severity; className?: string }) {
  const tone = toneMap[severity] ?? toneMap.Low;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${tone.bg} ${tone.text} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} />
      {severity}
    </span>
  );
}