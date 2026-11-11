'use client';

import { useLayoutEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

type Step = 'request' | 'check-email' | 'confirm' | 'withdrawn';

export default function WithdrawApplicationPage() {
  const [step, setStep] = useState<Step>('request');
  const [token, setToken] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useLayoutEffect(() => {
    const token = new URLSearchParams(window.location.hash.slice(1)).get('token');
    if (!token) return;
    window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
    if (/^[0-9a-f]{64}$/.test(token)) {
      setToken(token);
      setStep('confirm');
    } else {
      setError('This link is invalid. Request a new link below.');
    }
  }, []);

  const requestLink = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError('');
    try {
      const { data, error } = await supabase.functions.invoke('public-careers', {
        body: { action: 'request', email: form.get('email'), websiteAlt: form.get('website_alt') },
      });
      if (error || data?.ok !== true) throw new Error('Withdrawal link request failed');
      setStep('check-email');
    } catch {
      setError('We could not request a link. Please try again shortly.');
    } finally {
      setBusy(false);
    }
  };

  const confirmWithdrawal = async () => {
    setBusy(true);
    setError('');
    try {
      const { data, error } = await supabase.functions.invoke('public-careers', {
        body: { action: 'withdraw', token },
      });
      if (error || data?.ok !== true) throw new Error('Withdrawal confirmation failed');
      setToken('');
      if (data.withdrawn === true) {
        setStep('withdrawn');
      } else {
        setStep('request');
        setError('This link has expired, has already been used, or the application is no longer active. You can request another link below.');
      }
    } catch {
      setError('We could not confirm the withdrawal. Please try again shortly.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main id="main-content" className="mx-auto max-w-2xl px-6 pb-20 pt-32">
        <Link href="/careers" className="text-sm font-medium text-slate-600 hover:text-cyan-700">
          Back to Careers
        </Link>
        <h1 className="mt-5 text-3xl font-bold text-slate-900">Withdraw an application</h1>
        <div className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
          {step === 'request' && (
            <form onSubmit={requestLink} className="space-y-5">
              <p className="text-sm text-slate-600">
                Enter the email address you applied with. If there is an active application, we’ll email you a confirmation link.
              </p>
              <div>
                <label htmlFor="withdrawal-email" className="mb-1.5 block text-sm font-medium text-slate-700">Email address</label>
                <input id="withdrawal-email" name="email" type="email" autoComplete="email" maxLength={254} required
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900" />
              </div>
              <input type="text" name="website_alt" tabIndex={-1} autoComplete="off" aria-hidden="true" className="sr-only" />
              <button type="submit" disabled={busy}
                className="rounded-xl bg-cyan-700 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
                {busy ? 'Requesting link…' : 'Email me a link'}
              </button>
            </form>
          )}
          {step === 'check-email' && (
            <p role="status" className="text-sm text-slate-700">
              If you have an active application, check your email for a link to withdraw it. Links expire after 30 minutes.
            </p>
          )}
          {step === 'confirm' && (
            <>
              <p className="text-sm text-slate-700">Confirm that you want to withdraw the application selected in your email.</p>
              <button type="button" onClick={confirmWithdrawal} disabled={busy}
                className="rounded-xl bg-red-700 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
                {busy ? 'Withdrawing…' : 'Confirm withdrawal'}
              </button>
            </>
          )}
          {step === 'withdrawn' && <p role="status" className="text-sm text-slate-700">Your application has been withdrawn.</p>}
          <p className="text-sm text-slate-600">
            If you need help, <Link href="/contact" className="font-medium text-cyan-700 underline">contact us</Link>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
