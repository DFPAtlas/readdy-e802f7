'use client';

import { useState } from 'react';
import PortalModal from './PortalModal';
import PortalRolePicker from './PortalRolePicker';
import { invitePortalUser, type PortalInviteResult } from '@/lib/portal-invite';
import { Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface InvitePortalUserModalProps {
  open: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
  onInvited: () => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function InvitePortalUserModal({ open, onClose, clientId, clientName, onInvited }: InvitePortalUserModalProps) {
  const [email, setEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [role, setRole] = useState('viewer');
  const [expiry, setExpiry] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const reset = () => {
    setEmail('');
    setContactName('');
    setRole('viewer');
    setExpiry('');
    setMessage('');
    setError(null);
    setSuccess(false);
    setSubmitting(false);
  };

  const handleClose = () => {
    if (submitting) return;
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError('Please enter an email address.');
      return;
    }
    if (!EMAIL_RE.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    const result: PortalInviteResult = await invitePortalUser({
      client_id: clientId,
      email: trimmedEmail,
      access_role: role,
      contact_name: contactName.trim() || null,
      expires_at: expiry || null,
      personal_message: message.trim() || null,
    });
    setSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setSuccess(true);
    onInvited();
    setTimeout(() => {
      reset();
      onClose();
    }, 1200);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <PortalModal open={open} onClose={handleClose} title="Invite Portal User" subtitle={`This invitation is for ${clientName}.`}>
      {success ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3" />
          <p className="text-white font-semibold">Invitation sent</p>
          <p className="text-sm text-slate-400 mt-1">A secure sign-in link has been emailed to {email.trim()}.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Email address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              autoFocus
              className="w-full px-3 py-2.5 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Contact name</label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="e.g. Jane Smith"
              className="w-full px-3 py-2.5 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Access role *</label>
            <PortalRolePicker value={role} onChange={setRole} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Invitation expiry (optional)</label>
              <input
                type="date"
                min={today}
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Personal message (optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 500))}
              rows={3}
              maxLength={500}
              placeholder="A short note to include in the invitation email..."
              className="w-full px-3 py-2.5 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 resize-none"
            />
            <p className="text-right text-xs text-slate-500 mt-1">{message.length}/500</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleClose}
              disabled={submitting}
              className="flex-1 px-4 py-2.5 bg-white/5 text-slate-400 rounded-xl text-sm font-semibold hover:bg-white/10 transition-all cursor-pointer disabled:opacity-40 whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 px-4 py-2.5 bg-[#06B6D4] text-white rounded-xl text-sm font-semibold hover:bg-[#0891B2] transition-all cursor-pointer disabled:opacity-60 whitespace-nowrap flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Send Invitation
            </button>
          </div>
        </div>
      )}
    </PortalModal>
  );
}