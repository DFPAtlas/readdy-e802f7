import { supabase } from './supabase';

export type SubmitResult =
  | { code: 'OK'; submissionId: string; recordId?: string }
  | { code: 'ERROR'; message: string };

export type SubmissionTable =
  | 'leads'
  | 'digital_footprint_support'
  | 'partner_applications'
  | 'career_applications'
  | 'project_submissions'
  | 'uat_tester_applications';

const RPC_MAP: Partial<Record<SubmissionTable, string>> = {
  leads: 'submit_lead',
  partner_applications: 'submit_partner_application',
  career_applications: 'submit_career_application',
  project_submissions: 'submit_project_submission',
};

const ERROR_MESSAGES: Record<string, string> = {
  invalid_name: 'Please enter a valid name.',
  invalid_email: 'Please enter a valid email address.',
  invalid_applicant_name: 'Please enter a valid contact name.',
  invalid_company_name: 'Please enter a valid company name.',
  message_too_long: 'Your message is too long. Please shorten it.',
  cover_note_too_long: 'Your cover note must be 500 characters or fewer.',
};

function friendlyMessage(raw: string): string {
  const key = Object.keys(ERROR_MESSAGES).find((k) => raw.includes(k));
  if (key) return ERROR_MESSAGES[key];
  if (raw.toLowerCase().includes('permission denied')) {
    return 'We could not submit your form right now. Please try again or contact us directly.';
  }
  return raw || 'Unable to submit. Please try again.';
}

export function makeSubmissionReference(prefix = 'dfp'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function makeIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `sub_${crypto.randomUUID()}`;
  }
  return `sub_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
}

export function notifyLeadSubmission(sourceTable: SubmissionTable, sourceId: string): void {
  if (!supabase) return;
  void supabase.functions
    .invoke('send-lead-notification', {
      body: { source_table: sourceTable, source_id: sourceId },
    })
    .catch(() => {});
}

export async function submitEnquiry(
  table: SubmissionTable,
  payload: Record<string, unknown>,
  notify = false,
): Promise<SubmitResult> {
  const submissionId = makeSubmissionReference();
  if (!supabase) {
    return { code: 'ERROR', message: 'Submission service is not configured. Please try again later.' };
  }

  try {
    const rpcName = RPC_MAP[table];

    if (rpcName) {
      const { data, error } = await supabase.rpc(rpcName as never, { p_payload: payload });
      if (error) {
        if (error.code === '23505') {
          return { code: 'OK', submissionId };
        }
        return { code: 'ERROR', message: friendlyMessage(error.message || '') };
      }
      const recordId = (data as string | null) ?? undefined;
      if (notify && recordId) {
        notifyLeadSubmission(table, recordId);
      }
      return { code: 'OK', submissionId, recordId };
    }

    const { error } = await supabase.from(table).insert(payload as never);
    if (error) {
      if (error.code === '23505') {
        return { code: 'OK', submissionId };
      }
      return { code: 'ERROR', message: friendlyMessage(error.message || '') };
    }
    return { code: 'OK', submissionId };
  } catch {
    return { code: 'ERROR', message: 'Network error. Please check your connection and try again.' };
  }
}