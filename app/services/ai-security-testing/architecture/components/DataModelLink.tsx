'use client';

import Link from 'next/link';

type DataModelLinkProps = {
  href: string;
  label: string;
  icon?: string;
  tone?: 'light' | 'dark';
};

const basePath = '/services/ai-security-testing/architecture/data-model';

export default function DataModelLink({ href, label, icon = 'ri-arrow-right-up-line', tone = 'light' }: DataModelLinkProps) {
  const isDark = tone === 'dark';

  return (
    <Link
      href={`${basePath}${href}`}
      className={`group inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-full border transition-colors cursor-pointer whitespace-nowrap ${
        isDark
          ? 'text-slate-200 bg-slate-900/80 border-slate-700 hover:border-slate-500 hover:text-white'
          : 'text-slate-600 bg-white border-slate-200 hover:border-slate-300 hover:text-slate-900'
      }`}
    >
      <i
        className={`${icon} w-4 h-4 flex items-center justify-center ${isDark ? 'text-[#F97316]' : 'text-[#E11D48]'}`}
        aria-hidden="true"
      />
      {label}
    </Link>
  );
}