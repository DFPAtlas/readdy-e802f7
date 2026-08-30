'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function AccountEarningsPage() {
  const router = useRouter();
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (mountedRef.current) router.replace('/uat/payments');
    }, 0);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-[3px] border-[#2878d0]/30 border-t-[#2878d0] rounded-full animate-spin" />
      <p className="text-sm text-slate-500">Opening your earnings...</p>
    </div>
  );
}