'use client';

import { useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import UATEmptyState from '@/components/uat/portal/UATEmptyState';
import UATPortalBreadcrumbs from '@/components/uat/portal/UATPortalBreadcrumbs';

export default function JobsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[uat/jobs] error boundary caught:', error);
  }, [error]);

  return (
    <>
      <UATPortalBreadcrumbs items={[{ label: 'Available Tests' }]} />
      <div className="mt-4">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#789265]">Paid UAT Opportunities</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-[#17325c] sm:text-5xl">Available Tests</h1>
      </div>
      <div className="mt-6 rounded-2xl border border-slate-100 bg-white shadow-sm">
        <UATEmptyState
          icon={Briefcase}
          title="Something went wrong"
          description={error?.message || 'An unexpected error occurred while loading available tests.'}
        />
        <div className="pb-6 text-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-xl bg-[#2878d0] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 hover:bg-[#1e68b9] transition cursor-pointer whitespace-nowrap"
          >
            Try again
          </button>
        </div>
      </div>
    </>
  );
}