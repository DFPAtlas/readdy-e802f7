'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Bug, CheckCircle, Link2, Plus, X, Search, Loader2,
  AlertCircle, Copy, Ban, Ticket, FileText, ExternalLink,
} from 'lucide-react';

const defectStatusConfig: Record<string, { label: string; color: string }> = {
  validated: { label: 'Validated Defect', color: '#10B981' },
  duplicate: { label: 'Duplicate', color: '#F59E0B' },
  not_a_defect: { label: 'Not a Defect', color: '#64748B' },
  linked_to_ticket: { label: 'Linked to Ticket', color: '#22D3EE' },
};

const resultStatusConfig: Record<string, { label: string; color: string }> = {
  failed: { label: 'FAIL', color: '#EF4444' },
  blocked: { label: 'BLOCKED', color: '#F97316' },
  passed: { label: 'PASS', color: '#10B981' },
};

const ticketStatusColors: Record<string, string> = {
  new: '#06B6D4', open: '#3B82F6', waiting_on_staff: '#8B5CF6',
  waiting_on_customer: '#F59E0B', in_progress: '#3B82F6', assigned: '#8B5CF6',
  resolved: '#10B981', closed: '#64748B', cancelled: '#64748B',
};

const CATEGORIES = ['general', 'technical', 'account', 'billing', 'access', 'bug', 'complaint', 'feature_request', 'security', 'other'];
const PRIORITIES = ['low', 'normal', 'high', 'urgent', 'critical'];

interface DefectReviewSectionProps {
  feedback: any;
  onRefresh: () => void;
}

export default function DefectReviewSection({ feedback, onRefresh }: DefectReviewSectionProps) {
  const hasResult = !!feedback.test_case_result_id;
  const currentStatus: string | null = feedback.defect_review_status || null;

  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [context, setContext] = useState<{ resultStatus?: string; caseTitle?: string }>({});

  const [reasonFor, setReasonFor] = useState<'validated' | 'duplicate' | 'not_a_defect' | null>(null);
  const [reasonText, setReasonText] = useState('');

  const [sites, setSites] = useState<any[]>([]);
  const [linkedTicket, setLinkedTicket] = useState<any>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const [showLinkModal, setShowLinkModal] = useState(false);
  const [ticketSearch, setTicketSearch] = useState('');
  const [ticketResults, setTicketResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ site_id: '', subject: '', description: '', category: 'bug', priority: 'normal' });

  useEffect(() => {
    if (!feedback.test_case_result_id) return;
    (async () => {
      const { data: res } = await supabase
        .from('uat_test_case_results')
        .select('status, test_case_id')
        .eq('id', feedback.test_case_result_id)
        .maybeSingle();
      let caseTitle = '';
      if (res?.test_case_id) {
        const { data: tc } = await supabase.from('uat_test_cases').select('title').eq('id', res.test_case_id).maybeSingle();
        caseTitle = tc?.title || '';
      }
      setContext({ resultStatus: res?.status, caseTitle });
    })();
  }, [feedback.test_case_result_id]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('internal_support_sites')
        .select('id, site_name')
        .eq('is_active', true)
        .order('created_at');
      const s = data || [];
      setSites(s);
      setCreateForm((prev) => ({ ...prev, site_id: s[0]?.id || '' }));
    })();
  }, []);

  useEffect(() => {
    if (!feedback.support_ticket_id) { setLinkedTicket(null); return; }
    (async () => {
      const { data } = await supabase
        .from('internal_support_tickets')
        .select('id, ticket_number, subject, status, description, priority, category, created_at')
        .eq('id', feedback.support_ticket_id)
        .maybeSingle();
      setLinkedTicket(data || null);
    })();
  }, [feedback.support_ticket_id]);

  if (!hasResult) return null;

  const isUnreviewed = currentStatus === null;
  const showTicketActions = currentStatus === 'validated';
  const showLinkedCard = currentStatus === 'linked_to_ticket' || !!feedback.support_ticket_id;

  const runDefectDecision = async () => {
    if (!reasonFor) return;
    if ((reasonFor === 'duplicate' || reasonFor === 'not_a_defect') && !reasonText.trim()) {
      setError('A short reason is required.');
      return;
    }
    setBusy(reasonFor);
    setError('');
    setSuccess('');
    const { error: err } = await supabase.rpc('promote_uat_defect', {
      p_result_id: feedback.test_case_result_id,
      p_decision: reasonFor,
      p_reason: reasonText.trim(),
      p_duplicate_of: null,
    });
    if (err) { setError(err.message); setBusy(null); return; }
    setReasonFor(null);
    setReasonText('');
    setBusy(null);
    const msg = reasonFor === 'validated' ? 'Defect validated.' : reasonFor === 'duplicate' ? 'Defect marked as duplicate.' : 'Defect marked as not a defect.';
    setSuccess(msg);
    onRefresh();
  };

  const searchTickets = async (q: string) => {
    setSearching(true);
    setTicketResults([]);
    const trimmed = q.trim();
    if (!trimmed) { setSearching(false); return; }
    const { data } = await supabase
      .from('internal_support_tickets')
      .select('id, ticket_number, subject, status, created_at')
      .or(`ticket_number.ilike.%${trimmed}%,subject.ilike.%${trimmed}%`)
      .order('created_at', { ascending: false })
      .limit(20);
    setTicketResults(data || []);
    setSearching(false);
  };

  const linkTicket = async (ticketId: string) => {
    setBusy('link');
    setError('');
    const { error: err } = await supabase.rpc('link_uat_defect_ticket', {
      p_feedback_id: feedback.id,
      p_ticket_id: ticketId,
    });
    if (err) { setError(err.message); setBusy(null); return; }
    setShowLinkModal(false);
    setTicketSearch('');
    setTicketResults([]);
    setBusy(null);
    setSuccess('Support ticket linked.');
    onRefresh();
  };

  const createAndLinkTicket = async () => {
    if (!createForm.subject.trim()) { setError('Subject is required.'); return; }
    if (!createForm.site_id) { setError('No active support site available.'); return; }
    setBusy('create');
    setError('');
    setSuccess('');

    const { data, error: err } = await supabase.rpc('create_uat_support_ticket', {
      p_site_id: createForm.site_id,
      p_subject: createForm.subject.trim(),
      p_description: createForm.description.trim() || createForm.subject.trim(),
      p_category: createForm.category,
      p_priority: createForm.priority,
      p_uat_project_id: feedback.project_id ?? null,
      p_uat_job_id: feedback.job_id ?? null,
      p_uat_test_case_id: feedback.test_case_id ?? null,
      p_uat_result_id: feedback.test_case_result_id ?? null,
      p_uat_feedback_id: feedback.id,
    });

    if (err) { setError(err.message); setBusy(null); return; }

    const ticketId = (data as any)?.ticket_id;
    if (ticketId) {
      const { error: linkErr } = await supabase.rpc('link_uat_defect_ticket', {
        p_feedback_id: feedback.id,
        p_ticket_id: ticketId,
      });
      if (linkErr) { setError(linkErr.message); setBusy(null); return; }
    }

    setShowCreateModal(false);
    setCreateForm((prev) => ({ ...prev, subject: '', description: '' }));
    setBusy(null);
    setSuccess('Support ticket created and linked.');
    onRefresh();
  };

  const openLinkModal = () => {
    setShowLinkModal(true);
    setTicketSearch('');
    setTicketResults([]);
    searchTickets('');
  };

  const statusCfg = currentStatus ? defectStatusConfig[currentStatus] : null;

  return (
    <div className="mt-6 bg-[#1E293B] border border-[rgba(255,255,255,0.08)] rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bug className="w-5 h-5 text-[#06B6D4]" />
          <h2 className="text-lg font-bold text-white">UAT Defect Review</h2>
        </div>
        {statusCfg ? (
          <span className="inline-flex px-2.5 py-0.5 rounded-lg text-xs font-medium"
            style={{ color: statusCfg.color, backgroundColor: statusCfg.color + '15' }}>
            {statusCfg.label}
          </span>
        ) : (
          <span className="inline-flex px-2.5 py-0.5 rounded-lg text-xs font-medium text-slate-400 bg-white/[0.04]">
            Unreviewed
          </span>
        )}
      </div>

      <div className="p-6 space-y-5">
        {error && (
          <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <p className="text-sm text-emerald-400">{success}</p>
            <button onClick={() => setSuccess('')} className="ml-auto text-emerald-400 hover:text-emerald-300 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {(context.caseTitle || context.resultStatus) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {context.caseTitle && (
              <div className="bg-white/[0.02] border border-[rgba(255,255,255,0.06)] rounded-xl p-3">
                <p className="text-xs text-slate-500 mb-0.5">Test Case</p>
                <p className="text-slate-300">{context.caseTitle}</p>
              </div>
            )}
            {context.resultStatus && (() => {
              const rc = resultStatusConfig[context.resultStatus] || { label: context.resultStatus.toUpperCase(), color: '#94A3B8' };
              return (
                <div className="bg-white/[0.02] border border-[rgba(255,255,255,0.06)] rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-0.5">Tester Result</p>
                  <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-semibold"
                    style={{ color: rc.color, backgroundColor: rc.color + '15' }}>
                    {rc.label}
                  </span>
                </div>
              );
            })()}
          </div>
        )}

        {isUnreviewed && (
          <div>
            <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Review this finding</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => { setReasonFor('validated'); setReasonText(''); setError(''); }}
                disabled={!!busy}
                className="px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-sm font-semibold text-emerald-400 hover:bg-emerald-500/20 cursor-pointer whitespace-nowrap flex items-center gap-2 transition-colors disabled:opacity-50">
                <CheckCircle className="w-4 h-4" /> Validate Defect
              </button>
              <button onClick={() => { setReasonFor('duplicate'); setReasonText(''); setError(''); }}
                disabled={!!busy}
                className="px-4 py-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-sm font-semibold text-amber-400 hover:bg-amber-500/20 cursor-pointer whitespace-nowrap flex items-center gap-2 transition-colors disabled:opacity-50">
                <Copy className="w-4 h-4" /> Mark Duplicate
              </button>
              <button onClick={() => { setReasonFor('not_a_defect'); setReasonText(''); setError(''); }}
                disabled={!!busy}
                className="px-4 py-2.5 bg-slate-500/10 border border-slate-500/30 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-500/20 cursor-pointer whitespace-nowrap flex items-center gap-2 transition-colors disabled:opacity-50">
                <Ban className="w-4 h-4" /> Not a Defect
              </button>
            </div>
          </div>
        )}

        {showTicketActions && (
          <div>
            <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Support ticket</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={openLinkModal} disabled={!!busy}
                className="px-4 py-2.5 bg-[#06B6D4]/10 border border-[#06B6D4]/30 rounded-xl text-sm font-semibold text-[#06B6D4] hover:bg-[#06B6D4]/20 cursor-pointer whitespace-nowrap flex items-center gap-2 transition-colors disabled:opacity-50">
                <Link2 className="w-4 h-4" /> Link Existing Ticket
              </button>
              <button onClick={() => { setShowCreateModal(true); setError(''); }}
                disabled={!!busy}
                className="px-4 py-2.5 bg-[#06B6D4]/10 border border-[#06B6D4]/30 rounded-xl text-sm font-semibold text-[#06B6D4] hover:bg-[#06B6D4]/20 cursor-pointer whitespace-nowrap flex items-center gap-2 transition-colors disabled:opacity-50">
                <Plus className="w-4 h-4" /> Create Support Ticket
              </button>
            </div>
          </div>
        )}

        {showLinkedCard && (
          <div className="bg-white/[0.02] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <Ticket className="w-4 h-4 text-[#22D3EE]" />
                  <span className="text-sm font-semibold text-white">Support Ticket</span>
                  {linkedTicket ? (
                    <span className="text-xs font-mono text-slate-400">{linkedTicket.ticket_number}</span>
                  ) : (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-500" />
                  )}
                </div>
                {linkedTicket && (
                  <>
                    <p className="text-sm text-slate-300 truncate">{linkedTicket.subject}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium"
                        style={{ color: ticketStatusColors[linkedTicket.status] || '#94A3B8', backgroundColor: (ticketStatusColors[linkedTicket.status] || '#94A3B8') + '15' }}>
                        {linkedTicket.status?.replace(/_/g, ' ')}
                      </span>
                      {linkedTicket.priority && (
                        <span className="text-[10px] text-slate-500 capitalize">{linkedTicket.priority}</span>
                      )}
                    </div>
                  </>
                )}
              </div>
              <button onClick={() => setShowViewModal(true)}
                className="px-3 py-2 bg-white/[0.03] border border-[rgba(255,255,255,0.08)] rounded-xl text-xs font-semibold text-slate-300 hover:text-[#22D3EE] cursor-pointer whitespace-nowrap flex items-center gap-1.5 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" /> View Support Ticket
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reason dialog */}
      {reasonFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setReasonFor(null)}>
          <div className="bg-[#1E293B] border border-[rgba(255,255,255,0.1)] rounded-2xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
              <h3 className="text-base font-bold text-white capitalize">
                {reasonFor === 'validated' ? 'Validate Defect' : reasonFor === 'duplicate' ? 'Mark Duplicate' : 'Mark Not a Defect'}
              </h3>
              <button onClick={() => setReasonFor(null)} className="p-1 text-slate-400 hover:text-white cursor-pointer rounded-lg hover:bg-white/5">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs text-slate-400 mb-1.5 font-medium uppercase tracking-wide">
                  Reason {(reasonFor === 'duplicate' || reasonFor === 'not_a_defect') ? '*' : '(optional)'}
                </p>
                <textarea value={reasonText} onChange={(e) => setReasonText(e.target.value)} rows={3} maxLength={500}
                  placeholder="Short reason for this decision..."
                  className="w-full px-3 py-2.5 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 resize-none" />
              </div>
            </div>
            <div className="p-5 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-end gap-3">
              <button onClick={() => setReasonFor(null)}
                className="px-4 py-2.5 bg-white/[0.02] border border-[rgba(255,255,255,0.06)] rounded-xl text-sm text-slate-400 hover:text-white cursor-pointer whitespace-nowrap transition-colors">
                Cancel
              </button>
              <button onClick={runDefectDecision} disabled={!!busy}
                className="px-5 py-2.5 bg-[#06B6D4] hover:bg-[#0891B2] disabled:opacity-40 rounded-xl text-sm font-semibold text-white cursor-pointer whitespace-nowrap flex items-center gap-2 transition-colors">
                {busy === reasonFor ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link ticket modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowLinkModal(false)}>
          <div className="bg-[#1E293B] border border-[rgba(255,255,255,0.1)] rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Link Existing Support Ticket</h3>
              <button onClick={() => setShowLinkModal(false)} className="p-1 text-slate-400 hover:text-white cursor-pointer rounded-lg hover:bg-white/5">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="text" value={ticketSearch} onChange={(e) => { setTicketSearch(e.target.value); searchTickets(e.target.value); }}
                  placeholder="Search by ticket number or subject..."
                  className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20" />
              </div>

              {searching ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                </div>
              ) : ticketResults.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">{ticketSearch ? 'No tickets found.' : 'Search for a ticket to link.'}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {ticketResults.map((t: any) => (
                    <button key={t.id} onClick={() => linkTicket(t.id)} disabled={busy === 'link'}
                      className="w-full flex items-center gap-3 bg-white/[0.02] border border-[rgba(255,255,255,0.06)] rounded-xl p-3 text-left hover:border-[#06B6D4]/30 cursor-pointer transition-colors disabled:opacity-50">
                      <span className="text-xs font-mono text-slate-400 shrink-0">{t.ticket_number}</span>
                      <span className="text-sm text-slate-200 truncate flex-1">{t.subject}</span>
                      <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium shrink-0"
                        style={{ color: ticketStatusColors[t.status] || '#94A3B8', backgroundColor: (ticketStatusColors[t.status] || '#94A3B8') + '15' }}>
                        {t.status?.replace(/_/g, ' ')}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create ticket modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowCreateModal(false)}>
          <div className="bg-[#1E293B] border border-[rgba(255,255,255,0.1)] rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Create Support Ticket</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 text-slate-400 hover:text-white cursor-pointer rounded-lg hover:bg-white/5">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {error && (
                <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-slate-400 mb-1.5 font-medium uppercase tracking-wide">Support Site</p>
                <select value={createForm.site_id} onChange={(e) => setCreateForm({ ...createForm, site_id: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-xl text-sm text-white cursor-pointer pr-8">
                  {sites.map((s: any) => <option key={s.id} value={s.id}>{s.site_name}</option>)}
                </select>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-1.5 font-medium uppercase tracking-wide">Subject *</p>
                <input type="text" value={createForm.subject}
                  onChange={(e) => setCreateForm({ ...createForm, subject: e.target.value })}
                  placeholder="Defect summary..."
                  className="w-full px-3 py-2.5 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20" />
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-1.5 font-medium uppercase tracking-wide">Description</p>
                <textarea value={createForm.description} onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  rows={4} maxLength={500}
                  placeholder={feedback.actual_result ? `Actual result: ${feedback.actual_result}` : 'Defect description...'}
                  className="w-full px-3 py-2.5 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-400 mb-1.5 font-medium uppercase tracking-wide">Category</p>
                  <select value={createForm.category} onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-xl text-sm text-white cursor-pointer pr-8">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
                  </select>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1.5 font-medium uppercase tracking-wide">Priority</p>
                  <select value={createForm.priority} onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-xl text-sm text-white cursor-pointer pr-8">
                    {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-end gap-3">
              <button onClick={() => setShowCreateModal(false)}
                className="px-4 py-2.5 bg-white/[0.02] border border-[rgba(255,255,255,0.06)] rounded-xl text-sm text-slate-400 hover:text-white cursor-pointer whitespace-nowrap transition-colors">
                Cancel
              </button>
              <button onClick={createAndLinkTicket} disabled={busy === 'create'}
                className="px-5 py-2.5 bg-[#06B6D4] hover:bg-[#0891B2] disabled:opacity-40 rounded-xl text-sm font-semibold text-white cursor-pointer whitespace-nowrap flex items-center gap-2 transition-colors">
                {busy === 'create' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Create & Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View ticket modal */}
      {showViewModal && linkedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowViewModal(false)}>
          <div className="bg-[#1E293B] border border-[rgba(255,255,255,0.1)] rounded-2xl w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <Ticket className="w-4 h-4 text-[#22D3EE] shrink-0" />
                <span className="text-sm font-mono text-slate-300 truncate">{linkedTicket.ticket_number}</span>
              </div>
              <button onClick={() => setShowViewModal(false)} className="p-1 text-slate-400 hover:text-white cursor-pointer rounded-lg hover:bg-white/5">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wide">Subject</p>
                <p className="text-sm text-white">{linkedTicket.subject}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium"
                  style={{ color: ticketStatusColors[linkedTicket.status] || '#94A3B8', backgroundColor: (ticketStatusColors[linkedTicket.status] || '#94A3B8') + '15' }}>
                  {linkedTicket.status?.replace(/_/g, ' ')}
                </span>
                {linkedTicket.priority && <span className="text-xs text-slate-400 capitalize">{linkedTicket.priority}</span>}
                {linkedTicket.category && <span className="text-xs text-slate-400 capitalize">{linkedTicket.category?.replace(/_/g, ' ')}</span>}
                {linkedTicket.created_at && (
                  <span className="text-xs text-slate-500 ml-auto">
                    {new Date(linkedTicket.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>
              {linkedTicket.description && (
                <div>
                  <p className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wide">Description</p>
                  <div className="bg-white/[0.02] border border-[rgba(255,255,255,0.06)] rounded-xl p-3">
                    <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{linkedTicket.description}</p>
                  </div>
                </div>
              )}
              <p className="text-xs text-slate-500">The support ticket remains the source of truth for repair work.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}