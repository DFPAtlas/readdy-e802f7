export interface MarketplaceJob {
  id: string;
  project_id: string;
  title: string;
  public_summary: string | null;
  required_devices: string[] | null;
  required_browsers: string[] | null;
  required_experience_level: string | null;
  experience_requirement: string | null;
  reward_amount_minor: number;
  currency: string;
  estimated_minutes_min: number | null;
  estimated_minutes_max: number | null;
  max_testers: number;
  tester_slots_filled: number;
  application_opens_at: string | null;
  application_closes_at: string | null;
  marketplace_status: string;
  visibility: string;
  published_at: string | null;
  project_name: string | null;
  remaining_places: number;
  reward_label: string;
  duration_label: string;
  places_label: string;
  closing_label: string | null;
}

export interface TesterMatch {
  missingDevices: string[];
  missingBrowsers: string[];
  experienceOk: boolean;
  matched: boolean;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  GBP: '£',
  USD: '$',
  EUR: '€',
};

const EXPERIENCE_RANK: Record<string, number> = {
  beginner: 0,
  intermediate: 1,
  senior: 2,
  expert: 3,
};

export function currencySymbol(currency: string): string {
  return CURRENCY_SYMBOLS[currency] || `${currency} `;
}

export function formatReward(minor: number | null | undefined, currency: string): string {
  const symbol = currencySymbol(currency);
  const amount = (minor ?? 0) / 100;
  return `${symbol}${amount.toFixed(2)}`;
}

export function formatMinutes(total: number): string {
  if (total < 60) return `${total}m`;
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
}

export function formatDuration(min?: number | null, max?: number | null): string {
  if (!min && !max) return 'Not specified';
  if (min && max && min !== max) return `${formatMinutes(min)} – ${formatMinutes(max)}`;
  return `~${formatMinutes(min || max || 0)}`;
}

export function remainingPlaces(job: { max_testers?: number; tester_slots_filled?: number }): number {
  return Math.max(0, (job.max_testers ?? 0) - (job.tester_slots_filled ?? 0));
}

export function placesLabel(job: { max_testers?: number; tester_slots_filled?: number }): string {
  const n = remainingPlaces(job);
  if (n <= 0) return 'Full';
  if (n === 1) return 'Last place';
  return `${n} places remaining`;
}

export function isMarketplaceVisible(job: {
  application_opens_at?: string | null;
  application_closes_at?: string | null;
  max_testers?: number;
  tester_slots_filled?: number;
}): boolean {
  const now = Date.now();
  if (job.application_opens_at && new Date(job.application_opens_at).getTime() > now) return false;
  if (job.application_closes_at && new Date(job.application_closes_at).getTime() <= now) return false;
  if (remainingPlaces(job) <= 0) return false;
  return true;
}

export function isMarketplaceAvailable(job: {
  marketplace_status?: string;
  visibility?: string;
  application_opens_at?: string | null;
  application_closes_at?: string | null;
  max_testers?: number;
  tester_slots_filled?: number;
}): boolean {
  if (job.marketplace_status !== 'published') return false;
  if (job.visibility !== 'marketplace') return false;
  return isMarketplaceVisible(job);
}

export function closingLabel(closesAt: string | null): string | null {
  if (!closesAt) return null;
  return new Date(closesAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function experienceRank(level: string | null | undefined): number {
  return EXPERIENCE_RANK[level || ''] ?? 0;
}

export function experienceLabel(level: string | null | undefined): string {
  if (!level) return 'Any level';
  return level.charAt(0).toUpperCase() + level.slice(1);
}

export function enrichMarketplaceJob(job: any, projectName: string | null): MarketplaceJob {
  return {
    ...job,
    project_name: projectName,
    remaining_places: remainingPlaces(job),
    reward_label: formatReward(job.reward_amount_minor, job.currency),
    duration_label: formatDuration(job.estimated_minutes_min, job.estimated_minutes_max),
    places_label: placesLabel(job),
    closing_label: closingLabel(job.application_closes_at),
  };
}

export function computeTesterMatch(
  job: {
    required_devices?: string[] | null;
    required_browsers?: string[] | null;
    required_experience_level?: string | null;
  },
  testerDevices: { category: string; browser: string | null }[],
  testerExperienceLevel: string | null | undefined,
): TesterMatch {
  const categories = new Set(testerDevices.map((d) => d.category));
  const browsers = new Set(testerDevices.map((d) => d.browser).filter(Boolean) as string[]);
  const missingDevices = (job.required_devices || []).filter((d) => d && !categories.has(d));
  const missingBrowsers = (job.required_browsers || []).filter((b) => b && !browsers.has(b));
  const experienceOk = experienceRank(testerExperienceLevel) >= experienceRank(job.required_experience_level);
  const matched = missingDevices.length === 0 && missingBrowsers.length === 0 && experienceOk;
  return { missingDevices, missingBrowsers, experienceOk, matched };
}

export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}