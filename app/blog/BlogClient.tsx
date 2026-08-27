'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from '@/components/motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { blogPosts } from './posts';

export default function BlogPage() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState('');

  const featuredPost = blogPosts.find((p) => p.featured) || blogPosts[0];
  const remainingPosts = blogPosts.filter((p) => p.slug !== featuredPost?.slug);

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const honeypot = (formData.get('website_alt') as string || '').trim();
    if (honeypot) { setFormStatus('success'); return; }
    setFormStatus('submitting');
    setFormError('');
    formData.delete('website_alt');
    try {
      const { submitEnquiry, makeIdempotencyKey } = await import('@/lib/submit-enquiry');
      const result = await submitEnquiry('leads', {
        name: 'Newsletter Subscriber',
        email: (formData.get('email') as string) || '',
        enquiry_type: 'newsletter',
        source: 'blog',
        status: 'new',
        stage: 'new',
        consent_marketing: true,
        idempotency_key: makeIdempotencyKey(),
      });

      if (result.code === 'OK') {
        setFormStatus('success');
        form.reset();
      } else {
        setFormError(result.message);
        setFormStatus('error');
      }
    } catch {
      setFormError('Unable to connect. Please check your connection and try again.');
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
              <div className="section-dark-alt rounded-2xl p-12 border border-slate-200">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#06B6D4]/8 border border-[#06B6D4]/20 text-[#06B6D4] text-sm font-medium mb-6">
                  <i className="ri-mail-send-line w-4 h-4 flex items-center justify-center" />
                  Stay in the Loop
                </div>
                <h2 className="text-3xl font-bold mb-4 text-slate-900">Stay Updated</h2>
                <p className="text-slate-500 mb-8 max-w-xl mx-auto">Subscribe to our newsletter for the latest insights on technology, automation and digital transformation for UK businesses.</p>
                {formStatus === 'success' ? (
                  <div className="max-w-md mx-auto text-center py-4" data-testid="form-success">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                      <i className="ri-check-line w-7 h-7 text-emerald-500 flex items-center justify-center" />
                    </div>
                    <p className="text-emerald-700 font-medium">Thank you for subscribing. You&apos;ll hear from us soon.</p>
                  </div>
                ) : (
                  <form data-readdy-form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
                    <input type="text" name="website_alt" tabIndex={-1} autoComplete="off" aria-hidden="true" readOnly className="absolute opacity-0 pointer-events-none" />
                    <input type="email" name="email" placeholder="Enter your email" required className="flex-1 w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#06B6D4] transition-colors text-sm" />
                    <button type="submit" data-testid="newsletter-submit" disabled={formStatus === 'submitting'} className="px-6 py-3 rounded-xl font-semibold text-sm text-white bg-[#06B6D4] hover:bg-[#0891B2] transition-colors cursor-pointer whitespace-nowrap hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50">
                      {formStatus === 'submitting' ? 'Subscribing...' : 'Subscribe'}
                    </button>
                  </form>
                )}
                {formError && <p data-testid="form-error" className="text-xs text-red-500 mt-3">{formError}</p>}
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}