'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  resolveActiveMembership,
  recordPortalLogin,
  type PortalMembership,
  type PortalDeniedReason,
} from '@/lib/portal-membership';
import PortalAccessDenied from '@/components/portal/PortalAccessDenied';

const PUBLIC_PATHS = ['/portal/login'];

const PortalMembershipContext = createContext<PortalMembership | null>(null);

export function usePortalMembership(): PortalMembership | null {
  return useContext(PortalMembershipContext);
}

export function PortalAccessProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [membership, setMembership] = useState<PortalMembership | null>(null);
  const [state, setState] = useState<'checking' | 'allowed' | 'denied'>('checking');
  const [deniedReason, setDeniedReason] = useState<PortalDeniedReason>('none');
  const loginRecordedRef = useRef(false);

  useEffect(() => {
    const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p));
    if (isPublic) {
      setMembership(null);
      setState('allowed');
      return;
    }

    let cancelled = false;

    const runCheck = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;

      if (!session) {
        setState('denied');
        setDeniedReason('unauthenticated');
        return;
      }

      const result = await resolveActiveMembership();
      if (cancelled) return;

      if (result.has_access && result.client_id) {
        setMembership(result);
        setState('allowed');
        if (!loginRecordedRef.current) {
          loginRecordedRef.current = true;
          recordPortalLogin().catch(() => {});
        }
      } else {
        setMembership(null);
        setState('denied');
        setDeniedReason(result.reason ?? 'none');
      }
    };

    runCheck();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (cancelled) return;
      if (event === 'SIGNED_OUT') {
        setMembership(null);
        setState('denied');
        setDeniedReason('unauthenticated');
      } else if (event === 'SIGNED_IN') {
        runCheck();
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [pathname]);

  if (state === 'checking') {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-[3px] border-[#06B6D4]/30 border-t-[#06B6D4] rounded-full animate-spin" />
        <p className="text-sm text-slate-500">Checking your portal access...</p>
      </div>
    );
  }

  if (state === 'denied') {
    return <PortalAccessDenied reason={deniedReason} />;
  }

  return (
    <PortalMembershipContext.Provider value={membership}>
      {children}
    </PortalMembershipContext.Provider>
  );
}