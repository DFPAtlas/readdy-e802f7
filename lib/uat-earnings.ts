export type RewardStatus = 'Pending Review' | 'Approved' | 'Processing' | 'Paid' | 'Payment Issue' | 'Rejected' | 'Cancelled';

const PAID_STATUSES = ['paid'];
const REJECTED_STATUSES = ['rejected', 'failed', 'disputed'];
const CANCELLED_STATUSES = ['cancelled'];

export function resolveRewardStatus(
  status: string | null | undefined,
  stripeTransferStatus?: string | null,
): RewardStatus {
  const s = (status || '').toLowerCase();
  if (PAID_STATUSES.includes(s)) return 'Paid';
  if (s === 'approved') {
    if (stripeTransferStatus === 'failed') return 'Payment Issue';
    if (stripeTransferStatus === 'processing') return 'Processing';
    return 'Approved';
  }
  if (REJECTED_STATUSES.includes(s)) return 'Rejected';
  if (CANCELLED_STATUSES.includes(s)) return 'Cancelled';
  return 'Pending Review';
}

export function rewardStatusLabel(
  payment: { status?: string | null; eligibility_state?: string | null; stripe_transfer_status?: string | null } | null | undefined,
): RewardStatus {
  if (!payment) return 'Pending Review';
  return resolveRewardStatus(payment.status || payment.eligibility_state, payment.stripe_transfer_status);
}

export function rewardStatusBadge(status: RewardStatus): string {
  switch (status) {
    case 'Paid': return 'bg-emerald-100 text-emerald-700';
    case 'Approved': return 'bg-violet-100 text-violet-700';
    case 'Processing': return 'bg-sky-100 text-sky-700';
    case 'Payment Issue': return 'bg-amber-100 text-amber-700';
    case 'Rejected': return 'bg-rose-100 text-rose-700';
    case 'Cancelled': return 'bg-slate-100 text-slate-500';
    default: return 'bg-slate-100 text-slate-600';
  }
}

export function rewardStatusExplanation(status: RewardStatus): string {
  switch (status) {
    case 'Paid': return 'This reward has been paid to you via Stripe.';
    case 'Approved': return 'DFP has approved this reward and it will be paid shortly.';
    case 'Processing': return 'Your payment is being processed.';
    case 'Payment Issue': return 'There is an issue with your payment. DFP is aware and working on it.';
    case 'Rejected': return 'This reward was not approved.';
    case 'Cancelled': return 'This reward was cancelled.';
    default: return 'Your work has been submitted but the reward has not yet been approved.';
  }
}

export interface EarningsTotals {
  pendingReview: number;
  approved: number;
  paid: number;
  totalEarned: number;
}

export interface LedgerLike {
  reward_amount_minor?: number | null;
  status?: string | null;
  eligibility_state?: string | null;
  stripe_transfer_status?: string | null;
}

export function computeEarningsTotals(payments: LedgerLike[]): EarningsTotals {
  let pendingReview = 0;
  let approved = 0;
  let paid = 0;
  for (const p of payments) {
    const minor = p.reward_amount_minor ?? 0;
    const rs = resolveRewardStatus(p.status || p.eligibility_state, p.stripe_transfer_status);
    if (rs === 'Paid') paid += minor;
    else if (rs === 'Approved' || rs === 'Processing' || rs === 'Payment Issue') approved += minor;
    else if (rs === 'Pending Review') pendingReview += minor;
  }
  return { pendingReview, approved, paid, totalEarned: pendingReview + approved + paid };
}

export function formatMinorToGbp(minor: number | null | undefined, currency?: string | null): string {
  const symbol = (currency || 'GBP').toUpperCase() === 'USD' ? '$' : (currency || 'GBP').toUpperCase() === 'EUR' ? '€' : '£';
  const amount = (minor ?? 0) / 100;
  return `${symbol}${amount.toFixed(2)}`;
}