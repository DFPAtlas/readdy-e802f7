'use client';

import type { ReactNode } from 'react';
import PortalModal from './PortalModal';
import { Loader2, AlertTriangle } from 'lucide-react';

interface ConfirmActionModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  confirmVariant?: 'primary' | 'danger';
  busy: boolean;
  error: string | null;
  onConfirm: () => void;
}

export default function ConfirmActionModal({
  open,
  onClose,
  title,
  description,
  confirmLabel,
  confirmVariant = 'primary',
  busy,
  error,
  onConfirm,
}: ConfirmActionModalProps) {
  const confirmClasses =
    confirmVariant === 'danger'
      ? 'bg-red-500 text-white hover:bg-red-600'
      : 'bg-[#06B6D4] text-white hover:bg-[#0891B2]';

  return (
    <PortalModal open={open} onClose={busy ? () => {} : onClose} title={title}>
      <div className="space-y-4">
        <div className="text-sm text-slate-300 leading-relaxed">{description}</div>

        {error && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={busy}
            className="flex-1 px-4 py-2.5 bg-white/5 text-slate-400 rounded-xl text-sm font-semibold hover:bg-white/10 transition-all cursor-pointer disabled:opacity-40 whitespace-nowrap"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:opacity-60 whitespace-nowrap flex items-center justify-center gap-2 ${confirmClasses}`}
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </PortalModal>
  );
}