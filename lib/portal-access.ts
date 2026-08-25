export const PORTAL_ACCESS_ROLES = ['owner', 'admin', 'billing', 'project_member', 'viewer'] as const;

export type PortalAccessRole = (typeof PORTAL_ACCESS_ROLES)[number];

export const PORTAL_ACCESS_ROLE_LABELS: Record<PortalAccessRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  billing: 'Billing',
  project_member: 'Project Member',
  viewer: 'Viewer',
};

export const PORTAL_ACCESS_ROLE_DESCRIPTIONS: Record<PortalAccessRole, string> = {
  owner: 'Full access to everything in the portal, including billing and managing other portal users.',
  admin: 'Manage projects, approvals and portal content, but cannot change billing or portal users.',
  billing: 'View and manage invoices, payments and billing details only.',
  project_member: 'Access assigned projects, tasks, files and messages.',
  viewer: 'Read-only access to projects, files and milestones.',
};

export const PRIVILEGED_PORTAL_ROLES: PortalAccessRole[] = ['owner', 'admin'];

export interface PortalAccessRow {
  id: string;
  client_id: string;
  contact_id: string | null;
  user_id: string | null;
  email: string | null;
  contact_name: string | null;
  access_role: string;
  project_ids: string[] | null;
  service_ids: string[] | null;
  invitation_state: string | null;
  invited_at: string | null;
  invited_by: string | null;
  accepted_at: string | null;
  last_login_at: string | null;
  expires_at: string | null;
  is_revoked: boolean | null;
  revoked_at: string | null;
  revoked_by: string | null;
  revocation_reason: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export type PortalState = 'none' | 'pending' | 'active' | 'partial' | 'revoked';

export const PORTAL_STATE_LABELS: Record<PortalState, string> = {
  none: 'No Access',
  pending: 'Invitation Pending',
  active: 'Active',
  partial: 'Partially Active',
  revoked: 'Suspended / Revoked',
};

export function derivePortalState(records: PortalAccessRow[]): PortalState {
  if (!records.length) return 'none';
  const accepted = records.filter((r) => r.is_revoked !== true && r.invitation_state === 'accepted');
  const pending = records.filter((r) => r.is_revoked !== true && ['pending', 'sent'].includes(r.invitation_state ?? ''));
  const anyRevoked = records.some((r) => r.is_revoked === true);
  const onlyRevoked = records.every((r) => r.is_revoked === true || r.invitation_state === 'expired');

  if (accepted.length > 0 && pending.length > 0) return 'partial';
  if (accepted.length > 0) return 'active';
  if (pending.length > 0) return 'pending';
  if (anyRevoked && onlyRevoked) return 'revoked';
  return 'none';
}

export type PortalFilterKey = 'all' | 'active' | 'pending' | 'expired' | 'revoked';

export const PORTAL_FILTERS: { key: PortalFilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'pending', label: 'Pending' },
  { key: 'expired', label: 'Expired' },
  { key: 'revoked', label: 'Revoked' },
];

export function matchesPortalFilter(record: PortalAccessRow, filter: PortalFilterKey): boolean {
  switch (filter) {
    case 'active':
      return record.is_revoked !== true && record.invitation_state === 'accepted';
    case 'pending':
      return record.is_revoked !== true && ['pending', 'sent'].includes(record.invitation_state ?? '');
    case 'expired':
      return record.is_revoked !== true && record.invitation_state === 'expired';
    case 'revoked':
      return record.is_revoked === true;
    default:
      return true;
  }
}

export function countActive(records: PortalAccessRow[]): number {
  return records.filter((r) => r.is_revoked !== true && r.invitation_state === 'accepted').length;
}

export function countPending(records: PortalAccessRow[]): number {
  return records.filter((r) => r.is_revoked !== true && ['pending', 'sent'].includes(r.invitation_state ?? '')).length;
}

export function countRevoked(records: PortalAccessRow[]): number {
  return records.filter((r) => r.is_revoked === true).length;
}

export function formatPortalDate(value: string | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function isPendingInvitation(record: PortalAccessRow): boolean {
  return record.is_revoked !== true && ['pending', 'sent', 'expired', 'failed'].includes(record.invitation_state ?? '');
}

export function canResend(record: PortalAccessRow): boolean {
  return record.is_revoked !== true && ['pending', 'sent', 'expired', 'failed'].includes(record.invitation_state ?? '');
}

export function isRoleKey(value: string): value is PortalAccessRole {
  return (PORTAL_ACCESS_ROLES as readonly string[]).includes(value);
}

export function getRoleLabel(value: string | null | undefined): string {
  if (!value) return '—';
  return isRoleKey(value) ? PORTAL_ACCESS_ROLE_LABELS[value] : value;
}