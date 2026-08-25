'use client';

import { supabase } from '@/lib/supabase';

export type PortalDeniedReason =
  | 'unauthenticated'
  | 'none'
  | 'expired'
  | 'revoked'
  | 'inactive_client'
  | 'unavailable';

export interface PortalMembership {
  has_access: boolean;
  client_id?: string | null;
  access_role?: string | null;
  membership_id?: string | null;
  reason?: PortalDeniedReason;
}

export async function resolveActiveMembership(): Promise<PortalMembership> {
  try {
    const { data, error } = await supabase.rpc('get_active_portal_membership');
    if (error || !data) return { has_access: false, reason: 'unavailable' };
    return data as PortalMembership;
  } catch {
    return { has_access: false, reason: 'unavailable' };
  }
}

export async function recordPortalLogin(): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('record_portal_login');
    if (error) return false;
    return !!(data && (data as { ok?: boolean }).ok);
  } catch {
    return false;
  }
}