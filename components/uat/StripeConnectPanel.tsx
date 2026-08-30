'use client';

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useUATTester } from '@/components/uat/UATTesterProvider';
import {
  invokeStripeConnect,
  normalizeStripeStatus,
  STRIPE_STATUS_CONFIG,
  type TesterStripeFields,
} from '@/lib/uat-stripe-connect';
import { CreditCard, ShieldCheck, ArrowLeftRight, Landmark, Loader2, RefreshCw, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';

export default function StripeConnectPanel({ autoRefresh = false }: { autoRefresh?: boolean }) {
  const { tester } = useUATTester();
  const [fields, setFields] = useState<TesterStripeFields | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!tester?.id) return;
    const { data } = await supabase
      .from('uat_testers')
      .select('stripe_account_id, stripe_onboarding_complete, stripe_details_submitted, stripe_transfers_enabled, stripe_payouts_enabled, stripe_payment_setup_status, stripe_requirements_due, stripe_connect_created_at, stripe_connect_updated_at')
      .eq('id', tester.id)
      .maybeSingle();
    if (data) setFields(data as TesterStripeFields);
    setLoading(false);
  }, [tester?.id]);

  useEffect(() => { load(); }, [load]);

  const refresh = useCallback(async () => {
    setBusy(true);
    setError('');
    try {
      await invokeStripeConnect('refresh');
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to refresh payment status.');
    } finally {
      setBusy(false);
    }
  }, [load]);

  useEffect(() => {
    if (autoRefresh) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openStripe = (url?: string) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSetup = async () => {
    setBusy(true);
    setError('');
    try {
      const data = await invokeStripeConnect('setup');
      openStripe(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to start payment setup.');
    } finally {
      setBusy(false);
    }
  };

  const handleManage = async () => {
    setBusy(true);
    setError('');
    try {
      const data = await invokeStripeConnect('manage');
      openStripe(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to open your payment account.');
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
      </div>
    );
  }

  const status = normalizeStripeStatus(fields?.stripe_payment_setup_status);
  const conf = STRIPE_STATUS_CONFIG[status];
  const dueCount = fields?.stripe_requirements_due?.count ?? 0;

  const ready = status === 'ready';

  const primaryButton = ready ? (
    <button
      onClick={handleManage}
      disabled={busy}
      className="inline-flex items-center gap-2 rounded-xl bg-[#2878d0] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-200 hover:bg-[#1e68b9] transition disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
      Manage Payment Account
    </button>
  ) : status === 'not_started' ? (
    <button
      onClick={handleSetup}
      disabled={busy}
      className="inline-flex items-center gap-2 rounded-xl bg-[#2878d0] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-200 hover:bg-[#1e68b9] transition disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
      Set Up Payments
    </button>
  ) : (
    <button
      onClick={handleSetup}
      disabled={busy}
      className="inline-flex items-center gap-2 rounded-xl bg-[#2878d0] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-200 hover:bg-[#1e68b9] transition disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
      Complete Verification
    </button>
  );

  const headline = (() => {
    switch (status) {
      case 'ready': return 'Ready to receive UAT rewards';
      case 'not_started': return 'Payment Setup Required';
      case 'onboarding': return 'Onboarding in progress';
      case 'verification_required': return 'Verification required';
      case 'restricted': return 'Your payment account requires attention';
      case 'disabled': return 'Payments are currently unavailable';
      default: return 'Payment Account';
    }
  })();

  const description = (() => {
    switch (status) {
      case 'ready':
        return 'Your Stripe verification is complete and your payout account is enabled.';
      case 'not_started':
        return 'Complete Stripe verification before you can receive paid UAT rewards.';
      case 'onboarding':
        return 'You started setting up your Stripe account. Continue to finish verification.';
      case 'verification_required':
        return dueCount > 0
          ? `Stripe requires additional information before UAT rewards can be paid.`
          : 'Stripe requires additional information before UAT rewards can be paid.';
      case 'restricted':
        return 'Stripe has restricted your account and requires further action before payouts can be enabled.';
      case 'disabled':
        return 'Your payment account is currently disabled. Please contact support.';
      default:
        return '';
    }
  })();

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6">
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${ready ? 'bg-emerald-50' : 'bg-sky-50'}`}>
            <Landmark className={`h-6 w-6 ${ready ? 'text-emerald-600' : 'text-[#2878d0]'}`} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Payment Account</p>
            <h2 className={`mt-1 text-lg font-bold ${ready ? 'text-emerald-700' : 'text-[#17325c]'}`}>{headline}</h2>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>
        </div>
        <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${conf.badge}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${conf.dot}`} />
          {conf.badgeText}
        </span>
      </div>

      <div className="p-6">
        <div className="mb-6 space-y-3">
          <Row
            ready={ready}
            icon={<ShieldCheck className="h-4 w-4" />}
            label="Identity Verification"
            value={ready ? 'Complete' : fields?.stripe_details_submitted ? 'Submitted' : 'Not complete'}
          />
          <Row
            ready={fields?.stripe_transfers_enabled}
            icon={<ArrowLeftRight className="h-4 w-4" />}
            label="Transfers"
            value={fields?.stripe_transfers_enabled ? 'Enabled' : 'Disabled'}
          />
          <Row
            ready={fields?.stripe_payouts_enabled}
            icon={<CreditCard className="h-4 w-4" />}
            label="Payouts"
            value={fields?.stripe_payouts_enabled ? 'Enabled' : 'Disabled'}
          />
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="flex items-center gap-3">
          {primaryButton}
          <button
            onClick={refresh}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${busy ? 'animate-spin' : ''}`} />
            Refresh Status
          </button>
        </div>

        <p className="mt-5 text-xs text-slate-400">
          Your bank details and identity documents are handled securely by Stripe and are never stored by Digital Footprint.
        </p>
      </div>
    </div>
  );
}

function Row({ ready, icon, label, value }: { ready: boolean; icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3">
      <span className="flex items-center gap-2.5 text-sm font-medium text-slate-600">
        <span className={ready ? 'text-emerald-600' : 'text-slate-400'}>{icon}</span>
        {label}
      </span>
      <span className="flex items-center gap-1.5 text-sm">
        {ready ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span className="font-semibold text-emerald-700">{value}</span>
          </>
        ) : (
          <span className="font-semibold text-slate-500">{value}</span>
        )}
      </span>
    </div>
  );
}