export const VALID_TESTING_ASSIGNMENT_STATUSES = [
  'reserved', 'offered', 'accepted', 'active', 'in_progress', 'assigned', 'testing',
];

export const SUBMITTED_ASSIGNMENT_STATUSES = [
  'submitted', 'review_required', 'retest_required', 'completed', 'complete', 'approved',
];

export const BLOCKED_ASSIGNMENT_STATUSES = [
  'cancelled', 'expired', 'rejected', 'declined', 'no_show',
];

export const COMPLETED_CASE_STATUSES = ['passed', 'failed', 'blocked', 'skipped'];

export interface EvidenceRules {
  notesOnFail: boolean;
  screenshotOnFail: boolean;
  videoOnFail: boolean;
  deviceInfo: boolean;
  browserInfo: boolean;
  raw: string[];
}

export function normalizeEvidenceTags(...sources: (string[] | string | null | undefined)[]): string[] {
  const tags = new Set<string>();
  for (const src of sources) {
    if (!src) continue;
    const list = Array.isArray(src) ? src : String(src).split(/[,\n;]/);
    for (const raw of list) {
      const t = String(raw).trim().toLowerCase().replace(/\s+/g, '_');
      if (t) tags.add(t);
    }
  }
  return Array.from(tags);
}

export function parseEvidenceRules(tags: string[]): EvidenceRules {
  const has = (keys: string[]) => tags.some((t) => keys.includes(t));
  return {
    notesOnFail: has(['notes_on_fail', 'notes', 'notes_required', 'notes_required_on_fail']),
    screenshotOnFail: has(['screenshot_on_fail', 'screenshot', 'screenshot_required', 'screenshot_required_on_fail', 'evidence_on_fail']),
    videoOnFail: has(['video_on_fail', 'video', 'video_required', 'screen_recording', 'screen_recording_on_fail']),
    deviceInfo: has(['device_information', 'device_info', 'device', 'device_required']),
    browserInfo: has(['browser_information', 'browser_info', 'browser', 'browser_required']),
    raw: tags,
  };
}

export interface RunnerStep {
  step_number: number;
  instruction: string;
  expected_result: string | null;
}

export interface RunnerCase {
  id: string;
  test_case_id: string;
  reference: string;
  title: string;
  description: string | null;
  preconditions: string | null;
  expected_result: string;
  priority: string;
  is_required: boolean;
  status: string;
  steps: RunnerStep[];
  actual_result: string | null;
  notes: string | null;
  blocker_reason: string | null;
  editable?: boolean;
}

export interface SubmissionValidation {
  valid: boolean;
  missing: string[];
}

export function validateSubmission(
  cases: RunnerCase[],
  rules: EvidenceRules,
  evidenceCountByCase: Record<string, number>,
  hasBrowserInfo: boolean,
  hasDeviceInfo: boolean,
): SubmissionValidation {
  const missing: string[] = [];

  const incomplete = cases.filter((c) => !COMPLETED_CASE_STATUSES.includes(c.status));
  if (incomplete.length > 0) {
    missing.push(
      `${incomplete.length} case${incomplete.length === 1 ? '' : 's'} not completed: ${incomplete
        .map((c) => c.reference)
        .join(', ')}`,
    );
  }

  for (const c of cases) {
    if (c.status === 'failed') {
      if (!c.actual_result || !c.actual_result.trim()) {
        missing.push(`${c.reference}: an actual result is required for a failed case.`);
      }
      if (rules.notesOnFail && (!c.notes || !c.notes.trim())) {
        missing.push(`${c.reference}: notes are required when a case fails.`);
      }
      if ((rules.screenshotOnFail || rules.videoOnFail) && (evidenceCountByCase[c.id] || 0) === 0) {
        missing.push(`${c.reference}: evidence is required when a case fails.`);
      }
    }
    if (c.status === 'blocked') {
      if (!c.blocker_reason || !c.blocker_reason.trim()) {
        missing.push(`${c.reference}: a blocker reason is required for a blocked case.`);
      }
      if ((rules.screenshotOnFail || rules.videoOnFail) && (evidenceCountByCase[c.id] || 0) === 0) {
        missing.push(`${c.reference}: evidence is required for a blocked case.`);
      }
    }
  }

  if (rules.browserInfo && !hasBrowserInfo) {
    missing.push('Browser information has not been captured.');
  }
  if (rules.deviceInfo && !hasDeviceInfo) {
    missing.push('Device information has not been captured.');
  }

  return { valid: missing.length === 0, missing };
}

export interface BrowserMetadata {
  browserName: string | null;
  browserVersion: string | null;
  os: string | null;
  viewportWidth: number | null;
  viewportHeight: number | null;
  userAgent: string | null;
}

export function detectBrowserMetadata(): BrowserMetadata {
  if (typeof window === 'undefined') {
    return {
      browserName: null, browserVersion: null, os: null,
      viewportWidth: null, viewportHeight: null, userAgent: null,
    };
  }
  const ua = navigator.userAgent;
  let browserName: string | null = null;
  let browserVersion: string | null = null;
  let os: string | null = null;

  if (ua.includes('Firefox/')) { browserName = 'Firefox'; browserVersion = ua.split('Firefox/')[1]?.split(' ')[0] || null; }
  else if (ua.includes('Edg/')) { browserName = 'Edge'; browserVersion = ua.split('Edg/')[1]?.split(' ')[0] || null; }
  else if (ua.includes('Chrome/')) { browserName = 'Chrome'; browserVersion = ua.split('Chrome/')[1]?.split(' ')[0] || null; }
  else if (ua.includes('Safari/') && !ua.includes('Chrome')) { browserName = 'Safari'; browserVersion = ua.split('Version/')[1]?.split(' ')[0] || null; }

  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac OS')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  return {
    browserName, browserVersion, os,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    userAgent: ua,
  };
}