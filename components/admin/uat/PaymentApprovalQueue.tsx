'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Search, RefreshCw, ChevronDown, XCircle, Loader2, DollarSign, AlertTriangle,
  PoundSterling, ShieldAlert, RotateCcw, BadgeCheck,
} from 'lucide-react';
import { formatReward } from '@/lib/uat-marketplace';
import { payUatTester } from '@/lib/uat-stripe-payout';
import { usePaymentApprovals } from '@/hooks/useUatTesterData';

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending_review: { label: 'Pending Review', color: '#F59E0B' },
  approved: { label: 'Approved', color: '#06B6D4' },
  paid: { label: 'Paid', color: '#10B981' },
  rejected: { label: 'Rejected', color: '#EF4444' },
  cancelled: { label: 'Cancelled', color: '#6B7280' },
};

const STRIPE_READY_CONFIG: Record<string, { label: string; color: string }> = {
  ready: { label: 'Stripe: Ready', color: '#10B981' },
  not_started: { label: 'Stripe: Not Set Up', color: '#64748b' },
  onboarding: { label: 'Stripe: Onboarding', color: '#8B5CF6' },
  verification_required: { label: 'Stripe: Verification Required', color: '#F59E0B' },
  restricted: { label: 'Stripe: Action Required', color: '#F97316' },
  disabled: { label: 'Stripe: Unavailable', color: '#6B7280' },
};

function statusConf(status: string | null | undefined) {
  return STATUS_CONFIG[status || 'pending_review'] || STATUS_CONFIG.pending_review;
}

function stripeConf(status: string | null | undefined) {
  return STRIPE_READY_CONFIG[status || 'not_started'] || STRIPE_READY_CONFIG.not_started;
}

function stripeReady(p: any): boolean {
  return p.tester_stripe_status === 'ready' && p.tester_stripe_transfers_enabled === true;
}

export default function PaymentApprovalQueue() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { payments, loading, refetch } = usePaymentApprovals();
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectOpen, setRejectOpen] = useState(false);
  const [confirmPay, setConfirmPay] = useState<any>(null);
  const [manualPay, setManualPay] = useState<any>(null);
  const [manualReason, setManualReason] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const payTester = async (pay: any) => {
    setPayingId(pay.id);
    setError('');
    setNotice('');
    try {
      const res = await payUatTester(pay.id);
      if (res.ok) {
        setNotice(`Paid ${formatReward(pay.reward_amount_minor, pay.currency || 'GBP')} to ${pay.tester_name}. Transfer ${res.stripe_transfer_id || ''}.`);
      } else {
        setError(res.error || 'Payment failed. Please check the payment state and retry.');
      }
    } catch (e: any) {
      setError(e?.message || 'Unable to reach the payment service.');
    }
    setPayingId(null);
    setConfirmPay(null);
    refetch();
  };

  const manualOverride = async (pay: any, reason: string) => {
    setStatusUpdating(pay.id);
    setError('');
    const { error: err } = await supabase.rpc('mark_uat_reward_paid', { p_payment_id: pay.id, p_reason: reason });
    if (err) setError(err.message);
    else setNotice('Manual payment override recorded.');
    setStatusUpdating(null);
    setManualPay(null);
    setManualReason('');
    refetch();
  };

  const rejectReward = async (payId: string, reason: string) => {
    setStatusUpdating(payId);
    setError('');
    const { error: err } = await supabase.rpc('reject_uat_reward', { p_payment_id: payId, p_reason: reason });
    if (err) setError(err.message);
    setStatusUpdating(null);
    setRejectOpen(false);
    setRejectReason('');
    refetch();
  };

  const openReject = (pay: any) => {
    setSelected(pay);
    setRejectReason('');
    setRejectOpen(true);
  };

  let filtered = payments;
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = payments.filter((p: any) =>
      (p.tester_name && p.tester_name.toLowerCase().includes(q)) ||
      (p.job_title && p.job_title.toLowerCase().includes(q)) ||
      (p.tester_reference && p.tester_reference.toLowerCase().includes(q))
    );
  }
  if (statusFilter !== 'all') {
    filtered = filtered.filter((p: any) => (p.status || 'pending_review') === statusFilter);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#06B6D4]/30 border-t-[#06B6D4] rounded-full animate-spin" />
      </div>
    );
  }

  const totalPaid = payments.filter((p: any) => p.status === 'paid').reduce((s: number, p: any) => s + (p.reward_amount_minor || 0), 0);
  const totalApproved = payments.filter((p: any) => p.status === 'approved').reduce((s: number, p: any) => s + (p.reward_amount_minor || 0), 0);
  const totalPending = payments.filter((p: any) => !p.status || p.status === 'pending_review').reduce((s: number, p: any) => s + (p.reward_amount_minor || 0), 0);

  return (
    <div>
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-[#1E293B] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Total Rewards</p>
          <p className="text-xl font-bold text-white">{payments.length}</p>
        </div>
        <div className="bg-[#1E293B] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Paid</p>
          <p className="text-xl font-bold text-emerald-400">{formatReward(totalPaid, 'GBP')}</p>
        </div>
        <div className="bg-[#1E293B] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Approved</p>
          <p className="text-xl font-bold text-cyan-400">{formatReward(totalApproved, 'GBP')}</p>
        </div>
        <div className="bg-[#1E293B] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Pending Review</p>
          <p className="text-xl font-bold text-amber-400">{formatReward(totalPending, 'GBP')}</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/5 border border-red-500/10 rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
      {notice && (
        <div className="mb-4 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center gap-2">
          <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <p className="text-sm text-emerald-400">{notice}</p>
        </div>
      )}

      <div className="bg-[#1E293B] border border-[rgba(255,255,255,0.08)] rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-[rgba(255,255,255,0.08)] flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="text" placeholder="Search by tester, job, or reference..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 focus:border-[#06B6D4]/40 transition-all" />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-3 pr-8 py-2.5 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 focus:border-[#06B6D4]/40 cursor-pointer appearance-none">
                <option value="all">All Statuses</option>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            </div>
            <button onClick={refetch} className="px-4 py-2.5 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-xl text-sm text-slate-400 hover:text-[#06B6D4] transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)]">
                <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Tester</th>
                <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Job / Assignment</th>
                <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Reward</th>
                <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Status</th>
                <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Payment</th>
                <th className="text-right text-xs font-medium text-slate-500 px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p: any) => {
                const conf = statusConf(p.status);
                const ready = stripeReady(p);
                const transferFailed = p.stripe_transfer_status === 'failed';
                const transferReversed = p.stripe_transfer_status === 'reversed';
                const transferRef = p.stripe_transfer_id;
                return (
                  <tr key={p.id} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-white">{p.tester_name}</p>
                      <p className="text-xs text-slate-500">{p.tester_reference || p.tester_email}</p>
                      <span
                        className="mt-1 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium"
                        style={{ color: stripeConf(p.tester_stripe_status).color, backgroundColor: stripeConf(p.tester_stripe_status).color + '15' }}
                      >
                        {stripeConf(p.tester_stripe_status).label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-white">{p.job_title}</p>
                      <p className="text-xs text-slate-500">{p.assignment_status || '—'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-white">{formatReward(p.reward_amount_minor, p.currency || 'GBP')}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-0.5 rounded-lg text-xs font-medium"
                        style={{ color: conf.color, backgroundColor: conf.color + '15', border: '1px solid ' + conf.color + '30' }}>
                        {conf.label}
                      </span>
                      {p.approved_at && (
                        <p className="text-xs text-slate-500 mt-1">Approved {new Date(p.approved_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {p.status === 'paid' && !transferReversed && (
                        <div>
                          <p className="text-xs text-emerald-400 font-medium">Paid via Stripe</p>
                          <p className="text-xs text-slate-500">{p.paid_at ? new Date(p.paid_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</p>
                          {transferRef && <p className="text-[11px] text-slate-500 font-mono mt-0.5">{transferRef}</p>}
                          {p.provider === 'manual' && <p className="text-[11px] text-amber-400 mt-0.5">Manual override</p>}
                        </div>
                      )}
                      {transferReversed && (
                        <div>
                          <p className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                            Transfer Reversed — Action Required
                          </p>
                          {transferRef && <p className="text-[11px] text-slate-500 font-mono mt-0.5">{transferRef}</p>}
                        </div>
                      )}
                      {p.status === 'approved' && transferFailed && (
                        <div className="flex items-center gap-1.5 text-amber-400">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">Action Required</span>
                        </div>
                      )}
                      {p.status === 'approved' && !transferFailed && (
                        <p className="text-xs text-slate-500">Awaiting payment</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {payingId === p.id && (
                          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 px-2">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing…
                          </span>
                        )}

                        {p.status === 'approved' && payingId !== p.id && !transferRef && ready && (
                          <button onClick={() => setConfirmPay(p)} disabled={statusUpdating === p.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 text-xs font-semibold cursor-pointer whitespace-nowrap">
                            <PoundSterling className="w-3.5 h-3.5" /> Pay Tester
                          </button>
                        )}

                        {p.status === 'approved' && payingId !== p.id && !transferRef && !ready && (
                          <span className="text-xs text-amber-400/80 px-2" title="Complete Stripe verification before paying">
                            {p.tester_stripe_status === 'not_started' ? 'Payment Setup Required' : 'Stripe Verification Required'}
                          </span>
                        )}

                        {p.status === 'approved' && payingId !== p.id && !transferRef && transferFailed && ready && (
                          <button onClick={() => payTester(p)} disabled={statusUpdating === p.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-white hover:bg-amber-600 text-xs font-semibold cursor-pointer whitespace-nowrap">
                            <RotateCcw className="w-3.5 h-3.5" /> Retry / Reconcile
                          </button>
                        )}

                        {p.status === 'approved' && !transferRef && (
                          <>
                            <button onClick={() => { setManualPay(p); setManualReason(''); }} disabled={statusUpdating === p.id}
                              className="p-1.5 rounded-lg bg-slate-500/10 text-slate-400 hover:bg-slate-500/20 cursor-pointer" title="Manual Payment Override">
                              <ShieldAlert className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => openReject(p)} disabled={statusUpdating === p.id}
                              className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 cursor-pointer" title="Reject">
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}

                        {statusUpdating === p.id && (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <DollarSign className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">No reward records found</p>
            <p className="text-sm text-slate-500 mt-1">{payments.length === 0 ? 'Approve a completed assignment to create a reward.' : 'No rewards match your filters.'}</p>
          </div>
        )}
      </div>

      {confirmPay && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" onClick={() => setConfirmPay(null)}>
          <div className="bg-[#1E293B] border border-[rgba(255,255,255,0.08)] rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-[rgba(255,255,255,0.08)]">
              <h2 className="text-lg font-bold text-white">Pay UAT Tester</h2>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Tester</span>
                <span className="text-white font-medium">{confirmPay.tester_name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">UAT</span>
                <span className="text-white font-medium">{confirmPay.job_title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Approved Reward</span>
                <span className="text-white font-bold">{formatReward(confirmPay.reward_amount_minor, confirmPay.currency || 'GBP')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Payment Method</span>
                <span className="text-white font-medium">Stripe Connect</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Destination</span>
                <span className="text-emerald-400 font-medium">Verified Stripe payment account</span>
              </div>
            </div>
            <div className="p-5 border-t border-[rgba(255,255,255,0.08)] flex justify-end gap-3">
              <button onClick={() => setConfirmPay(null)} className="px-4 py-2.5 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-xl text-sm text-slate-400 hover:text-white cursor-pointer whitespace-nowrap">Cancel</button>
              <button onClick={() => payTester(confirmPay)} disabled={payingId === confirmPay.id}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 rounded-xl text-sm font-semibold text-white cursor-pointer whitespace-nowrap">
                Pay {formatReward(confirmPay.reward_amount_minor, confirmPay.currency || 'GBP')}
              </button>
            </div>
          </div>
        </div>
      )}

      {manualPay && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" onClick={() => setManualPay(null)}>
          <div className="bg-[#1E293B] border border-[rgba(255,255,255,0.08)] rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-[rgba(255,255,255,0.08)]">
              <h2 className="text-lg font-bold text-white">Manual Payment Override</h2>
              <p className="text-xs text-slate-400 mt-1">{manualPay.tester_name} — {formatReward(manualPay.reward_amount_minor, manualPay.currency || 'GBP')}</p>
            </div>
            <div className="p-5">
              <div className="mb-3 p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-300">Only use this when a reward has been paid outside Stripe. A reason is required and the action is audited.</p>
              </div>
              <label className="text-xs text-slate-400 mb-1.5 block">Reason for override</label>
              <textarea value={manualReason} onChange={(e) => setManualReason(e.target.value)} rows={3}
                className="w-full px-4 py-2.5 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 focus:border-[#06B6D4]/40 resize-none" />
            </div>
            <div className="p-5 border-t border-[rgba(255,255,255,0.08)] flex justify-end gap-3">
              <button onClick={() => setManualPay(null)} className="px-4 py-2.5 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-xl text-sm text-slate-400 hover:text-white cursor-pointer whitespace-nowrap">Cancel</button>
              <button onClick={() => manualOverride(manualPay, manualReason)}
                disabled={!manualReason.trim() || statusUpdating === manualPay.id}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 rounded-xl text-sm font-semibold text-white cursor-pointer whitespace-nowrap">
                Confirm Override
              </button>
            </div>
          </div>
        </div>
      )}

      {rejectOpen && selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" onClick={() => setRejectOpen(false)}>
          <div className="bg-[#1E293B] border border-[rgba(255,255,255,0.08)] rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-[rgba(255,255,255,0.08)]">
              <h2 className="text-lg font-bold text-white">Reject Reward</h2>
              <p className="text-xs text-slate-400 mt-1">{selected.tester_name} — {formatReward(selected.reward_amount_minor, selected.currency || 'GBP')}</p>
            </div>
            <div className="p-5">
              <label className="text-xs text-slate-400 mb-1.5 block">Reason for Rejection</label>
              <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={3}
                className="w-full px-4 py-2.5 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 focus:border-[#06B6D4]/40 resize-none" />
            </div>
            <div className="p-5 border-t border-[rgba(255,255,255,0.08)] flex justify-end gap-3">
              <button onClick={() => setRejectOpen(false)} className="px-4 py-2.5 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-xl text-sm text-slate-400 hover:text-white cursor-pointer whitespace-nowrap">Cancel</button>
              <button onClick={() => rejectReward(selected.id, rejectReason)}
                disabled={!rejectReason.trim() || statusUpdating === selected.id}
                className="px-4 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-40 rounded-xl text-sm font-semibold text-white cursor-pointer whitespace-nowrap">
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}