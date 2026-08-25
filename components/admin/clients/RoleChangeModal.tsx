'use client';

import { useEffect, useState } from 'react';
import PortalModal from './PortalModal';
import PortalRolePicker from './PortalRolePicker';
import { changePortalAccessRole } from '@/lib/portal-invite';
import { getRoleLabel, PRIVILEGED_PORTAL_ROLES } from '@/lib/portal-access';
import { Loader2, AlertTriangle } from 'lucide-react';

interface RoleChangeModalProps {
  open: boolean;
  onClose: () => void;
  record: { id: string; email: string | null; contact_name: string | null; access_role: string } | null;
  onChanged: () => void;
}

export default function RoleChangeModal({ open, onClose, record, onChanged }: RoleChangeModalProps) {
  const [role, setRole] = useState('viewer');
  const [confirmPrivileged, setConfirmPrivileged] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && record) {
      setRole(record.access_role);
      setConfirmPrivileged(false);
      setError(null);
      setSubmitting(false);
    }
  }, [open, record?.id]);

  const currentRole = record?.access_role ?? '';
  const isElevatingToPrivileged = PRIVILEGED_PORTAL_ROLES.includes(role as never) && !PRIVILEGED_PORTAL_ROLES.includes(currentRole as never);
  const canSubmit = role !== currentRole && (!isElevatingToPrivileged || confirmPrivileged) && !submitting;

  const handleSubmit = async () => {
    if (!record || !canSubmit) return;
    setSubmitting(true);
    setError(null);
    const result = await changePortalAccessRole(record.id, role);
    setSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }
    onChanged();
    onClose();
  };

  return (
    <PortalModal open={open} onClose={onClose} title="Change Access Role">
      {record && (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-[rgba(255,255,255,0.06)]">
            <p className="text-sm font-semibold text-white">{record.contact_name || 'Unnamed user'}</p>
            <p className="text-xs text-slate-400 mt-0.5">{record.email}</p>
            <p className="text-xs text-slate-500 mt-1">Current role: {getRoleLabel(record.access_role)}</p>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <PortalRolePicker value={role} onChange={(r) => setRole(r)} />

          {isElevatingToPrivileged && (
            <label className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmPrivileged}
                onChange={(e) => setConfirmPrivileged(e.target.checked)}
                className="mt-0.5 rounded border-[rgba(255,255,255,0.20)] bg-white/5"
              />
              <span className="text-xs text-amber-300">
                This grants an elevated, privileged role. I confirm I intend to assign this level of access.
              </span>
            </label>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={submitting}
              className="flex-1 px-4 py-2.5 bg-white/5 text-slate-400 rounded-xl text-sm font-semibold hover:bg-white/10 transition-all cursor-pointer disabled:opacity-40 whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="flex-1 px-4 py-2.5 bg-[#06B6D4] text-white rounded-xl text-sm font-semibold hover:bg-[#0891B2] transition-all cursor-pointer disabled:opacity-60 whitespace-nowrap flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Change Role
            </button>
          </div>
        </div>
      )}
    </PortalModal>
  );
}