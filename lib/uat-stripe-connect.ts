import { supabase } from './supabase';

export type StripeSetupStatus =
  | 'not_started'
  | 'onboarding'
  | 'verification_required'
  | 'restricted'
  | 'ready'
  | 'disabled';

export interface StripeReadiness {
  status: StripeSetupStatus;
  details_submitted: boolean;
  transfers_enabled: boolean;
  payouts_enabled: boolean;
  requirements_due_count: number;
  requirements_due: { count: number; eventually_due_count: number } | null;
  disabled_reason: string | null;
}

export interface TesterStripeFields {
  stripe_account_id: string | null;
  stripe_onboarding_complete: boolean;
  stripe_details_submitted: boolean;
  stripe_transfers_enabled: boolean;
  stripe_payouts_enabled: boolean;
  stripe_payment_setup_status: StripeSetupStatus | null;
  stripe_requirements_due: { count: number; eventually_due_count?: number } | null;
  stripe_connect_created_at: string | null;
  stripe_connect_updated_at: string | null;
}

export const STRIPE_STATUS_CONFIG: Record<
  StripeSetupStatus,
  { label: string; dot: string; badge: string; badgeText: string }
> = {
  not_started: { label: 'Not Set Up', dot: 'bg-slate-400', badge: 'bg-slate-100 text-slate-600', badgeText: 'Not Set Up' },
  onboarding: { label: 'Onboarding', dot: 'bg-violet-500', badge: 'bg-violet-100 text-violet-700', badgeText: 'Onboarding' },
  verification_required: { label: 'Verification Required', dot: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700', badgeText: 'Verification Required' },
  restricted: { label: 'Action Required', dot: 'bg-orange-500', badge: 'bg-orange-100 text-orange-700', badgeText: 'Action Required' },
  ready: { label: 'Ready', dot: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700', badgeText: 'Ready' },
  disabled: { label: 'Unavailable', dot: 'bg-slate-400', badge: 'bg-slate-100 text-slate-500', badgeText: 'Unavailable' },
};

export function normalizeStripeStatus(value: string | null | undefined): StripeSetupStatus {
  if (value === 'onboarding' || value === 'verification_required' || value === 'restricted' || value === 'ready' || value === 'disabled') {
    return value;
  }
  return 'not_started';
}

export type StripeConnectErrorKind = 'network' | 'auth' | 'function' | 'stripe';

export class StripeConnectError extends Error {
  kind: StripeConnectErrorKind;
  constructor(kind: StripeConnectErrorKind, message: string) {
    super(message);
    this.name = 'StripeConnectError';
    this.kind = kind;
  }
}

function classifyMessage(msg: string): StripeConnectErrorKind {
  if (/authentication|invalid session|tester profile|sign in/i.test(msg)) return 'auth';
  if (/stripe|not configured|connected account|create.*account/i.test(msg)) return 'stripe';
  return 'function';
}

export async function invokeStripeConnect(
  action: 'setup' | 'onboard' | 'manage' | 'refresh',
): Promise<{ url?: string; account_id?: string; readiness?: StripeReadiness }> {
  let data: unknown;
  let invokeError: { message?: string; context?: { status?: number } } | null = null;

  try {
    const res = await supabase.functions.invoke('uat-stripe-connect', { body: { action } });
    data = res.data;
    invokeError = (res.error as typeof invokeError) ?? null;
  } catch {
    throw new StripeConnectError(
      'network',
      'Network/CORS error — the payment service could not be reached. Please check your connection and try again.',
    );
  }

  if (invokeError) {
    const status = invokeError.context?.status ?? 0;
    if (status === 401 || status === 403) {
      throw new StripeConnectError('auth', 'Authentication error — your session may have expired. Please sign in again.');
    }
    if (status === 502 || status === 503) {
      throw new StripeConnectError('stripe', 'Stripe error — the payment service is temporarily unavailable. Please try again shortly.');
    }
    throw new StripeConnectError('function', 'Payment service error — please try again.');
  }

  if (data && typeof data === 'object' && typeof (data as { error?: unknown }).error === 'string') {
    const msg = (data as { error: string }).error;
    const kind = classifyMessage(msg);
    if (kind === 'auth') throw new StripeConnectError('auth', 'Authentication error — your session may have expired. Please sign in again.');
    if (kind === 'stripe') throw new StripeConnectError('stripe', `Stripe error — ${msg}`);
    throw new StripeConnectError('function', `Payment service error — ${msg}`);
  }

  return (data ?? {}) as { url?: string; account_id?: string; readiness?: StripeReadiness };
}