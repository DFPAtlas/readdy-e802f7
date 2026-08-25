'use client';

import { useEffect, useState } from 'react';
import PortalModal from './PortalModal';
import { revokePortalAccess } from '@/lib/portal-invite';
import { Loader2, AlertTriangle, ShieldOff } from 'lucide-react';

interface RevokeAccessModalProps {
  open: boolean;
  onClose: () => void;
  clientName: string;
  record: { id: string; email: string | null; contact_name: string | null } | null;
  onChanged: () => void;
}

export default function RevokeAccessModal({ open, onClose, clientName, record, onChanged }: RevokeAccessModalProps) {
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && record) {
      setReason('');
      setConfirmed(false);
      setError(null);
      setSubmitting(false);
    }
  }, [open, record?.id]);

  const canSubmit = reason.trim().length > 0 && confirmed && !submitting;

  const handleSubmit = async () => {
    if (!record || !canSubmit) return;
    setSubmitting(true);
    setError(null);
    const result = await revokePortalAccess(record.id, reason.trim());
    setSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }
    onChanged();
    onClose();
  };

  return (
    <PortalModal open={open} onClose={onClose} title="Revoke Portal Access">
      {record && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <ShieldOff className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="text-sm text-red-300">
              <p className="font-semibold">Portal access will stop immediately.</p>
              <p className="text-xs text-red-300/80 mt-1">
                This revokes access for {record.contact_name || 'this user'} ({record.email}) to {clientName}.
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Historical records — including messages, files, invoices and approval history — will <strong>not</strong> be
            deleted. This only stops future portal access.
          </p>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Revocation reason *</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value.slice(0, 500))}
              rows={3}
              maxLength={500}
              placeholder="Why is access being revoked?"
              className="w-full px-3 py-2.5 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 resize-none"
            />
          </div>

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 rounded border-[rgba(255,255,255,0.20)] bg-white/5"
            />
            <span className="text-xs text-slate-300">
              I confirm I want to revoke portal access for {record.contact_name || 'this user'} at {clientName}.
            </span>
          </label>

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
              className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-all cursor-pointer disabled:opacity-60 whitespace-nowrap flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Revoke Access
            </button>
          </div>
        </div>
      )}
    </PortalModal>
  );
}