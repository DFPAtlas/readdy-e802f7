'use client';

import StripeConnectPanel from '@/components/uat/StripeConnectPanel';
import UATPortalBreadcrumbs from '@/components/uat/portal/UATPortalBreadcrumbs';

export default function PaymentAccountPage() {
  return (
    <>
      <UATPortalBreadcrumbs items={[{ label: 'Earnings', href: '/uat/payments' }, { label: 'Payment Account' }]} />
      <div className="mt-4">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#789265]">Payment Account</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight sm:text-5xl text-[#17325c]">
          Payment Account
        </h1>
        <p className="mt-2 text-slate-500">Connect your Stripe account so you can receive paid UAT rewards.</p>
      </div>

      <div className="mt-8 max-w-2xl">
        <StripeConnectPanel autoRefresh />
      </div>
    </>
  );
}