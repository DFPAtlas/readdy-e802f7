'use client';

import { useLayoutEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from '@/components/motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { blogPosts } from './posts';

export default function BlogPage() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'check-email' | 'confirmed' | 'error'>('idle');
  const [confirmationToken, setConfirmationToken] = useState('');
  const [formError, setFormError] = useState('');

  const featuredPost = blogPosts.find((p) => p.featured) || blogPosts[0];
  const remainingPosts = blogPosts.filter((p) => p.slug !== featuredPost?.slug);

  useLayoutEffect(() => {
    const token = new URLSearchParams(window.location.hash.slice(1)).get('newsletter-token');
    if (!token) return;
    window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search + '#newsletter');
    if (/^[0-9a-f]{64}$/.test(token)) setConfirmationToken(token);
    else setFormError('This confirmation link is invalid. You can sign up again below.');
    document.getElementById('newsletter')?.scrollIntoView();
  }, []);

  const handleNewsletterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setFormStatus('submitting');
    setFormError('');
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data, error } = await supabase.functions.invoke('public-newsletter', {
        body: {
          action: 'subscribe',
          email: formData.get('email'),
          websiteAlt: formData.get('website_alt'),
          marketingConsent: formData.get('newsletter_consent') === 'on',
        },
      });
      if (error || data?.ok !== true) throw new Error('Newsletter signup failed');
      form.reset();
      setFormStatus('check-email');
    } catch {
      setFormError('We could not request a confirmation email. Please try again shortly.');
      setFormStatus('error');
    }
  };

  const confirmNewsletter = async () => {
    setFormStatus('submitting');
    setFormError('');
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data, error } = await supabase.functions.invoke('public-newsletter', {
        body: { action: 'confirm', token: confirmationToken },
      });
      if (error || data?.ok !== true) throw new Error('Newsletter confirmation failed');
      setConfirmationToken('');
      if (data.confirmed === true) {
        setFormStatus('confirmed');
      } else {
        setFormStatus('error');
        setFormError(data.unsubscribed
          ? 'This address is currently unsubscribed. Contact us if you would like help rejoining.'
          : 'This confirmation link has expired or is invalid. You can sign up again below.');
      }
    } catch {
      setFormError('We could not confirm your subscription. Please try again shortly.');
      setFormStatus('error');
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 bg-white text-slate-800">
        <section className="py-20 px-6 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(6,182,212,0.05),transparent_60%)]" />
          <div className="relative z-10 max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#06B6D4]/10 border border-[#06B6D4]/20 text-[#06B6D4] text-sm font-medium mb-6">
                <i className="ri-article-line w-4 h-4 flex items-center justify-center" />
                Insights
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-slate-900">Insights</h1>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                Practical thinking on technology, automation, cloud infrastructure and digital systems for independent UK businesses.
              </p>
            </motion.div>

            {featuredPost && (
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <Link
                  href="/blog"
                  className="group block bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-[#06B6D4]/40 hover:shadow-xl hover:shadow-[#06B6D4]/5 transition-all duration-300 cursor-pointer"
                >
                  <div className="grid md:grid-cols-5">
                    <div className="md:col-span-2 bg-gradient-to-br from-[#0A1628] to-[#0F1D32] p-8 flex items-center justify-center">
                      <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#06B6D4]/10 text-[#06B6D4] text-xs font-semibold mb-4">
                          {featuredPost.category}
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto">
                          <i className="ri-lightbulb-flash-line w-8 h-8 text-[#67E8F9] flex items-center justify-center" />
                        </div>
                        <p className="text-white/40 text-xs mt-4 font-mono">Featured insight</p>
                      </div>
                    </div>
                    <div className="md:col-span-3 p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                        <span>{featuredPost.date}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span>{featuredPost.readTime}</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 group-hover:text-[#06B6D4] transition-colors">
                        {featuredPost.title}
                      </h2>
                      <p className="text-slate-600 leading-relaxed mb-5">{featuredPost.excerpt}</p>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#06B6D4]/10 flex items-center justify-center">
                          <i className="ri-user-line w-4 h-4 text-[#06B6D4] flex items-center justify-center" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{featuredPost.author}</p>
                          <p className="text-xs text-slate-400">{featuredPost.authorRole}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {remainingPosts.map((post, i) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href="/blog"
                    className="group block h-full bg-white rounded-2xl border border-slate-200 p-6 hover:border-[#06B6D4]/40 hover:shadow-lg hover:shadow-[#06B6D4]/5 transition-all duration-300 cursor-pointer"
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium mb-4">
                      {post.category}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3 leading-snug group-hover:text-[#06B6D4] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-5">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-slate-400 mt-auto">
                      <span>{post.date}</span>
                      <span className="flex items-center gap-1.5 group-hover:text-[#06B6D4] transition-colors">
                        {post.readTime}
                        <i className="ri-arrow-right-line w-3.5 h-3.5 flex items-center justify-center" />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
              <div id="newsletter" className="section-dark-alt scroll-mt-28 rounded-2xl border border-slate-200 p-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#06B6D4]/8 border border-[#06B6D4]/20 text-[#06B6D4] text-sm font-medium mb-6">
                  <i className="ri-mail-send-line w-4 h-4 flex items-center justify-center" />
                  Stay in the Loop
                </div>
                <h2 className="text-3xl font-bold mb-4 text-slate-900">Stay Updated</h2>
                <p className="text-slate-500 mb-8 max-w-xl mx-auto">Subscribe to our newsletter for the latest insights on technology, automation and digital transformation for UK businesses.</p>
                {formStatus === 'check-email' || formStatus === 'confirmed' ? (
                  <div className="max-w-md mx-auto text-center py-4" data-testid="form-success">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                      <i className="ri-check-line w-7 h-7 text-emerald-500 flex items-center justify-center" />
                    </div>
                    <p role="status" className="font-medium text-emerald-700">
                      {formStatus === 'confirmed' ? 'Your newsletter subscription is confirmed.' : 'Check your email for a link to confirm your subscription.'}
                    </p>
                  </div>
                ) : confirmationToken ? (
                  <button type="button" onClick={confirmNewsletter} disabled={formStatus === 'submitting'}
                    className="rounded-xl bg-cyan-700 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50">
                    {formStatus === 'submitting' ? 'Confirming…' : 'Confirm subscription'}
                  </button>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="mx-auto max-w-md space-y-3">
                    <input type="text" name="website_alt" tabIndex={-1} autoComplete="off" aria-hidden="true" className="sr-only" />
                    <div className="flex flex-col items-center gap-3 sm:flex-row">
                      <input type="email" name="email" aria-label="Email address" placeholder="Enter your email"
                        maxLength={254} autoComplete="email" required
                        className="w-full flex-1 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-800" />
                      <button type="submit" data-testid="newsletter-submit" disabled={formStatus === 'submitting'}
                        className="rounded-xl bg-cyan-700 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50">
                        {formStatus === 'submitting' ? 'Requesting…' : 'Subscribe'}
                      </button>
                    </div>
                    <label className="flex items-start gap-2 text-left text-xs text-slate-600">
                      <input type="checkbox" name="newsletter_consent" required className="mt-0.5" />
                      <span>I agree to receive the Digital Footprint newsletter by email. I can unsubscribe at any time.</span>
                    </label>
                  </form>
                )}
                {formError && <p data-testid="form-error" role="alert" className="text-xs text-red-500 mt-3">{formError}</p>}
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}