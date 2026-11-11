import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { supabase, getSessionSafe, isSupabaseConfigured } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';

export interface GateVerifyResult {
  allowed: boolean;
  reason?: string;
  redirectTo?: string;
}

export interface GateStateOptions {
  publicPaths?: string[];
  loginPath: string;
  verifyAccess: (session: Session) => Promise<GateVerifyResult>;
}

export type GateState = 'idle' | 'checking' | 'allowed' | 'denied' | 'redirecting';

function readPersistedDebug(): unknown[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.sessionStorage.getItem('__dfp_admin_login_debug__');
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [];
}

function clearPersistedDebug() {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem('__dfp_admin_login_debug__');
  } catch {
    // ignore
  }
}

export function useGateState({ publicPaths, loginPath, verifyAccess }: GateStateOptions) {
  const [gateState, setGateState] = useState<GateState>('checking');
  const [deniedReason, setDeniedReason] = useState<string | null>(null);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  const mountedRef = useRef(true);
  const pathname = usePathname();
  const retryCountRef = useRef(0);
  const gateStateRef = useRef<GateState>('checking');

  const configRef = useRef({ publicPaths, loginPath, verifyAccess });
  configRef.current = { publicPaths, loginPath, verifyAccess };

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    gateStateRef.current = gateState;
  }, [gateState]);

  useEffect(() => {
    const { publicPaths: pub, verifyAccess: verify } = configRef.current;
    const currentPath = pathname || '';

    let isPublic = false;

    if (currentPath) {
      isPublic = pub && pub.some(
        (p) => currentPath === p || currentPath.endsWith(p)
      );
    }

    if (!isPublic && typeof window !== 'undefined') {
      const browserPath = window.location.pathname;
      isPublic = pub && pub.some(
        (p) => browserPath === p || browserPath.endsWith(p)
      );
    }

    if (isPublic) {
      setGateState('allowed');
      setDeniedReason(null);
      setRedirectTo(null);
      return;
    }

    let cancelled = false;
    let checking = false;

    const runCheck = async (isRetry = false) => {
      if (!mountedRef.current || cancelled) return;

      if (!checking) {
        checking = true;
        if (gateStateRef.current !== 'allowed') {
          setGateState('checking');
        }
      }

      try {
        const session = await getSessionSafe();
        if (!mountedRef.current || cancelled) return;

        if (!session) {
          if (isRetry || retryCountRef.current >= 2) {
            setGateState('denied');
            setDeniedReason('unauthenticated');
            setRedirectTo(null);
          } else {
            retryCountRef.current += 1;
            if (typeof window !== 'undefined') {
              console.info(`[gate] session empty, retry ${retryCountRef.current}/2 in 250ms`);
            }
            setTimeout(() => runCheck(true), 250);
          }
          return;
        }

        retryCountRef.current = 0;
        const result = await verify(session);
        if (!mountedRef.current || cancelled) return;

        if (result.allowed) {
          setGateState('allowed');
          setDeniedReason(null);
          setRedirectTo(null);
        } else if (result.redirectTo) {
          setRedirectTo(result.redirectTo);
          setDeniedReason(null);
          setGateState('redirecting');
        } else {
          setGateState('denied');
          setDeniedReason(result.reason || 'Access denied.');
        }
      } catch (_err) {
        if (!mountedRef.current || cancelled) return;
        setGateState('denied');
        setDeniedReason('Access verification failed. Please try again.');
      }
    };

    if (!isSupabaseConfigured()) {
      setGateState('denied');
      setDeniedReason('Authentication service is unavailable.');
      setRedirectTo(null);
      return;
    }

    const persisted = readPersistedDebug();
    if (persisted.length > 0) {
      if (typeof window !== 'undefined') {
        console.info('[gate] persisted login debug trace:', persisted);
      }
      clearPersistedDebug();
    }

    runCheck();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (!mountedRef.current || cancelled) return;

      if (event === 'SIGNED_OUT') {
        setGateState('denied');
        setDeniedReason('unauthenticated');
        setRedirectTo(null);
        return;
      }

      if (
        event === 'SIGNED_IN' ||
        event === 'USER_UPDATED' ||
        event === 'INITIAL_SESSION' ||
        event === 'TOKEN_REFRESHED'
      ) {
        runCheck();
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return { gateState, deniedReason, redirectTo };
}