export interface AssignmentStatusConfig {
  label: string;
  badge: string;
}

export const ASSIGNMENT_STATUS_CONFIG: Record<string, AssignmentStatusConfig> = {
  reserved: { label: 'Reserved', badge: 'bg-sky-100 text-sky-700' },
  offered: { label: 'Offered', badge: 'bg-cyan-100 text-cyan-700' },
  accepted: { label: 'Accepted', badge: 'bg-violet-100 text-violet-700' },
  declined: { label: 'Declined', badge: 'bg-slate-100 text-slate-600' },
  active: { label: 'Active', badge: 'bg-emerald-100 text-emerald-700' },
  in_progress: { label: 'In Progress', badge: 'bg-emerald-100 text-emerald-700' },
  assigned: { label: 'Assigned', badge: 'bg-sky-100 text-sky-700' },
  testing: { label: 'Testing', badge: 'bg-emerald-100 text-emerald-700' },
  submitted: { label: 'Submitted for Review', badge: 'bg-amber-100 text-amber-700' },
  review_required: { label: 'Awaiting Review', badge: 'bg-amber-100 text-amber-700' },
  retest_required: { label: 'Retest Required', badge: 'bg-orange-100 text-orange-700' },
  completed: { label: 'Completed', badge: 'bg-emerald-100 text-emerald-700' },
  complete: { label: 'Completed', badge: 'bg-emerald-100 text-emerald-700' },
  approved: { label: 'Approved', badge: 'bg-emerald-100 text-emerald-700' },
  rejected: { label: 'Rejected', badge: 'bg-rose-100 text-rose-700' },
  expired: { label: 'Expired', badge: 'bg-slate-100 text-slate-600' },
  cancelled: { label: 'Cancelled', badge: 'bg-rose-100 text-rose-700' },
  no_show: { label: 'No Show', badge: 'bg-slate-100 text-slate-600' },
};

export type AssignmentSection = 'active' | 'review' | 'completed' | 'cancelled';

const GROUP_ACTIVE = ['reserved', 'offered', 'accepted', 'active', 'in_progress', 'assigned', 'testing'];
const GROUP_REVIEW = ['submitted', 'review_required', 'retest_required'];
const GROUP_COMPLETED = ['completed', 'complete', 'approved'];
const GROUP_CANCELLED = ['cancelled', 'expired', 'declined', 'no_show', 'rejected'];

export function assignmentSection(status: string): AssignmentSection {
  if (GROUP_ACTIVE.includes(status)) return 'active';
  if (GROUP_REVIEW.includes(status)) return 'review';
  if (GROUP_COMPLETED.includes(status)) return 'completed';
  return 'cancelled';
}

export function assignmentLabel(status: string): string {
  return (
    ASSIGNMENT_STATUS_CONFIG[status]?.label ||
    status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export function assignmentBadge(status: string): string {
  return ASSIGNMENT_STATUS_CONFIG[status]?.badge || 'bg-slate-100 text-slate-600';
}

export type { RewardStatus } from '@/lib/uat-earnings';

export {
  resolveRewardStatus,
  rewardStatusLabel,
  rewardStatusBadge,
  rewardStatusExplanation,
} from '@/lib/uat-earnings';

export const COMPLETED_TEST_CASE_STATUSES = ['passed', 'failed', 'blocked', 'skipped'];

export interface Progress {
  completed: number;
  total: number;
  percent: number;
}

export function computeProgress(completed: number, total: number): Progress {
  const safeTotal = Math.max(0, total);
  const safeCompleted = Math.min(Math.max(0, completed), safeTotal);
  const percent = safeTotal === 0 ? 0 : Math.round((safeCompleted / safeTotal) * 100);
  return { completed: safeCompleted, total: safeTotal, percent };
}

export type ReviewCategory = 'awaiting' | 'more_info' | 'accepted' | 'rejected' | 'completed';

export interface ReviewStatusInfo {
  category: ReviewCategory;
  label: string;
  badge: string;
}

const REVIEW_MORE_INFO = [
  'more_information_required', 'changes_requested', 'changes_required',
  'needs_clarification', 'request_more_information', 'revision_requested',
  'retest_requested', 'retest_required',
];
const REVIEW_ACCEPTED = ['accepted', 'approved'];
const REVIEW_REJECTED = ['rejected', 'declined'];
const REVIEW_COMPLETED = ['completed', 'complete'];
const REVIEW_AWAITING = ['awaiting_review', 'awaiting', 'submitted', 'pending', 'in_review', 'under_review'];

export function resolveReviewStatus(
  assignmentStatus: string,
  reviewStatus: string | null | undefined,
): ReviewStatusInfo {
  const rs = (reviewStatus || '').toLowerCase();

  if (REVIEW_MORE_INFO.includes(rs)) {
    return { category: 'more_info', label: 'More Information Required', badge: 'bg-blue-100 text-blue-700' };
  }
  if (REVIEW_ACCEPTED.includes(rs)) {
    return { category: 'accepted', label: 'Accepted', badge: 'bg-emerald-100 text-emerald-700' };
  }
  if (REVIEW_REJECTED.includes(rs)) {
    return { category: 'rejected', label: 'Rejected', badge: 'bg-rose-100 text-rose-700' };
  }
  if (REVIEW_COMPLETED.includes(rs)) {
    return { category: 'completed', label: 'Completed', badge: 'bg-emerald-100 text-emerald-700' };
  }
  if (REVIEW_AWAITING.includes(rs)) {
    return { category: 'awaiting', label: 'Awaiting Review', badge: 'bg-amber-100 text-amber-700' };
  }

  if (['retest_required'].includes(assignmentStatus)) {
    return { category: 'more_info', label: 'More Information Required', badge: 'bg-blue-100 text-blue-700' };
  }
  if (['submitted', 'review_required'].includes(assignmentStatus)) {
    return { category: 'awaiting', label: 'Awaiting Review', badge: 'bg-amber-100 text-amber-700' };
  }
  if (['completed', 'complete', 'approved'].includes(assignmentStatus)) {
    return { category: 'accepted', label: 'Accepted', badge: 'bg-emerald-100 text-emerald-700' };
  }
  if (['rejected'].includes(assignmentStatus)) {
    return { category: 'rejected', label: 'Rejected', badge: 'bg-rose-100 text-rose-700' };
  }

  return { category: 'awaiting', label: 'Awaiting Review', badge: 'bg-amber-100 text-amber-700' };
}