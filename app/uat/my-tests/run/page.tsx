'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import RunnerClient from '../[id]/run/RunnerClient';
import UATMissingAssignmentState from '@/components/uat/portal/UATMissingAssignmentState';

function RunInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';
  if (!id) return <UATMissingAssignmentState />;
  return <RunnerClient assignmentId={id} />;
}

export default function RunPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-8 h-8 border-[3px] border-[#2878d0]/20 border-t-[#2878d0] rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading test runner...</p>
        </div>
      }
    >
      <RunInner />
    </Suspense>
  );
}