import { supabase } from './supabase';

export interface PayTesterResult {
  ok: boolean;
  status?: string;
  payment_id?: string;
  stripe_transfer_id?: string;
  stripe_transfer_status?: string;
  already_paid?: boolean;
  error?: string;
  code?: string;
  message?: string;
}

export async function payUatTester(paymentId: string): Promise<PayTesterResult> {
  const { data, error } = await supabase.functions.invoke('pay-uat-tester', {
    body: { payment_id: paymentId },
  });
  if (error) {
    throw new Error(error.message || 'Unable to reach the payment service. Please try again.');
  }
  return (data ?? {}) as PayTesterResult;
}