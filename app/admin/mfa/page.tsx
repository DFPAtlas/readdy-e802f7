'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured, getSessionSafe } from '@/lib/supabase';
import { verifyAdminAccess } from '@/lib/admin-access';
import { getAdminMfaDestination } from '@/lib/admin-mfa';
import { Shield, Loader2, ArrowLeft, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type VerifiedFactor = {
  id: string;
  friendlyName: string;
};

type Phase = 'loading' | 'ready' | 'verifying' | 'error';

export default function AdminMfaChallengePage() {
  const router = useRouter();
  const mountedRef = useRef(true);
  const initStartedRef = useRef(false);
  const submittingRef = useRef(false);

  const [phase, setPhase] = useState<Phase>('loading');
  const [phaseMessage, setPhaseMessage] = useState('Verifying administrator…');
  const [error, setError] = useState('');
  const [factors, setFactors] = useState<VerifiedFactor[]>([]);
  const [selectedFactorId, setSelectedFactorId] = useState('');
  const [code, setCode] = useState('');
  const [showRecovery, setShowRecovery] = useState(false);

  const navigate = (path: string) => {
    if (!mountedRef.current) return;
    setTimeout(() => router.push(path), 100);
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (initStartedRef.current) return;
    initStartedRef.current = true;

    const run = async () => {
      if (!isSupabaseConfigured()) {
        setError('Authentication is temporarily unavailable because the application configuration could not be loaded.');
        setPhase('error');
        return;
      }

      setPhaseMessage('Verifying administrator…');

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        await supabase.auth.signOut();
        navigate('/admin/login');
        return;
      }

      const session = await getSessionSafe();
      if (!session || session.user.id !== userData.user.id) {
        await supabase.auth.signOut();
        navigate('/admin/login');
        return;
      }

      const access = await verifyAdminAccess(session);
      if (!access.allowed) {
        await supabase.auth.signOut();
        navigate('/admin/login');
        return;
      }

      setPhaseMessage('Checking multi-factor authentication status…');

      const mfa = await getAdminMfaDestination();

      if (mfa.destination === '/admin') {
        navigate('/admin');
        return;
      }
      if (mfa.destination === '/admin/mfa/setup') {
        navigate('/admin/mfa/setup');
        return;
      }
      if (mfa.destination !== '/admin/mfa') {
        setError('We could not verify your multi-factor authentication status. Please sign in again.');
        setPhase('error');
        return;
      }

      setPhaseMessage('Loading your authenticator…');

      const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();

      if (factorsError) {
        setError('We could not verify your multi-factor authentication status. Please sign in again.');
        setPhase('error');
        return;
      }

      const verified = (factorsData?.totp ?? []).filter(
        (f) => f && typeof f.id === 'string' && f.status === 'verified',
      );

      if (verified.length === 0) {
        navigate('/admin/mfa/setup');
        return;
      }

      const mapped: VerifiedFactor[] = verified.map((f, index) => ({
        id: f.id,
        friendlyName:
          f.friendly_name && f.friendly_name.trim() !== ''
            ? f.friendly_name.trim()
            : `Authenticator ${index + 1}`,
      }));

      setFactors(mapped);
      setSelectedFactorId(mapped[0].id);
      setPhase('ready');
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCodeChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 6);
    setCode(digits);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submittingRef.current) return;
    if (!selectedFactorId || code.trim().length !== 6) return;

    submittingRef.current = true;
    setPhase('verifying');
    setError('');

    const trimmedCode = code.trim();

    try {
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: selectedFactorId,
      });

      if (challengeError || !challengeData?.id) {
        setError('That code could not be verified. Check your authenticator app and try again.');
        setCode('');
        setPhase('ready');
        submittingRef.current = false;
        return;
      }

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: selectedFactorId,
        challengeId: challengeData.id,
        code: trimmedCode,
      });

      if (verifyError) {
        setError('That code could not be verified. Check your authenticator app and try again.');
        setCode('');
        setPhase('ready');
        submittingRef.current = false;
        return;
      }

      await supabase.auth.refreshSession();

      const aal = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

      if (aal.data?.currentLevel === 'aal2') {
        submittingRef.current = false;
        navigate('/admin');
        return;
      }

      setError('Your authentication code was accepted, but the secure session could not be confirmed. Please try signing in again.');
      setCode('');
      setPhase('ready');
      submittingRef.current = false;
    } catch {
      setError('That code could not be verified. Check your authenticator app and try again.');
      setCode('');
      setPhase('ready');
      submittingRef.current = false;
    }
  };

  const handleCancel = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const buttonDisabled =
    phase !== 'ready' || !selectedFactorId || code.trim().length !== 6;

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col">
      <div className="absolute top-6 left-6 z-10">
        <Link href="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-[#06B6D4] transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          Back to Website
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center">
              <img
                src="https://storage.readdy-site.link/project_files/9c829bf4-c727-45a7-99f8-358e1780c66a/eee9f9ba-b907-488b-a1a8-f6d02534a71b_compressed_Remove-Background-Keep-Foot-Logo.webp"
                alt="Digital Footprint Logo"
                width={64}
                height={64}
                className="object-contain rounded-xl mb-4"
              />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Verify your identity</h1>
            <p className="text-slate-400 text-sm">Digital Footprint — Admin Access Only</p>
          </div>

          <div className="bg-[#1E293B] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 shadow-sm">
            {phase === 'loading' && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-[#06B6D4] to-[#0891B2] rounded-2xl flex items-center justify-center shadow-lg shadow-[#06B6D4]/20 mb-5">
                  <Loader2 className="w-7 h-7 text-white animate-spin" />
                </div>
                <p className="text-sm text-slate-300">{phaseMessage}</p>
              </div>
            )}

            {phase === 'error' && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-14 h-14 bg-red-500/20 rounded-2xl flex items-center justify-center mb-5">
                  <Shield className="w-7 h-7 text-red-400" />
                </div>
                <p className="text-sm text-red-400 mb-5">{error}</p>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-5 py-2.5 rounded-xl font-medium text-sm text-slate-300 bg-white/5 border border-[rgba(255,255,255,0.1)] hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Sign out
                </button>
              </div>
            )}

            {phase !== 'loading' && phase !== 'error' && (
              <>
                <div className="flex items-center justify-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#06B6D4] to-[#0891B2] rounded-2xl flex items-center justify-center shadow-lg shadow-[#06B6D4]/20">
                    <KeyRound className="w-7 h-7 text-white" />
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h2 className="text-lg font-semibold text-white mb-1">Enter your authentication code</h2>
                  <p className="text-sm text-slate-400">
                    Enter the 6-digit code from your authenticator app to continue to the Digital Footprint admin portal.
                  </p>
                </div>

                {factors.length > 1 && (
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Authenticator</label>
                    <div className="flex flex-col gap-2">
                      {factors.map((factor) => (
                        <button
                          key={factor.id}
                          type="button"
                          onClick={() => setSelectedFactorId(factor.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm transition-colors cursor-pointer whitespace-nowrap ${
                            selectedFactorId === factor.id
                              ? 'bg-[#06B6D4]/10 border-[#06B6D4]/40 text-white'
                              : 'bg-white/5 border-[rgba(255,255,255,0.08)] text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          <span className="w-8 h-8 rounded-lg bg-[#06B6D4]/15 flex items-center justify-center shrink-0">
                            <KeyRound className="w-4 h-4 text-[#06B6D4]" />
                          </span>
                          <span className="flex-1">{factor.friendlyName}</span>
                          {selectedFactorId === factor.id && (
                            <span className="w-5 h-5 rounded-full bg-[#06B6D4] flex items-center justify-center">
                              <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Authentication code</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      value={code}
                      onChange={(e) => handleCodeChange(e.target.value)}
                      placeholder="000000"
                      autoFocus
                      className="w-full px-4 py-3 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-xl text-center text-xl tracking-[0.4em] text-white placeholder-slate-600 focus:outline-none focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/15 transition-all"
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={buttonDisabled}
                    className="w-full py-3 bg-gradient-to-r from-[#06B6D4] to-[#0891B2] rounded-xl font-bold text-white hover:shadow-lg hover:shadow-[#06B6D4]/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 whitespace-nowrap"
                  >
                    {phase === 'verifying' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Verifying…
                      </>
                    ) : (
                      'Verify'
                    )}
                  </button>
                </form>

                <div className="mt-5 pt-5 border-t border-[rgba(255,255,255,0.08)] space-y-3">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setShowRecovery((v) => !v)}
                      className="text-sm text-[#06B6D4] hover:text-[#0891B2] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Can&apos;t access your authenticator?
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Cancel and sign out
                    </button>
                  </div>

                  {showRecovery && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm text-amber-300">
                      Contact an authorised Digital Footprint owner or super administrator to recover administrator MFA access.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}