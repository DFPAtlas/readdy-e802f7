'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { formatReward } from '@/lib/uat-marketplace';
import {
  Search, RefreshCw, ChevronDown, Filter, CheckCircle,
  FileText, AlertCircle, Loader2,
} from 'lucide-react';
import AdminShell from '../../../../components/admin/AdminShell';

interface Assignment {
  id: string; job_id: string; tester_id: string; application_id: string | null;
  status: string;
  agreed_reward_amount_minor: number | null;
  currency: string | null;
  review_status: string | null;
  review_feedback: string | null;
  review_notes: string | null;
  review_requested_case_ids: string[] | null;
  review_resubmitted_at: string | null;
  access_starts_at: string | null; access_expires_at: string | null;
  started_at: string | null; submitted_at: string | null;
  completed_at: string | null; admin_notes: string | null;
  created_at: string;
  job_title?: string; tester_name?: string; tester_email?: string;
  project_name?: string;
}

const statusColors: Record<string, string> = {
  reserved: '#38BDF8', active: '#10B981', in_progress: '#10B981',
  testing: '#10B981', submitted: '#F59E0B', review_required: '#F59E0B',
  retest_required: '#F97316', completed: '#10B981', approved: '#8B5CF6',
  rejected: '#EF4444', cancelled: '#EF4444', expired: '#6B7280',
};

export default function AdminAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const [reviewTarget, setReviewTarget] = useState<Assignment | null>(null);
  const [reviewDecision, setReviewDecision] = useState<'accept' | 'request_information' | 'reject'>('accept');
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [reviewInternalNotes, setReviewInternalNotes] = useState('');
  const [reviewBusy, setReviewBusy] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewCaseOptions, setReviewCaseOptions] = useState<{ id: string; reference: string; title: string; status: string }[]>([]);
  const [selectedCaseIds, setSelectedCaseIds] = useState<string[]>([]);
  const [reviewCasesLoading, setReviewCasesLoading] = useState(false);
  const [rewardedAssignmentIds, setRewardedAssignmentIds] = useState<Set<string>>(new Set());
  const [rewardBusy, setRewardBusy] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: assignData } = await supabase.from('uat_assignments').select('*').order('created_at', { ascending: false });
    if (!assignData) { setLoading(false); return; }

    const jobIds = [...new Set(assignData.map((a: any) => a.job_id))];
    const testerIds = [...new Set(assignData.map((a: any) => a.tester_id))];

    const [{ data: jobs }, { data: testers }] = await Promise.all([
      supabase.from('uat_jobs').select('id, title, project_id').in('id', jobIds),
      supabase.from('uat_testers').select('id, full_name, email').in('id', testerIds),
    ]);

    const jobMap: Record<string, any> = {};
    jobs?.forEach((j: any) => { jobMap[j.id] = j; });

    const projectIds = [...new Set(jobs?.map((j: any) => j.project_id).filter(Boolean) || [])];
    const projectMap: Record<string, string> = {};
    if (projectIds.length > 0) {
      const { data: projects } = await supabase.from('uat_projects').select('id, name').in('id', projectIds);
      projects?.forEach((p: any) => { projectMap[p.id] = p.name; });
    }

    const testerMap: Record<string, any> = {};
    testers?.forEach((t: any) => { testerMap[t.id] = t; });

    const merged = assignData.map((a: any) => ({
      ...a,
      job_title: jobMap[a.job_id]?.title || 'Unknown',
      tester_name: testerMap[a.tester_id]?.full_name || 'Unknown',
      tester_email: testerMap[a.tester_id]?.email || '',
      project_name: projectMap[jobMap[a.job_id]?.project_id] || null,
    }));

    setAssignments(merged);
    setFilteredAssignments(merged);
    setLoading(false);
    setRefreshing(false);

    const { data: pays } = await supabase.from('uat_payments').select('assignment_id');
    setRewardedAssignmentIds(new Set((pays || []).map((p: any) => p.assignment_id)));
  };

  useEffect(() => {
    let filtered = assignments;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((a) =>
        (a.tester_name && a.tester_name.toLowerCase().includes(q)) ||
        (a.job_title && a.job_title.toLowerCase().includes(q)) ||
        (a.project_name && a.project_name.toLowerCase().includes(q))
      );
    }
    if (statusFilter !== 'all') filtered = filtered.filter((a) => a.status === statusFilter);
    setFilteredAssignments(filtered);
  }, [searchQuery, statusFilter, assignments]);

  const openReview = (assignment: Assignment, decision: 'accept' | 'request_information' | 'reject') => {
    setReviewTarget(assignment);
    setReviewDecision(decision);
    setReviewFeedback('');
    setReviewInternalNotes('');
    setReviewError('');
    setSelectedCaseIds([]);
    setReviewCaseOptions([]);
    if (decision === 'request_information') {
      loadReviewCases(assignment.id);
    }
  };

  const loadReviewCases = async (assignmentId: string) => {
    setReviewCasesLoading(true);
    const { data: atcs } = await supabase
      .from('uat_assignment_test_cases')
      .select('id, test_case_id, status')
      .eq('assignment_id', assignmentId)
      .order('sort_order', { ascending: true });

    if (!atcs || atcs.length === 0) {
      setReviewCaseOptions([]);
      setReviewCasesLoading(false);
      return;
    }

    const tcIds = atcs.map((a: any) => a.test_case_id);
    const { data: tcs } = await supabase
      .from('uat_test_cases')
      .select('id, reference, title')
      .in('id', tcIds);

    const tcMap: Record<string, any> = {};
    tcs?.forEach((tc: any) => { tcMap[tc.id] = tc; });

    setReviewCaseOptions(atcs.map((a: any) => ({
      id: a.id,
      reference: tcMap[a.test_case_id]?.reference || 'N/A',
      title: tcMap[a.test_case_id]?.title || tcMap[a.test_case_id]?.reference || 'Untitled',
      status: a.status,
    })));
    setReviewCasesLoading(false);
  };

  const toggleCaseSelection = (caseId: string) => {
    setSelectedCaseIds((prev) =>
      prev.includes(caseId) ? prev.filter((id) => id !== caseId) : [...prev, caseId]
    );
  };

  const submitReview = async () => {
    if (!reviewTarget) return;
    if (reviewDecision !== 'accept' && !reviewFeedback.trim()) {
      setReviewError('Feedback is required for this action.');
      return;
    }
    if (reviewDecision === 'request_information' && selectedCaseIds.length === 0) {
      setReviewError('Select at least one test case that requires more information.');
      return;
    }
    setReviewBusy(true);
    setReviewError('');
    const { error } = await supabase.rpc('review_uat_submission', {
      p_assignment_id: reviewTarget.id,
      p_decision: reviewDecision,
      p_feedback: reviewFeedback.trim() || null,
      p_internal_notes: reviewInternalNotes.trim() || null,
      p_requested_case_ids: reviewDecision === 'request_information' ? selectedCaseIds : null,
    });
    if (error) {
      setReviewError(error.message);
      setReviewBusy(false);
      return;
    }
    setReviewBusy(false);
    setReviewTarget(null);
    fetchData();
  };

  const approveReward = async (assignmentId: string) => {
    setRewardBusy(assignmentId);
    const { error } = await supabase.rpc('approve_uat_reward', { p_assignment_id: assignmentId });
    if (error) {
      window.alert(error.message);
    }
    setRewardBusy(null);
    fetchData();
  };

  if (loading) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center h-96">
          <div className="w-8 h-8 border-2 border-[#06B6D4]/30 border-t-[#06B6D4] rounded-full animate-spin" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">UAT Assignments</h1>
          <p className="text-sm text-slate-400 mt-0.5">Review submissions, manage assignments, and track reward state</p>
        </div>

        <div className="bg-[#1E293B] border border-[rgba(255,255,255,0.08)] rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-[rgba(255,255,255,0.08)] flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type="text" placeholder="Search by tester, job, or project..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 focus:border-[#06B6D4]/40 transition-all" />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-9 pr-8 py-2.5 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 focus:border-[#06B6D4]/40 cursor-pointer appearance-none">
                  <option value="all">All Status</option>
                  <option value="reserved">Reserved</option>
                  <option value="active">Active</option>
                  <option value="in_progress">In Progress</option>
                  <option value="submitted">Submitted</option>
                  <option value="review_required">Awaiting Review</option>
                  <option value="retest_required">Retest Required</option>
                  <option value="completed">Completed</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="expired">Expired</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
              </div>
              <button onClick={() => { setRefreshing(true); fetchData(); }} disabled={refreshing}
                className="px-4 py-2.5 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-xl text-sm text-slate-400 hover:text-[#06B6D4] transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 whitespace-nowrap">
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.06)]">
                  <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Tester</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Job / Project</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Reward</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Submitted</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Created</th>
                  <th className="text-right text-xs font-medium text-slate-500 px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.map((a) => (
                  <tr key={a.id} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-white">{a.tester_name}</p>
                      <p className="text-xs text-slate-500">{a.tester_email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-white">{a.job_title}</p>
                      {a.project_name && <p className="text-xs text-slate-500">{a.project_name}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className="inline-flex px-2.5 py-0.5 rounded-lg text-xs font-medium capitalize"
                          style={{ color: statusColors[a.status] || '#94A3B8', backgroundColor: (statusColors[a.status] || '#94A3B8') + '15', border: '1px solid ' + (statusColors[a.status] || '#94A3B8') + '30' }}>
                          {a.status.replace(/_/g, ' ')}
                        </span>
                        {a.review_status === 'more_information_required' && (
                          <span className="block text-[10px] font-semibold text-blue-400">More info requested</span>
                        )}
                        {a.review_resubmitted_at && a.review_status !== 'more_information_required' && (
                          <span className="block text-[10px] font-semibold text-cyan-400">
                            Resubmitted {new Date(a.review_resubmitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-white">{a.agreed_reward_amount_minor != null ? formatReward(a.agreed_reward_amount_minor, a.currency || 'GBP') : '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-400">{a.submitted_at ? new Date(a.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-400">{new Date(a.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {['submitted', 'review_required'].includes(a.status) && a.review_status !== 'more_information_required' && (
                          <>
                            <button onClick={() => openReview(a, 'accept')}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-medium cursor-pointer whitespace-nowrap" title="Accept submission">
                              Accept
                            </button>
                            <button onClick={() => openReview(a, 'request_information')}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-xs font-medium cursor-pointer whitespace-nowrap" title="Request more information">
                              Request Info
                            </button>
                            <button onClick={() => openReview(a, 'reject')}
                              className="px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium cursor-pointer whitespace-nowrap" title="Reject submission">
                              Reject
                            </button>
                          </>
                        )}
                        {a.status === 'retest_required' && (
                          <>
                            <button onClick={() => openReview(a, 'accept')}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-medium cursor-pointer whitespace-nowrap" title="Accept resubmission">
                                Accept
                              </button>
                            <button onClick={() => openReview(a, 'reject')}
                              className="px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium cursor-pointer whitespace-nowrap" title="Reject">
                                Reject
                              </button>
                          </>
                        )}
                        {['completed', 'approved'].includes(a.status) && !rewardedAssignmentIds.has(a.id) && (
                          <button onClick={() => approveReward(a.id)} disabled={rewardBusy === a.id}
                            className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 text-xs font-medium cursor-pointer whitespace-nowrap flex items-center gap-1" title="Approve reward">
                            {rewardBusy === a.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null} Approve Reward
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAssignments.length === 0 && (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">No assignments found</p>
              <p className="text-sm text-slate-500 mt-1">{searchQuery || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Accepted tester claims will appear here'}</p>
            </div>
          )}
        </div>
      </div>

      {reviewTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" onClick={() => setReviewTarget(null)}>
          <div className="bg-[#1E293B] border border-[rgba(255,255,255,0.08)] rounded-2xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-[rgba(255,255,255,0.08)]">
              <h2 className="text-lg font-bold text-white">
                {reviewDecision === 'accept' ? 'Accept Submission' : reviewDecision === 'request_information' ? 'Request More Information' : 'Reject Submission'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">{reviewTarget.tester_name} — {reviewTarget.job_title}</p>
            </div>
            <div className="p-5 space-y-4">
              {reviewError && (
                <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <p className="text-sm text-red-400">{reviewError}</p>
                </div>
              )}

              {reviewTarget.review_resubmitted_at && (
                <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                  <p className="text-xs font-semibold text-blue-400">
                    Resubmitted {new Date(reviewTarget.review_resubmitted_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {reviewTarget.review_feedback && (
                    <p className="mt-1 text-xs text-slate-400">Original request: {reviewTarget.review_feedback}</p>
                  )}
                </div>
              )}

              {reviewDecision === 'request_information' && (
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block font-medium">Test cases requiring more information</label>
                  <div className="max-h-52 overflow-y-auto rounded-xl border border-[rgba(255,255,255,0.08)] bg-white/5 divide-y divide-[rgba(255,255,255,0.06)]">
                    {reviewCasesLoading ? (
                      <div className="p-4 flex items-center gap-2 text-slate-400">
                        <Loader2 className="w-4 h-4 animate-spin" /> Loading cases...
                      </div>
                    ) : reviewCaseOptions.length === 0 ? (
                      <p className="p-4 text-sm text-slate-400">No test cases found for this assignment.</p>
                    ) : (
                      reviewCaseOptions.map((c) => {
                        const checked = selectedCaseIds.includes(c.id);
                        return (
                          <label key={c.id} className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-white/[0.03]">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleCaseSelection(c.id)}
                              className="w-4 h-4 rounded border-slate-500 text-[#06B6D4] focus:ring-[#06B6D4]/30 cursor-pointer"
                            />
                            <span className="text-xs font-mono font-semibold text-cyan-400">{c.reference}</span>
                            <span className="flex-1 text-sm text-slate-300 truncate">{c.title}</span>
                            <span className="text-[10px] uppercase text-slate-500">{c.status.replace(/_/g, ' ')}</span>
                          </label>
                        );
                      })
                    )}
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-500">{selectedCaseIds.length} case(s) selected</p>
                </div>
              )}

              <div>
                <label className="text-xs text-slate-400 mb-1.5 block font-medium">Tester-visible feedback {reviewDecision === 'accept' ? '(optional)' : '(required)'}</label>
                <textarea value={reviewFeedback} onChange={(e) => setReviewFeedback(e.target.value)} rows={3}
                  placeholder="Visible to the tester on their assignment page"
                  className="w-full px-4 py-2.5 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 focus:border-[#06B6D4]/40 resize-none" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block font-medium">Internal notes (never shown to tester)</label>
                <textarea value={reviewInternalNotes} onChange={(e) => setReviewInternalNotes(e.target.value)} rows={2}
                  placeholder="Private DFP notes"
                  className="w-full px-4 py-2.5 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 focus:border-[#06B6D4]/40 resize-none" />
              </div>
            </div>
            <div className="p-5 border-t border-[rgba(255,255,255,0.08)] flex justify-end gap-3">
              <button onClick={() => setReviewTarget(null)} className="px-4 py-2.5 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-xl text-sm text-slate-400 hover:text-white cursor-pointer whitespace-nowrap">Cancel</button>
              <button onClick={submitReview} disabled={reviewBusy}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer whitespace-nowrap flex items-center gap-2 disabled:opacity-50 ${reviewDecision === 'accept' ? 'bg-emerald-500 hover:bg-emerald-600' : reviewDecision === 'request_information' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'}`}>
                {reviewBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                {reviewDecision === 'accept' ? 'Accept' : reviewDecision === 'request_information' ? 'Request Info' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}