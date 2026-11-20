'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { submitEnquiry } from '@/lib/submit-enquiry';
import {
  DISCOVERY_ANSWER_LIMIT, DISCOVERY_PARTS, DISCOVERY_STORAGE_KEY, DISCOVERY_VERSION,
  answeredDiscoveryQuestions, buildDiscoveryPayload, discoveryAnswerText, readDiscoveryDraft,
  type DiscoveryAnswers, type DiscoveryContact,
} from '@/lib/website-discovery';

const fieldClass = 'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600';
const buttonClass = 'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

export default function WebsiteDiscoveryWizard() {
  const [ready, setReady] = useState(false);
  const [answers, setAnswers] = useState<DiscoveryAnswers>({});
  const [step, setStep] = useState(0);
  const [storageState, setStorageState] = useState<'saved' | 'unavailable' | 'saving'>('saving');
  const [restored, setRestored] = useState(false);
  const [contact, setContact] = useState<DiscoveryContact>({ name: '', email: '', company: '' });
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  const inFlight = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const navigationRequested = useRef(false);

  useEffect(() => {
    try {
      const draft = readDiscoveryDraft(localStorage.getItem(DISCOVERY_STORAGE_KEY));
      if (draft) {
        setAnswers(draft.answers);
        setStep(draft.step);
        setRestored(answeredDiscoveryQuestions(draft.answers) > 0 || draft.step > 0);
      }
    } catch {
      setStorageState('unavailable');
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || reference) return;
    try {
      localStorage.setItem(DISCOVERY_STORAGE_KEY, JSON.stringify({ version: DISCOVERY_VERSION, savedAt: Date.now(), step, answers }));
      setStorageState('saved');
    } catch {
      setStorageState('unavailable');
    }
  }, [ready, answers, step, reference]);

  useEffect(() => {
    if (navigationRequested.current) {
      headingRef.current?.focus();
      headingRef.current?.scrollIntoView({ block: 'start', behavior: 'auto' });
      navigationRequested.current = false;
    }
  }, [step, reference]);

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  const navigate = (nextStep: number) => {
    if (inFlight.current) return;
    navigationRequested.current = true;
    setStep(nextStep);
    setError('');
  };

  const clearDraft = () => {
    if (!window.confirm('Clear your saved answers and start again?')) return;
    setAnswers({});
    setRestored(false);
    setContact({ name: '', email: '', company: '' });
    setPrivacyAccepted(false);
    navigate(0);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlight.current) return;
    if (!privacyAccepted || !contact.name.trim() || !contact.email.trim()) return;
    if (answeredDiscoveryQuestions(answers) === 0) {
      setError('Please answer at least one question so we have a starting point for your brief.');
      return;
    }
    inFlight.current = true;
    setSubmitting(true);
    setError('');
    try {
      const result = await submitEnquiry('project_submissions', buildDiscoveryPayload(answers, contact), true);
      if (result.code === 'ERROR') {
        setError(result.message);
      } else if (!result.recordId) {
        setError('We could not confirm your brief reference. Your answers are still here. Please contact info@digital-footprint.uk before trying again.');
      } else {
        // A reference is shown only after the database confirms receipt.
        setReference(`DFP-PB-${result.recordId.replace(/-/g, '').slice(0, 8).toUpperCase()}`);
        navigationRequested.current = true;
        try { localStorage.removeItem(DISCOVERY_STORAGE_KEY); } catch { /* Storage may be unavailable. */ }
      }
    } catch {
      setError('We could not confirm receipt. Your answers are still here. Please check your connection or contact info@digital-footprint.uk.');
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  };

  const part = DISCOVERY_PARTS[step];
  const answered = answeredDiscoveryQuestions(answers);

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-slate-50 px-4 pb-20 pt-32 text-slate-900 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <Link href="/services/websites-saas" className="inline-flex items-center gap-2 rounded text-sm font-medium text-slate-600 hover:text-cyan-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-600">
            <span aria-hidden="true">←</span> Websites &amp; SaaS
          </Link>
          {!ready ? (
            <p role="status" className="py-16">Getting your questionnaire ready…</p>
          ) : reference ? (
            <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-12">
              <div aria-hidden="true" className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">✓</div>
              <h1 ref={headingRef} tabIndex={-1} className="scroll-mt-28 text-3xl font-bold focus:outline-none">Your vision is in good hands.</h1>
              <p className="mt-4 text-slate-600">Thank you for sharing your thoughts. We’ll review your answers and use them as the blueprint for your website conversation.</p>
              <p className="mt-6 text-sm text-slate-500">Your brief reference</p>
              <p className="mt-1 font-mono text-xl font-bold text-cyan-800">{reference}</p>
              <p className="mt-4 break-words text-sm text-slate-600">We’ll reply to {contact.email.trim()} about the next steps.</p>
              <Link href="/services/websites-saas" className={`${buttonClass} mt-8 bg-slate-900 text-white hover:bg-slate-800`}>Back to Websites &amp; SaaS</Link>
            </section>
          ) : (
            <>
              <header className="mb-8 mt-6">
                <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-cyan-800">Your vision, our blueprint</p>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Website Discovery &amp; Vision Questionnaire</h1>
                <p className="mt-4 max-w-3xl leading-relaxed text-slate-600">Before we dive into designing your website, we’d love to understand your vision, style preferences and the materials you already have. No technical terms needed—answer as naturally as you like. Every discovery question is optional.</p>
              </header>
              <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                <div className="flex flex-wrap justify-between gap-2 text-sm">
                  <span className="font-semibold">{step < DISCOVERY_PARTS.length ? `Part ${step + 1} of 6` : 'Review & send'}</span>
                  <span className="text-slate-600">{answered} of 26 questions answered</span>
                </div>
                <div role="progressbar" aria-label="Questionnaire stages" aria-valuemin={0} aria-valuemax={7} aria-valuenow={step + 1} aria-valuetext={step < 6 ? `Part ${step + 1} of 6, then review` : 'Review and send'} className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-cyan-600" style={{ width: `${((step + 1) / 7) * 100}%` }} />
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <p role="status">{storageState === 'unavailable' ? 'Auto-save is unavailable. Keep this page open to retain your answers.' : `${restored ? 'Your draft has been restored. ' : ''}Answers saved on this device for 14 days.`}</p>
                  <button type="button" onClick={clearDraft} disabled={submitting} className="rounded px-2 py-2 text-slate-600 underline underline-offset-2 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-600 disabled:opacity-50">Start again</button>
                </div>
              </div>
              {part ? (
                <section aria-labelledby="part-heading" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                  <h2 id="part-heading" ref={headingRef} tabIndex={-1} className="scroll-mt-28 text-2xl font-bold focus:outline-none">{part.title}</h2>
                  <p className="mb-8 mt-2 text-slate-600">{part.description}</p>
                  <div className="space-y-9">
                    {part.questions.map((question) => {
                      const answer = answers[question.id] || { choices: [], text: '' };
                      const update = (patch: Partial<typeof answer>) => setAnswers((previous) => ({ ...previous, [question.id]: { ...answer, ...patch } }));
                      return (
                        <fieldset key={question.id}>
                          <legend className="mb-3 text-base font-semibold leading-relaxed">{question.id}. {question.title} <span className="text-xs font-normal text-slate-500">(optional)</span></legend>
                          {question.hint && <p id={`hint-${question.id}`} className="mb-3 text-sm leading-relaxed text-slate-600">{question.hint}</p>}
                          {question.choices && (
                            <>
                              <p className="mb-2 text-xs text-slate-500">{question.multiple ? 'Choose any that fit, or use your own words below.' : 'Choose one, or use your own words below. Click a selected option to clear it.'}</p>
                              <div className="mb-3 grid gap-2 sm:grid-cols-2">
                                {question.choices.map((choice) => {
                                  const selected = answer.choices.includes(choice);
                                  return (
                                    <button key={choice} type="button" aria-pressed={selected} onClick={() => update({ choices: selected ? answer.choices.filter((value) => value !== choice) : question.multiple ? [...answer.choices, choice] : [choice] })} className={`flex min-h-12 items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 ${selected ? 'border-cyan-700 bg-cyan-50 text-cyan-900' : 'border-slate-200 text-slate-700 hover:border-cyan-600'}`}>
                                      {choice}<span aria-hidden="true" className="shrink-0">{selected ? '✓' : '+'}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </>
                          )}
                          <label htmlFor={`answer-${question.id}`} className="mb-2 block text-sm text-slate-600">{question.choices ? 'Anything to add, or your own answer' : 'Your answer'}</label>
                          <textarea id={`answer-${question.id}`} aria-describedby={[question.hint ? `hint-${question.id}` : '', `limit-${question.id}`].filter(Boolean).join(' ')} value={answer.text} onChange={(event) => update({ text: event.target.value })} maxLength={DISCOVERY_ANSWER_LIMIT} rows={question.choices ? 2 : 3} className={fieldClass} />
                          <p id={`limit-${question.id}`} className="mt-1 text-right text-xs text-slate-500">{answer.text.length}/{DISCOVERY_ANSWER_LIMIT}</p>
                        </fieldset>
                      );
                    })}
                  </div>
                  <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-slate-100 pt-6">
                    <button type="button" disabled={step === 0} onClick={() => navigate(step - 1)} className={`${buttonClass} border border-slate-300 bg-white text-slate-700 hover:bg-slate-50`}>Back</button>
                    <button type="button" onClick={() => navigate(step + 1)} className={`${buttonClass} bg-orange-600 text-white hover:bg-orange-700`}>{step === 5 ? 'Review my brief' : 'Next part'} <span aria-hidden="true">→</span></button>
                  </div>
                </section>
              ) : (
                <section aria-labelledby="part-heading" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                  <h2 id="part-heading" ref={headingRef} tabIndex={-1} className="scroll-mt-28 text-2xl font-bold focus:outline-none">Review your website brief</h2>
                  <p className="mb-6 mt-2 text-slate-600">Check your answers below. You can edit any part before sharing it with us.</p>
                  <div className="space-y-4">
                    {DISCOVERY_PARTS.map((reviewPart, index) => (
                      <details key={reviewPart.title} className="rounded-xl border border-slate-200 p-4" open>
                        <summary className="cursor-pointer font-semibold">{index + 1}. {reviewPart.title}</summary>
                        <dl className="mt-4 space-y-4">
                          {reviewPart.questions.map((question) => (
                            <div key={question.id}>
                              <dt className="text-sm font-medium">{question.id}. {question.title}</dt>
                              <dd className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-600">{discoveryAnswerText(answers[question.id]) || 'Not answered'}</dd>
                            </div>
                          ))}
                        </dl>
                        <button type="button" disabled={submitting} onClick={() => navigate(index)} aria-label={`Edit ${reviewPart.title}`} className="mt-4 rounded px-2 py-2 text-sm font-semibold text-cyan-800 underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-600 disabled:opacity-50">Edit this part</button>
                      </details>
                    ))}
                  </div>
                  <form onSubmit={submit} className="mt-8 space-y-5 border-t border-slate-200 pt-8">
                    <h3 className="text-xl font-bold">Where can we reach you?</h3>
                    <p className="text-sm text-slate-600">We’ll use these details to discuss your website brief. Contact details are not included in your saved draft.</p>
                    <fieldset disabled={submitting} className="space-y-5 disabled:opacity-70">
                      <div>
                        <label htmlFor="discovery-name" className="mb-2 block text-sm font-medium">Your name (required)</label>
                        <input id="discovery-name" autoComplete="name" required minLength={2} maxLength={120} pattern=".*\S.*\S.*" value={contact.name} onChange={(event) => setContact({ ...contact, name: event.target.value })} className={fieldClass} />
                      </div>
                      <div>
                        <label htmlFor="discovery-email" className="mb-2 block text-sm font-medium">Email address (required)</label>
                        <input id="discovery-email" type="email" autoComplete="email" required maxLength={254} value={contact.email} onChange={(event) => setContact({ ...contact, email: event.target.value })} className={fieldClass} />
                      </div>
                      <div>
                        <label htmlFor="discovery-company" className="mb-2 block text-sm font-medium">Business name (optional)</label>
                        <input id="discovery-company" autoComplete="organization" maxLength={200} value={contact.company} onChange={(event) => setContact({ ...contact, company: event.target.value })} className={fieldClass} />
                      </div>
                      <label className="flex items-start gap-3 text-sm leading-relaxed text-slate-600">
                        <input type="checkbox" required checked={privacyAccepted} onChange={(event) => setPrivacyAccepted(event.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-cyan-700" />
                        <span>Please contact me about this brief. I have read the <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="font-medium text-cyan-800 underline">privacy notice (opens in a new tab)</Link> and understand how my information will be used. (required)</span>
                      </label>
                    </fieldset>
                    {error && <div ref={errorRef} tabIndex={-1} role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
                    <div className="flex flex-wrap justify-between gap-3 pt-3">
                      <button type="button" onClick={() => navigate(5)} disabled={submitting} className={`${buttonClass} border border-slate-300 text-slate-700 hover:bg-slate-50`}>Back</button>
                      <button type="submit" disabled={submitting || answered === 0} className={`${buttonClass} bg-orange-600 text-white hover:bg-orange-700`}>{submitting ? 'Sending your brief…' : 'Send my website brief'}</button>
                    </div>
                    {answered === 0 && <p className="text-sm text-slate-600">Answer at least one discovery question to send a brief. You can leave everything else blank.</p>}
                    <p className="text-xs text-slate-500">This sends your brief for a conversation. It does not place an order or take a payment.</p>
                  </form>
                </section>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
