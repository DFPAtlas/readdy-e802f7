'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  PORTAL_FILTERS,
  PORTAL_STATE_LABELS,
  derivePortalState,
  matchesPortalFilter,
  countActive,
  countPending,
  countRevoked,
  formatPortalDate,
  getRoleLabel,
  canResend,
  type PortalAccessRow,
  type PortalFilterKey,
  type PortalState,
} from '@/lib/portal-access';
import { resendInvitation, restorePortalAccess } from '@/lib/portal-invite';
import InvitePortalUserModal from './InvitePortalUserModal';
import RoleChangeModal from './RoleChangeModal';
import RevokeAccessModal from './RevokeAccessModal';
import ConfirmActionModal from './ConfirmActionModal';
import AuditHistoryModal from './AuditHistoryModal';
import {
  UserPlus, Search, RefreshCw, ShieldOff, RotateCcw, Copy, History, KeyRound,
  Mail, Clock, CheckCircle2, AlertTriangle, Users, Loader2,
} from 'lucide-react';

interface PortalAccessTabProps {
  clientId: string;
  clientName: string;
  clientContact: string | null;
  records: PortalAccessRow[];
  onRefresh: () => Promise<void>;
}

const PORTAL_STATE_COLORS: Record<PortalState, string> = {
  none: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  partial: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  revoked: 'bg-red-500/10 text-red-400 border-red-500/20',
};

function stateBadge(record: PortalAccessRow): { label: string; className: string } {
  if (record.is_revoked === true) return { label: 'Revoked', className: 'bg-red-500/10 text-red-400' };
  if (record.invitation_state === 'accepted') return { label: 'Active', className: 'bg-emerald-500/10 text-emerald-400' };
  if (record.invitation_state === 'expired') return { label: 'Expired', className: 'bg-slate-500/10 text-slate-400' };
  if (record.invitation_state === 'failed') return { label: 'Failed', className: 'bg-red-500/10 text-red-400' };
  if (record.invitation_state === 'sent') return { label: 'Sent', className: 'bg-amber-500/10 text-amber-400' };
  return { label: 'Pending', className: 'bg-amber-500/10 text-amber-400' };
}

export default function PortalAccessTab({ clientId, clientName, clientContact, records, onRefresh }: PortalAccessTabProps) {
  const [filter, setFilter] = useState<PortalFilterKey>('all');
  const [search, setSearch] = useState('');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [roleTarget, setRoleTarget] = useState<PortalAccessRow | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<PortalAccessRow | null>(null);
  const [auditTarget, setAuditTarget] = useState<PortalAccessRow | null>(null);
  const [confirm, setConfirm] = useState<{ record: PortalAccessRow; type: 'resend' | 'restore' } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const portalState = useMemo(() => derivePortalState(records), [records]);
  const activeCount = countActive(records);
  const pendingCount = countPending(records);
  const revokedCount = countRevoked(records);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records.filter((r) => {
      if (!matchesPortalFilter(r, filter)) return false;
      if (!q) return true;
      return (
        (r.contact_name ?? '').toLowerCase().includes(q) ||
        (r.email ?? '').toLowerCase().includes(q)
      );
    });
  }, [records, filter, search]);

  const handleRefresh = async () => {
    await onRefresh();
  };

  const handleResend = async () => {
    if (!confirm) return;
    setBusyId(confirm.record.id);
    setConfirmError(null);
    const res = await resendInvitation(confirm.record.id);
    setBusyId(null);
    if (!res.ok) {
      setConfirmError(res.message);
      return;
    }
    const record = confirm.record;
    setConfirm(null);
    setToast({ type: 'success', message: `Invitation resent to ${record.email ?? 'user'}.` });
    await handleRefresh();
  };

  const handleRestore = async () => {
    if (!confirm) return;
    setBusyId(confirm.record.id);
    setConfirmError(null);
    const res = await restorePortalAccess(confirm.record.id);
    setBusyId(null);
    if (!res.ok) {
      setConfirmError(res.message);
      return;
    }
    const record = confirm.record;
    setConfirm(null);
    setToast({ type: 'success', message: `Portal access restored for ${record.contact_name || record.email}.` });
    await handleRefresh();
  };

  const copyLoginUrl = async () => {
    const url = `${window.location.origin}/portal/login`;
    try {
      await navigator.clipboard.writeText(url);
      setToast({ type: 'success', message: 'Portal login URL copied.' });
    } catch {
      setToast({ type: 'error', message: `Could not copy. Use ${url}` });
    }
  };

  const openResend = (record: PortalAccessRow) => {
    setConfirmError(null);
    setConfirm({ record, type: 'resend' });
  };

  const openRestore = (record: PortalAccessRow) => {
    setConfirmError(null);
    setConfirm({ record, type: 'restore' });
  };

  const confirmRecord = confirm?.record;

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className={`flex items-start gap-2 p-3 rounded-xl text-sm border ${
            toast.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              : 'bg-red-500/10 border-red-500/20 text-red-300'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          )}
          {toast.message}
        </div>
      )}

      <div className="bg-[#1E293B] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-lg font-bold text-white">{clientName}</h3>
            {clientContact && <p className="text-sm text-slate-400 mt-1">{clientContact}</p>}
            <div className="flex items-center gap-2 mt-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${PORTAL_STATE_COLORS[portalState]}`}>
                {PORTAL_STATE_LABELS[portalState]}
              </span>
            </div>
          </div>
          <button
            onClick={() => setInviteOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#06B6D4] text-white rounded-xl text-sm font-semibold hover:bg-[#0891B2] transition-all cursor-pointer whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4" />
            Invite Portal User
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center gap-2 text-emerald-400">
              <Users className="w-4 h-4" />
              <span className="text-xs text-slate-400 uppercase tracking-wider">Active</span>
            </div>
            <p className="text-2xl font-bold text-white mt-1">{activeCount}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center gap-2 text-amber-400">
              <Clock className="w-4 h-4" />
              <span className="text-xs text-slate-400 uppercase tracking-wider">Pending</span>
            </div>
            <p className="text-2xl font-bold text-white mt-1">{pendingCount}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center gap-2 text-red-400">
              <ShieldOff className="w-4 h-4" />
              <span className="text-xs text-slate-400 uppercase tracking-wider">Revoked</span>
            </div>
            <p className="text-2xl font-bold text-white mt-1">{revokedCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#1E293B] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="flex gap-1 p-1 bg-white/[0.03] rounded-full">
            {PORTAL_FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  filter === f.key ? 'bg-[#06B6D4]/15 text-[#06B6D4]' : 'text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
              className="w-full pl-9 pr-3 py-2 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20"
            />
          </div>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-slate-400 hover:text-white border border-[rgba(255,255,255,0.08)] rounded-xl transition-colors cursor-pointer whitespace-nowrap"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-[rgba(255,255,255,0.08)] flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-slate-500" />
            </div>
            <h4 className="text-white font-semibold">No portal access has been created for this client.</h4>
            <p className="text-sm text-slate-400 mt-1 max-w-sm">
              Invite the first user to give them secure access to the client portal, projects and files.
            </p>
            <button
              onClick={() => setInviteOpen(true)}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-[#06B6D4] text-white rounded-xl text-sm font-semibold hover:bg-[#0891B2] transition-all cursor-pointer whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4" />
              Invite First Portal User
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-slate-500 py-12 text-center">No users match your current filter or search.</p>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.06)]">
                    <th className="text-left py-3 px-3 text-xs text-slate-400 uppercase">Contact</th>
                    <th className="text-left py-3 px-3 text-xs text-slate-400 uppercase">Email</th>
                    <th className="text-left py-3 px-3 text-xs text-slate-400 uppercase">Role</th>
                    <th className="text-left py-3 px-3 text-xs text-slate-400 uppercase">State</th>
                    <th className="text-left py-3 px-3 text-xs text-slate-400 uppercase">Invited</th>
                    <th className="text-left py-3 px-3 text-xs text-slate-400 uppercase">Accepted</th>
                    <th className="text-left py-3 px-3 text-xs text-slate-400 uppercase">Last Login</th>
                    <th className="text-left py-3 px-3 text-xs text-slate-400 uppercase">Expiry</th>
                    <th className="text-right py-3 px-3 text-xs text-slate-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((record) => {
                    const badge = stateBadge(record);
                    return (
                      <tr key={record.id} className="border-b border-[rgba(255,255,255,0.04)]">
                        <td className="py-3 px-3 text-sm text-white">{record.contact_name || '—'}</td>
                        <td className="py-3 px-3 text-sm text-slate-300">{record.email || '—'}</td>
                        <td className="py-3 px-3 text-sm text-slate-300">{getRoleLabel(record.access_role)}</td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium ${badge.className}`}>{badge.label}</span>
                        </td>
                        <td className="py-3 px-3 text-sm text-slate-400">{formatPortalDate(record.invited_at)}</td>
                        <td className="py-3 px-3 text-sm text-slate-400">{formatPortalDate(record.accepted_at)}</td>
                        <td className="py-3 px-3 text-sm text-slate-400">{formatPortalDate(record.last_login_at)}</td>
                        <td className="py-3 px-3 text-sm text-slate-400">{formatPortalDate(record.expires_at)}</td>
                        <td className="py-3 px-3 text-right">
                          <ActionButtons
                            record={record}
                            busy={busyId === record.id}
                            onResend={openResend}
                            onCopy={copyLoginUrl}
                            onRole={setRoleTarget}
                            onRevoke={setRevokeTarget}
                            onRestore={openRestore}
                            onAudit={setAuditTarget}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-3">
              {filtered.map((record) => {
                const badge = stateBadge(record);
                return (
                  <div key={record.id} className="p-4 bg-white/[0.02] rounded-xl border border-[rgba(255,255,255,0.06)]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{record.contact_name || 'Unnamed user'}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{record.email || '—'}</p>
                      </div>
                      <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium shrink-0 ${badge.className}`}>{badge.label}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 flex-wrap">
                      <span>Role: {getRoleLabel(record.access_role)}</span>
                      <span>Invited: {formatPortalDate(record.invited_at)}</span>
                    </div>
                    <div className="mt-3">
                      <ActionButtons
                        record={record}
                        busy={busyId === record.id}
                        onResend={openResend}
                        onCopy={copyLoginUrl}
                        onRole={setRoleTarget}
                        onRevoke={setRevokeTarget}
                        onRestore={openRestore}
                        onAudit={setAuditTarget}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <InvitePortalUserModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        clientId={clientId}
        clientName={clientName}
        onInvited={() => {
          setToast({ type: 'success', message: 'Portal invitation sent.' });
        }}
      />

      <RoleChangeModal
        open={roleTarget !== null}
        onClose={() => setRoleTarget(null)}
        record={roleTarget ? { id: roleTarget.id, email: roleTarget.email, contact_name: roleTarget.contact_name, access_role: roleTarget.access_role } : null}
        onChanged={() => {
          setToast({ type: 'success', message: 'Access role updated.' });
          handleRefresh();
        }}
      />

      <RevokeAccessModal
        open={revokeTarget !== null}
        onClose={() => setRevokeTarget(null)}
        clientName={clientName}
        record={revokeTarget ? { id: revokeTarget.id, email: revokeTarget.email, contact_name: revokeTarget.contact_name } : null}
        onChanged={() => {
          setToast({ type: 'success', message: 'Portal access revoked.' });
          handleRefresh();
        }}
      />

      <ConfirmActionModal
        open={confirm !== null && confirm.type === 'resend'}
        onClose={() => setConfirm(null)}
        title="Resend Invitation"
        confirmLabel="Resend Invitation"
        busy={confirmRecord ? busyId === confirmRecord.id : false}
        error={confirmError}
        onConfirm={handleResend}
        description={
          confirmRecord ? (
            <div className="space-y-2">
              <p>Send a new secure sign-in link to <span className="text-white font-medium">{confirmRecord.email}</span>.</p>
              <p className="text-xs text-slate-500">Last invitation sent: {formatPortalDate(confirmRecord.invited_at)}</p>
              <p className="text-xs text-slate-500">Resends are rate-limited to one per minute.</p>
            </div>
          ) : null
        }
      />

      <ConfirmActionModal
        open={confirm !== null && confirm.type === 'restore'}
        onClose={() => setConfirm(null)}
        title="Restore Portal Access"
        confirmLabel="Restore Access"
        busy={confirmRecord ? busyId === confirmRecord.id : false}
        error={confirmError}
        onConfirm={handleRestore}
        description={
          confirmRecord ? (
            <div className="space-y-2">
              <p>
                Restore portal access for <span className="text-white font-medium">{confirmRecord.contact_name || confirmRecord.email}</span>.
              </p>
              <p className="text-xs text-slate-500">
                Restoring access will <strong>not</strong> automatically send a new invitation email. If this user needs a
                fresh sign-in link, resend the invitation afterwards.
              </p>
            </div>
          ) : null
        }
      />

      <AuditHistoryModal
        open={auditTarget !== null}
        onClose={() => setAuditTarget(null)}
        record={auditTarget ? { id: auditTarget.id, email: auditTarget.email, contact_name: auditTarget.contact_name } : null}
      />
    </div>
  );
}

interface ActionButtonsProps {
  record: PortalAccessRow;
  busy: boolean;
  onResend: (record: PortalAccessRow) => void;
  onCopy: () => void;
  onRole: (record: PortalAccessRow) => void;
  onRevoke: (record: PortalAccessRow) => void;
  onRestore: (record: PortalAccessRow) => void;
  onAudit: (record: PortalAccessRow) => void;
}

function ActionButtons({ record, busy, onResend, onCopy, onRole, onRevoke, onRestore, onAudit }: ActionButtonsProps) {
  const iconBtn =
    'w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed';

  return (
    <div className="inline-flex items-center gap-1">
      {busy ? (
        <Loader2 className="w-4 h-4 animate-spin text-[#06B6D4] mx-2" />
      ) : (
        <>
          {canResend(record) && (
            <button onClick={() => onResend(record)} title="Resend invitation" className={iconBtn}>
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          <button onClick={onCopy} title="Copy portal login URL" className={iconBtn}>
            <Copy className="w-4 h-4" />
          </button>
          {record.is_revoked !== true && (
            <button onClick={() => onRole(record)} title="Change role" className={iconBtn}>
              <KeyRound className="w-4 h-4" />
            </button>
          )}
          {record.is_revoked === true ? (
            <button onClick={() => onRestore(record)} title="Restore access" className={iconBtn}>
              <RotateCcw className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={() => onRevoke(record)} title="Revoke access" className={iconBtn}>
              <ShieldOff className="w-4 h-4" />
            </button>
          )}
          <button onClick={() => onAudit(record)} title="View audit history" className={iconBtn}>
            <History className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
}