'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from '@/components/motion';
import { Mail, ArrowLeft, CircleCheck, LoaderCircle, FlaskConical, ShieldCheck, Smartphone, Clock3, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function UATTesterLoginPage() {
  const mountedRef = useRef(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<'password' | 'magic'>('password');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: invokeError } = await supabase.functions.invoke('send-uat-magic-link', {
        body: { email },
      });

      if (!mountedRef.current) return;
      if (invokeError) {
        setError('We could not send the link right now. Please try again in a minute.');
      } else {
        setSent(true);
      }
    } catch (err: any) {
      if (mountedRef.current) {
        setError(err?.message || 'Something went wrong. Please try again.');
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!mountedRef.current) return;
      if (authError) {
        setError(authError.message);
      }
    } catch (err: any) {
      if (mountedRef.current) {
        setError(err?.message || 'Something went wrong. Please try again.');
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#eef4e9] to-[#edf5ff] flex flex-col">
      <div className="absolute top-6 left-6">
        <Link href="/uat-testing" className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#2878d0] transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          Back to UAT TestLab
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Link href="/uat-testing" className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#2878d0] mb-5 shadow-lg shadow-blue-200">
              <FlaskConical className="w-8 h-8 text-white" />
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-[#17325c]">UAT TestLab</h1>
            <p className="mt-1 text-slate-500">Sign in to your tester account</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            {!sent && (
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-full mb-6">
                <button
                  type="button"
                  onClick={() => { setMode('password'); setError(null); }}
                  className={`flex-1 px-4 py-2 text-sm font-semibold rounded-full transition-all cursor-pointer whitespace-nowrap ${mode === 'password' ? 'bg-white text-[#17325c] shadow-sm' : 'text-slate-500 hover:text-[#17325c]'}`}
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('magic'); setError(null); }}
                  className={`flex-1 px-4 py-2 text-sm font-semibold rounded-full transition-all cursor-pointer whitespace-nowrap ${mode === 'magic' ? 'bg-white text-[#17325c] shadow-sm' : 'text-slate-500 hover:text-[#17325c]'}`}
                >
                  Magic Link
                </button>
              </div>
            )}
            {!sent && mode === 'password' && (
              <form onSubmit={handlePasswordSignIn} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#17325c] mb-2">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      autoComplete="email"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#17325c] placeholder-slate-400 focus:outline-none focus:border-[#2878d0] focus:ring-1 focus:ring-[#2878d0]/20 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#17325c] mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                      className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#17325c] placeholder-slate-400 focus:outline-none focus:border-[#2878d0] focus:ring-1 focus:ring-[#2878d0]/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-slate-400 hover:text-[#2878d0] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Use the password provided when your tester login was created.</p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="w-full px-6 py-3 bg-[#2878d0] hover:bg-[#1e68b9] text-white font-semibold text-sm rounded-xl transition-all cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="w-4 h-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>

                <p className="text-center text-xs text-slate-400">
                  Not a tester yet?{' '}
                  <Link href="/uat-testing/apply" className="font-semibold text-[#2878d0] hover:underline cursor-pointer">
                    Apply here
                  </Link>
                </p>
              </form>
            )}
            {!sent && mode === 'magic' && (
              <form onSubmit={handleSendLink} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#17325c] mb-2">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      data-testid="uat-login-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      autoComplete="email"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#17325c] placeholder-slate-400 focus:outline-none focus:border-[#2878d0] focus:ring-1 focus:ring-[#2878d0]/20 transition-all"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-2">We&apos;ll send you a magic link for password-free sign in.</p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  data-testid="uat-login-submit"
                  disabled={loading || !email}
                  className="w-full px-6 py-3 bg-[#2878d0] hover:bg-[#1e68b9] text-white font-semibold text-sm rounded-xl transition-all cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="w-4 h-4 animate-spin" />
                      Sending link...
                    </>
                  ) : (
                    'Send Magic Link'
                  )}
                </button>

                <p className="text-center text-xs text-slate-400">
                  Not a tester yet?{' '}
                  <Link href="/uat-testing/apply" className="font-semibold text-[#2878d0] hover:underline cursor-pointer">
                    Apply here
                  </Link>
                </p>
              </form>
            )}
            {sent && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 bg-[#2878d0]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CircleCheck className="w-8 h-8 text-[#2878d0]" />
                </div>
                <h3 className="text-xl font-bold text-[#17325c] mb-2">Check your email</h3>
                <p className="text-slate-500 text-sm mb-1">We sent a magic link to</p>
                <p className="text-[#17325c] font-medium mb-4">{email}</p>
                <p className="text-xs text-slate-400">Click the link in the email to sign in. If you don&apos;t see it, check your spam folder.</p>
                <button
                  onClick={() => { setSent(false); setError(null); }}
                  className="mt-6 text-sm text-[#2878d0] hover:underline cursor-pointer"
                >
                  Use a different email
                </button>
              </motion.div>
            )}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { icon: ShieldCheck, label: 'Secure access' },
              { icon: Smartphone, label: 'Any device' },
              { icon: Clock3, label: 'Quick sign in' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                <Icon className="w-4 h-4 text-[#617a50]" />
                <span className="text-xs text-slate-400 whitespace-nowrap">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}