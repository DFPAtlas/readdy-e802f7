'use client';

import { supabase } from '@/lib/supabase';

const FUNCTION_NAME = 'invite-client-portal-user';

const FRIENDLY_ERRORS: Record<string, string> = {
  UNAUTHENTICATED: 'Your session has expired. Please sign in again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  CLIENT_NOT_FOUND: 'The client or access record could not be found.',
  CLIENT_INACTIVE: 'This client is not active and cannot receive invitations.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_ROLE: 'Please choose a valid access role.',
  ALREADY_ACTIVE: 'This email already has active portal access for this client.',
  RATE_LIMITED: 'Please wait a moment before trying again.',
  INVITATION_FAILED: 'The request could not be completed. Please try again.',
};

export interface PortalInviteResult {
  ok: boolean;
  code: string;
  message: string;
  accessId?: string;
  accessRole?: string;
}

async function invoke(action: string, body: Record<string, unknown>): Promise<PortalInviteResult> {
  let res;
  try {
    res = await supabase.functions.invoke(FUNCTION_NAME, { body: { action, ...body } });
  } catch {
    return { ok: false, code: 'INVITATION_FAILED', message: FRIENDLY_ERRORS.INVITATION_FAILED };
  }

  let code = 'INVITATION_FAILED';
  let accessId: string | undefined;
  let accessRole: string | undefined;

  if (res.data) {
    const d = res.data as { code?: string; access_id?: string; access_role?: string };
    code = d?.code ?? code;
    accessId = d?.access_id;
    accessRole = d?.access_role;
  } else if (res.error) {
    const err = res.error as { context?: { status?: number }; status?: number };
    const status = err?.context?.status ?? err?.status ?? 0;
    if (status === 401) code = 'UNAUTHENTICATED';
    else if (status === 403) code = 'FORBIDDEN';
    else if (status === 429) code = 'RATE_LIMITED';
    else if (status === 404) code = 'CLIENT_NOT_FOUND';
    else code = 'INVITATION_FAILED';
  }

  if (code === 'OK') {
    return { ok: true, code, message: 'Success.', accessId, accessRole };
  }

  return { ok: false, code, message: FRIENDLY_ERRORS[code] ?? 'Something went wrong. Please try again.' };
}

export interface InvitePortalUserPayload {
  client_id: string;
  email: string;
  access_role: string;
  contact_name?: string | null;
  expires_at?: string | null;
  personal_message?: string | null;
}

export function invitePortalUser(payload: InvitePortalUserPayload): Promise<PortalInviteResult> {
  return invoke('invite', {
    client_id: payload.client_id,
    email: payload.email,
    access_role: payload.access_role,
    contact_name: payload.contact_name ?? null,
    expires_at: payload.expires_at ?? null,
    personal_message: payload.personal_message ?? null,
  });
}

export function resendInvitation(accessId: string): Promise<PortalInviteResult> {
  return invoke('resend', { access_id: accessId });
}

export function revokePortalAccess(accessId: string, reason: string): Promise<PortalInviteResult> {
  return invoke('revoke', { access_id: accessId, reason });
}

export function restorePortalAccess(accessId: string): Promise<PortalInviteResult> {
  return invoke('restore', { access_id: accessId });
}

export function changePortalAccessRole(accessId: string, accessRole: string): Promise<PortalInviteResult> {
  return invoke('change_role', { access_id: accessId, access_role: accessRole });
}