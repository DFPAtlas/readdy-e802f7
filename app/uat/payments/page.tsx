'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  WalletCards, Clock, BadgeCheck, PiggyBank, CircleDollarSign, TriangleAlert,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useUATTester } from '@/components/uat/UATTesterProvider';
import { useEarnings } from '@/hooks/useEarnings';
import { formatMinorToGbp, rewardStatusBadge } from '@/lib/uat-earnings';
import { normalizeStripeStatus } from '@/lib/uat-stripe-connect';
import UATPortalBreadcrumbs from '@/components/uat/portal/UATPortalBreadcrumbs';
import UATEmptyState from '@/components/uat/portal/UATEmptyState';
import UATErrorState from '@/components/uat/portal/UATErrorState';

function formatDate(value: string | null): string {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function TesterEarningsPage() {
  const router = useRouter();
  const { tester } = useUATTester();
  const { items, totals, loading, error, refetch } = useEarnings(tester.id);
  const [paymentReady, setPaymentReady] = useState(false);

  useEffect(() => {
    if (!tester?.id) return;
    supabase
      .from('uat_testers')
      .select('stripe_payment_setup_status')
      .eq('id', tester.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setPaymentReady(normalizeStripeStatus(data.stripe_payment_setup_status) === 'ready');
      });
  }, [tester?.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-8 h-8 border-[3px] border-[#2878d0]/20 border-t-[#2878d0] rounded-full animate-spin" />
        <p className="text-sm text-slate-500">Loading your earnings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <UATPortalBreadcrumbs items={[{ label: 'Earnings' }]} />
        <UATErrorState message={error} onRetry={refetch} />
      </>
    );
  }

  const summaryCards = [
    { label: 'Pending Review', value: formatMinorToGbp(totals.pendingReview, 'GBP'), icon: Clock, bg: 'bg-slate-100', color: '#64748b' },
    { label: 'Approved', value: formatMinorToGbp(totals.approved, 'GBP'), icon: BadgeCheck, bg: 'bg-violet-100', color: '#7C3AED' },
    { label: 'Paid', value: formatMinorToGbp(totals.paid, 'GBP'), icon: CircleDollarSign, bg: 'bg-emerald-100', color: '#10B981' },
    { label: 'Total Earned', value: formatMinorToGbp(totals.totalEarned, 'GBP'), icon: PiggyBank, bg: 'bg-sky-100', color: '#2878d0' },
  ];

  return (
    <>
      <UATPortalBreadcrumbs items={[{ label: 'Earnings' }]} />
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#789265]">Earnings</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight sm:text-5xl text-[#17325c]">My Earnings</h1>
          <p className="mt-2 text-slate-500">Track every reward you have earned from UAT testing.</p>
        </div>
        <Link
          href="/uat/payments/account"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#17325c] hover:border-[#2878d0] hover:text-[#2878d0] transition whitespace-nowrap cursor-pointer"
        >
          <WalletCards className="h-4 w-4" />
          Payment Account
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className={`flex h-14 w-14 items-center justify-center rounded-full ${card.bg}`} style={{ color: card.color }}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#17325c]">{card.value}</p>
                <p className="text-sm font-semibold text-slate-600">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        {totals.approved > 0 && !paymentReady && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-center gap-3">
              <TriangleAlert className="h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  You have approved rewards but your payment account is not ready.
                </p>
                <p className="mt-0.5 text-xs text-amber-700">
                  Set up your Stripe account so DFP can pay these rewards once approved.
                </p>
              </div>
            </div>
            <Link
              href="/uat/payments/account"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-amber-700 transition whitespace-nowrap cursor-pointer"
            >
              Set Up Payments
            </Link>
          </div>
        )}

        {items.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
            <UATEmptyState
              icon={WalletCards}
              title="No earnings yet"
              description="Complete and submit test assignments to start earning rewards."
              actionLabel="Browse Jobs"
              actionHref="/uat/jobs"
            />
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-5 py-3">UAT Job</th>
                    <th className="px-5 py-3">Completed</th>
                    <th className="px-5 py-3">Reward</th>
                    <th className="px-5 py-3">Reward Status</th>
                    <th className="px-5 py-3">Approved</th>
                    <th className="px-5 py-3">Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => router.push(`/uat/my-tests/${item.assignment_id}`)}
                      className="cursor-pointer transition-colors hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#17325c]">{item.job_title}</p>
                        {item.project_name && <p className="mt-0.5 text-xs text-slate-400">{item.project_name}</p>}
                      </td>
                      <td className="px-5 py-4 text-slate-500">{formatDate(item.completed_at)}</td>
                      <td className="px-5 py-4">
                        <span className="font-bold text-[#617a50]">{item.reward_label}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${rewardStatusBadge(item.reward_status)}`}>
                          {item.reward_status}
                        </span>
                        {item.reward_status === 'Paid' && (
                          <p className="mt-1 text-[11px] font-medium text-emerald-600">Paid via Stripe</p>
                        )}
                        {item.reward_status === 'Processing' && (
                          <p className="mt-1 text-[11px] text-slate-400">Payment in progress</p>
                        )}
                        {item.reward_status === 'Payment Issue' && (
                          <p className="mt-1 text-[11px] text-amber-600">Our team is resolving this</p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-500">{formatDate(item.approved_at)}</td>
                      <td className="px-5 py-4 text-slate-500">{formatDate(item.paid_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <p className="mt-6 text-xs text-slate-400">
        Rewards reflect the amount agreed when you were assigned each test. Pending Review means work submitted but not yet approved.
        Approved means DFP has approved the reward but it has not yet been paid. Paid is shown only when the reward has genuinely been paid.
        Payment Issue means there was a problem processing your reward and our team is resolving it.
      </p>
    </>
  );
}