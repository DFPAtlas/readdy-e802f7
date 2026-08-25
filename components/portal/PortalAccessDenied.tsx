'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { PortalDeniedReason } from '@/lib/portal-membership';
import { LifeBuoy, LogOut, ArrowLeft, ShieldAlert, Clock3, UserX, Ban, WifiOff } from 'lucide-react';

interface PortalAccessDeniedProps {
  reason: PortalDeniedReason;
}

const COPY: Record<PortalDeniedReason, { title: string; message: string; icon: typeof ShieldAlert }> = {
  unauthenticated: {
    title: 'Sign-in required',
    message: 'Your sign-in link may have expired or is no longer valid. Please request a new one to continue.',
    icon: Clock3,
  },
  none: {
    title: 'No portal access',
    message: 'This account does not have access to a client portal yet. If you believe this is a mistake, please get in touch.',
    icon: ShieldAlert,
  },
  expired: {
    title: 'Invitation expired',
    message: 'Your portal invitation has expired. Please contact us to request a new invitation.',
    icon: Clock3,
  },
  revoked: {
    title: 'Access revoked',
    message: 'Your access to this portal has been suspended. Contact Digital Footprint support if you have any questions.',
    icon: UserX,
  },
  inactive_client: {
    title: 'Account unavailable',
    message: 'The client account linked to this email is not currently active. Please contact support for assistance.',
    icon: Ban,
  },
  unavailable: {
    title: 'Portal temporarily unavailable',
    message: 'We could not verify your access right now. Please try again in a moment.',
    icon: WifiOff,
  },
};

export default function PortalAccessDenied({ reason }: PortalAccessDeniedProps) {
  const router = useRouter();
  const { title, message, icon: Icon } = COPY[reason] ?? COPY.none;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/portal/login');
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-[#06B6D4] transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            Back to Digital Footprint
          </Link>
        </div>

        <div className="bg-[#1E293B] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-[#06B6D4]/10 flex items-center justify-center mx-auto mb-4">
            <Icon className="w-7 h-7 text-[#06B6D4]" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">{title}</h1>
          <p className="text-sm text-slate-400 leading-6 mb-7">{message}</p>

          <div className="space-y-3">
            <Link
              href="/portal/login?from=gate"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm text-white bg-[#06B6D4] hover:bg-[#0891B2] transition-all cursor-pointer whitespace-nowrap"
            >
              Return to sign in
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium text-sm text-slate-300 bg-white/5 border border-white/[0.08] hover:bg-white/10 transition-all cursor-pointer whitespace-nowrap"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>

            <Link
              href="/support"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium text-sm text-[#06B6D4] hover:bg-[#06B6D4]/10 transition-all cursor-pointer whitespace-nowrap"
            >
              <LifeBuoy className="w-4 h-4" />
              Contact Digital Footprint support
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Need a new invitation? Contact your Digital Footprint account manager.
        </p>
      </div>
    </div>
  );
}