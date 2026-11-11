'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured, getSessionSafe } from '@/lib/supabase';
import { verifyAdminAccess } from '@/lib/admin-access';
import { getAdminMfaDestination } from '@/lib/admin-mfa';
import { Shield, Loader2, Copy, Check, ArrowLeft, KeyRound } from 'lucide-react';
import QRCode from 'qrcode';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Enrollment = {
  factorId: string;
  qrCode: string;
  secret: string;
};

type Phase = 'loading' | 'preparing' | 'ready' | 'verifying' | 'success' | 'error';

export default function AdminMfaSetupPage() {
  const router = useRouter();
  const mountedRef = useRef(true);
  const enrollStartedRef = useRef(false);

  const [phase, setPhase] = useState<Phase>('loading');
  const [phaseMessage, setPhaseMessage] = useState('Verifying administrator…');
  const [error, setError] = useState('');
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);

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
    if (enrollStartedRef.current) return;
    enrollStartedRef.current = true;

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
      if (mfa.destination === '/admin/mfa') {
        navigate('/admin/mfa');
        return;
      }
      if (mfa.destination !== '/admin/mfa/setup') {
        setError('We could not verify your multi-factor authentication status. Please try signing in again.');
        setPhase('error');
        return;
      }

      setPhaseMessage('Preparing authenticator setup…');

      const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();

      if (factorsError) {
        setError('We could not prepare multi-factor authentication setup. Please try again.');
        setPhase('error');
        return;
      }

      const totpFactors = (factorsData?.totp ?? []).filter((f) => f && typeof f.id === 'string');

      const verified = totpFactors.filter((f) => f.status === 'verified');
      const unverified = totpFactors.filter((f) => f.status === 'unverified');

      if (verified.length > 0) {
        navigate('/admin/mfa');
        return;
      }

      if (unverified.length > 0) {
        setPhaseMessage('Cleaning up incomplete setup…');
        for (const factor of unverified) {
          const { error: unenrollError } = await supabase.auth.mfa.unenroll({ factorId: factor.id });
          if (unenrollError) {
            setError('We could not prepare multi-factor authentication setup. Please try again.');
            setPhase('error');
            return;
          }
        }
      }

      setPhaseMessage('Generating authenticator setup…');

      const { data: enrollData, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Digital Footprint Admin',
      });

      if (enrollError || !enrollData) {
        setError('We could not prepare multi-factor authentication setup. Please try again.');
        setPhase('error');
        return;
      }

      let qrCodeData = enrollData.totp?.qr_code ?? '';
      if (enrollData.totp?.uri) {
        try {
          qrCodeData = await QRCode.toDataURL(enrollData.totp.uri, {
            width: 240,
            margin: 2,
            errorCorrectionLevel: 'M',
            color: { dark: '#000000', light: '#FFFFFF' },
          });
        } catch {
          // silently keep the original SVG data URI if generation fails
        }
      }

      setEnrollment({
        factorId: enrollData.id,
        qrCode: qrCodeData,
        secret: enrollData.totp?.secret ?? '',
      });

      setPhase('ready');
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = async () => {
    if (!enrollment?.secret || copied) return;
    try {
      await navigator.clipboard.writeText(enrollment.secret);
      setCopied(true);
      setTimeout(() => {
        if (mountedRef.current) setCopied(false);
      }, 2000);
    } catch {
      // ignore
    }
  };

  const handleCodeChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 6);
    setCode(digits);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollment || code.trim().length !== 6) return;

    setPhase('verifying');
    setError('');

    const trimmedCode = code.trim();

    try {
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: enrollment.factorId,
      });

      if (challengeError || !challengeData?.id) {
        setError('That code could not be verified. Check your authenticator app and try again.');
        setPhase('ready');
        return;
      }

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: enrollment.factorId,
        challengeId: challengeData.id,
        code: trimmedCode,
      });

      if (verifyError) {
        setError('That code could not be verified. Check your authenticator app and try again.');
        setPhase('ready');
        return;
      }

      await supabase.auth.refreshSession();

      const aal = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

      if (aal.data?.currentLevel === 'aal2') {
        setPhase('success');
        navigate('/admin');
        return;
      }

      setError('We could not verify your multi-factor authentication status. Please try signing in again.');
      setPhase('ready');
    } catch {
      setError('That code could not be verified. Check your authenticator app and try again.');
      setPhase('ready');
    }
  };

  const handleCancel = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const buttonDisabled =
    phase !== 'ready' || code.trim().length !== 6 || !enrollment;

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
            <h1 className="text-2xl font-bold text-white mb-1">Secure your administrator account</h1>
            <p className="text-slate-400 text-sm">Digital Footprint — Multi-Factor Authentication Setup</p>
          </div>

          <div className="bg-[#1E293B] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 shadow-sm">
            {(phase === 'loading' || phase === 'preparing') && (
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
                  Return to Sign In
                </button>
              </div>
            )}

            {phase === 'success' && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mb-5">
                  <Check className="w-7 h-7 text-green-400" />
                </div>
                <h2 className="text-lg font-semibold text-white mb-1">Multi-factor authentication enabled</h2>
                <p className="text-sm text-slate-400">Redirecting to the admin portal…</p>
              </div>
            )}

            {phase === 'ready' && enrollment && (
              <>
                <div className="flex items-center justify-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#06B6D4] to-[#0891B2] rounded-2xl flex items-center justify-center shadow-lg shadow-[#06B6D4]/20">
                    <KeyRound className="w-7 h-7 text-white" />
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 mb-6">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-[#06B6D4]">
                    <span className="w-5 h-5 rounded-full bg-[#06B6D4] text-white flex items-center justify-center text-[10px]">1</span>
                    Scan
                  </span>
                  <span className="w-8 h-px bg-[rgba(255,255,255,0.15)]" />
                  <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                    <span className="w-5 h-5 rounded-full bg-white/10 text-slate-400 flex items-center justify-center text-[10px]">2</span>
                    Verify
                  </span>
                </div>

                <div className="text-center mb-6">
                  <h2 className="text-lg font-semibold text-white mb-1">Set up multi-factor authentication</h2>
                  <p className="text-sm text-slate-400">
                    Digital Footprint requires an authenticator app for administrator access. Scan the QR code with your
                    authenticator app, such as Microsoft Authenticator, Google Authenticator, 1Password, or Authy.
                  </p>
                </div>

                {enrollment.qrCode ? (
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-white rounded-xl">
                      <img
                        src={enrollment.qrCode}
                        alt="TOTP QR code"
                        width={240}
                        height={240}
                        className="block"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center mb-4">
                    <div className="w-[240px] h-[240px] bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-xl flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-slate-500 animate-spin" />
                    </div>
                  </div>
                )}

                {enrollment.secret && (
                  <div className="mb-6">
                    <p className="text-center text-xs text-slate-500 mb-2">Can&apos;t scan the QR code?</p>
                    <div className="flex items-center gap-2 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3">
                      <span className="flex-1 font-mono text-sm tracking-widest text-white break-all select-all">
                        {enrollment.secret}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 text-xs font-medium text-[#06B6D4] hover:text-[#0891B2] transition-colors cursor-pointer whitespace-nowrap"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                )}

                <form onSubmit={handleVerify} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Enter the 6-digit code
                    </label>
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
                      'Enable MFA'
                    )}
                  </button>
                </form>
              </>
            )}

            {phase === 'ready' && (
              <div className="mt-5 pt-5 border-t border-[rgba(255,255,255,0.08)] text-center">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  Cancel and sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}