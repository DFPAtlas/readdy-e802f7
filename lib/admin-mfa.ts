import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export type AdminMfaDestination = '/admin' | '/admin/mfa' | '/admin/mfa/setup';

export type AdminAalLevel = 'aal1' | 'aal2';

export interface AdminMfaState {
  currentLevel: AdminAalLevel | null;
  nextLevel: AdminAalLevel | null;
  destination: AdminMfaDestination | null;
}

export async function getAdminMfaDestination(): Promise<AdminMfaState> {
  const empty: AdminMfaState = { currentLevel: null, nextLevel: null, destination: null };

  if (!isSupabaseConfigured()) {
    return empty;
  }

  try {
    const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

    if (error || !data) {
      return empty;
    }

    const currentLevel = data.currentLevel === 'aal2' ? 'aal2' : data.currentLevel === 'aal1' ? 'aal1' : null;
    const nextLevel = data.nextLevel === 'aal2' ? 'aal2' : data.nextLevel === 'aal1' ? 'aal1' : null;

    let destination: AdminMfaDestination | null = null;

    if (currentLevel === 'aal2') {
      destination = '/admin';
    } else if (currentLevel === 'aal1' && nextLevel === 'aal2') {
      destination = '/admin/mfa';
    } else if (currentLevel === 'aal1' && nextLevel === 'aal1') {
      destination = '/admin/mfa/setup';
    }

    return { currentLevel, nextLevel, destination };
  } catch {
    return empty;
  }
}