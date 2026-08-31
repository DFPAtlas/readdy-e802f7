'use client';

import Link from 'next/link';
import { CircleAlert } from 'lucide-react';
import UATPortalBreadcrumbs from './UATPortalBreadcrumbs';

export default function UATMissingAssignmentState() {
  return (
    <>
      <UATPortalBreadcrumbs items={[{ label: 'My Tests', href: '/uat/my-tests' }, { label: 'Not Available' }]} />
      <div className="flex items-center justify-center py-16">
        <div className="bg-white border border-slate-100 rounded-3xl p-12 shadow-sm text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
            <CircleAlert className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-[#17325c] mb-2">Assignment Not Available</h3>
          <p className="text-slate-500 mb-6">A valid test assignment is required to view this page.</p>
          <Link href="/uat/my-tests" className="inline-block px-5 py-2.5 bg-[#2878d0] rounded-xl text-sm font-semibold text-white cursor-pointer whitespace-nowrap">Back to My Tests</Link>
        </div>
      </div>
    </>
  );
}