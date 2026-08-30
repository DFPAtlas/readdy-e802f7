'use client';

import { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function PBXWaitlistSection() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const honeypot = (formData.get('website_alt') as string || '').trim();
    if (honeypot) {
      setStatus('success');
      form.reset();
      return;
    }

    formData.delete('website_alt');

    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('https://readdy.ai/api/form/da8p0t1tacug2b80sjlg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString(),
      });

      const responseText = await res.text();
      let parsed: any = null;
      try { parsed = JSON.parse(responseText); } catch { parsed = null; }

      const serverMsg =
        parsed?.meta?.message ||
        parsed?.message ||
        parsed?.meta?.detail ||
        responseText;

      const isSpam = typeof serverMsg === 'string' && /spam|form data is spam/i.test(serverMsg);

      if (res.ok && parsed?.code === 'OK') {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
        setErrorMsg(isSpam ? 'Something went wrong. Please try again.' : (serverMsg || 'Something went wrong. Please try again.'));
      }
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-[#F59E0B]/25 bg-gradient-to-br from-[#1E293B] via-[#1E293B] to-[#F59E0B]/[0.04] p-6">
      <style>{`.wp-hp-field{position:absolute;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none}`}</style>

      <div className="absolute -top-20 -right-16 w-64 h-64 bg-[#F59E0B]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-16 w-56 h-56 bg-[#06B6D4]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col lg:flex-row lg:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/20 whitespace-nowrap">
              Early Access
            </span>
          </div>
          <h3 className="text-lg font-bold text-white">Join the Cloud PBX waitlist</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Be first in line when the PBX system goes live. We will email you launch updates, early-access invites, and a founding-member offer.
          </p>
        </div>

        <div className="w-full lg:w-[380px] shrink-0">
          {status === 'success' ? (
            <div className="flex items-center gap-3 rounded-lg border border-[#10B981]/25 bg-[#10B981]/10 px-4 py-3.5">
              <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">You are on the list!</p>
                <p className="text-xs text-slate-400">We will be in touch when we launch.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} data-readdy-form className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@company.com"
                  className="w-full bg-[#0F172A] border border-[rgba(255,255,255,0.08)] rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#F59E0B]/50 transition-colors"
                />
              </div>
              <input
                type="text"
                name="website_alt"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                readOnly
                className="wp-hp-field"
              />
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#D97706] hover:to-[#B45309] transition-all cursor-pointer whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? 'Joining…' : (
                  <>
                    Join Waitlist
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {status === 'error' && (
            <p className="flex items-center gap-1.5 text-xs text-[#EF4444] mt-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errorMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}