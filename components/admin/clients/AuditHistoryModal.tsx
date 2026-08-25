'use client';

import { useEffect, useState } from 'react';
import PortalModal from './PortalModal';
import { supabase } from '@/lib/supabase';
import { formatPortalDate } from '@/lib/portal-access';
import { History } from 'lucide-react';

interface AuditHistoryModalProps {
  open: boolean;
  onClose: () => void;
  record: { id: string; email: string | null; contact_name: string | null } | null;
}

interface AuditEvent {
  id: string;
  event_type: string;
  created_at: string | null;
  safe_metadata: Record<string, unknown> | null;
}

const EVENT_LABELS: Record<string, string> = {
  'portal.invitation_sent': 'Invitation sent',
  'portal.invitation_resent': 'Invitation resent',
  'portal.invitation_failed': 'Invitation failed',
  'portal.access_accepted': 'Access accepted',
  'portal.access_revoked': 'Access revoked',
  'portal.access_restored': 'Access restored',
  'portal.role_changed': 'Role changed',
};

function eventSummary(event: AuditEvent): string {
  const meta = event.safe_metadata ?? {};
  switch (event.event_type) {
    case 'portal.role_changed':
      return `Role changed from ${meta.from_role ?? '—'} to ${meta.to_role ?? '—'}`;
    case 'portal.access_revoked':
      return meta.reason ? `Reason: ${meta.reason}` : 'Access revoked';
    case 'portal.access_restored':
      return `Restored to ${meta.state ?? 'active'}`;
    case 'portal.invitation_sent':
    case 'portal.invitation_resent':
      return meta.email ? `Email: ${meta.email}` : '';
    case 'portal.invitation_failed':
      return meta.reason ? `Reason: ${meta.reason}` : 'Failed';
    default:
      return '';
  }
}

export default function AuditHistoryModal({ open, onClose, record }: AuditHistoryModalProps) {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !record) return;
    let active = true;
    setLoading(true);
    setError(null);

    (async () => {
      const { data, error: err } = await supabase
        .from('operational_audit_events')
        .select('id, event_type, created_at, safe_metadata')
        .eq('entity_type', 'portal_access')
        .eq('entity_id', record.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (!active) return;
      if (err) {
        setError('Audit history could not be loaded.');
      } else {
        setEvents((data as AuditEvent[]) ?? []);
      }
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [open, record]);

  return (
    <PortalModal open={open} onClose={onClose} title="Audit History" subtitle={record ? `${record.contact_name || 'User'} · ${record.email}` : undefined}>
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-7 h-7 border-2 border-[#06B6D4]/30 border-t-[#06B6D4] rounded-full animate-spin" />
        </div>
      ) : error ? (
        <p className="text-sm text-slate-400 py-6 text-center">{error}</p>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-center">
          <History className="w-10 h-10 text-slate-600 mb-3" />
          <p className="text-sm text-slate-500">No audit events recorded for this access.</p>
        </div>
      ) : (
        <div className="space-y-1 max-h-[50vh] overflow-y-auto pr-1">
          {events.map((event, i) => (
            <div key={event.id} className="flex gap-3 pb-1">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-[#06B6D4] mt-1.5" />
                {i < events.length - 1 && <div className="w-px flex-1 bg-[rgba(255,255,255,0.08)] mt-1" />}
              </div>
              <div className="pb-4">
                <p className="text-sm text-slate-200">{EVENT_LABELS[event.event_type] ?? event.event_type}</p>
                {eventSummary(event) && <p className="text-xs text-slate-500 mt-0.5">{eventSummary(event)}</p>}
                <p className="text-xs text-slate-600 mt-0.5">{formatPortalDate(event.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </PortalModal>
  );
}