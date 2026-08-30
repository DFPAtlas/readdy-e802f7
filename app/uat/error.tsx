'use client';

import { useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import UATEmptyState from '@/components/uat/portal/UATEmptyState';
import UATPortalBreadcrumbs from '@/components/uat/portal/UATPortalBreadcrumbs';

export default function UATError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[uat] error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-8">
      <div className="bg-white border border-slate-100 rounded-3xl p-12 shadow-sm text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
          <i className="ri-error-warning-line text-2xl text-red-500 w-8 h-8 flex items-center justify-center" />
        </div>
        <h3 className="text-xl font-bold text-[#17325c] mb-2">Something went wrong</h3>
        <p className="text-slate-500 mb-6">
          {error?.message || 'An unexpected error occurred in the UAT portal. Please try again.'}
        </p>
        <div className="space-y-3">
          <button
            onClick={() => reset()}
            className="block w-full py-3 rounded-xl font-semibold text-sm text-white bg-[#2878d0] hover:bg-[#1e6bc0] transition-all cursor-pointer whitespace-nowrap"
          >
            Try again
          </button>
          <a
            href="/uat/dashboard"
            className="block w-full py-3 rounded-xl font-medium text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer whitespace-nowrap"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}