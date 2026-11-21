'use client';

import { useEffect, useState } from 'react';

export default function SubscriptionStatus() {
  const [status, setStatus] = useState<'checking' | 'active' | 'processing' | 'unavailable'>('checking');
  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get('session_id');
    if (!sessionId) { setStatus('unavailable'); return; }
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const controller = new AbortController();
    const check = async (attempt = 1) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/dfp-subscription-checkout-status?session_id=${encodeURIComponent(sessionId)}`, { cache: 'no-store', signal: controller.signal });
        const data: unknown = await response.json();
        if (cancelled) return;
        if (!response.ok || typeof data !== 'object' || data === null || !('status' in data)) { setStatus('unavailable'); return; }
        if (data.status === 'active') { setStatus('active'); return; }
        setStatus('processing');
        if (attempt < 10) timer = setTimeout(() => check(attempt + 1), 2000);
      } catch {
        if (!cancelled) setStatus('unavailable');
      }
    };
    void check();
    return () => { cancelled = true; controller.abort(); clearTimeout(timer); };
  }, []);
  return <div aria-live="polite">
    <p className="text-[#38E8C6] text-xs uppercase tracking-[0.14em] font-semibold mb-3">
      {status === 'active' ? 'Subscription active' : status === 'checking' ? 'Checking subscription' : 'Payment confirmation'}
    </p>
    <h1 className="text-3xl sm:text-4xl font-bold text-[#F5F7FA] tracking-tight mb-4">
      {status === 'active' ? 'Welcome to the Starter Plan.' : 'Your Starter Plan checkout'}
    </h1>
    <p className="text-[#AAB4C3] max-w-lg mx-auto mb-10">
      {status === 'active' ? 'Stripe has confirmed your payment and active subscription.' : status === 'processing' ? 'Stripe is still confirming your subscription. Refresh this page shortly to check again.' : status === 'unavailable' ? 'We could not confirm a subscription. Check your Stripe receipt or contact support before trying another payment.' : 'Please wait while we verify your payment with Stripe.'}
    </p>
  </div>;
}
