'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectClient({ assignmentId }: { assignmentId: string }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/uat/my-tests/view?id=${assignmentId}`);
  }, [assignmentId, router]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-[3px] border-[#2878d0]/30 border-t-[#2878d0] rounded-full animate-spin" />
      <p className="text-sm text-slate-500">Opening your test assignment...</p>
    </div>
  );
}