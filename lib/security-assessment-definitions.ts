export const SECURITY_AGENT_OPTIONS = [
  { key: 'recon', label: 'Recon Agent', defaultExecutor: 'hal' },
  { key: 'web_security', label: 'Web Security Agent', defaultExecutor: 'hal' },
  { key: 'cloud_security', label: 'Cloud Security Agent', defaultExecutor: 'cloud' },
  { key: 'identity', label: 'Identity Agent', defaultExecutor: 'hal' },
  { key: 'email_security', label: 'Email Security Agent', defaultExecutor: 'hal' },
  { key: 'vulnerability_intelligence', label: 'Vulnerability Intelligence Agent', defaultExecutor: 'tron' },
  { key: 'ai_llm_security', label: 'AI / LLM Security Agent', defaultExecutor: 'tron' },
  { key: 'evidence', label: 'Evidence Agent', defaultExecutor: 'hal' },
  { key: 'risk_correlation', label: 'Risk Correlation Agent', defaultExecutor: 'tron' },
  { key: 'remediation', label: 'Remediation Agent', defaultExecutor: 'tron' },
  { key: 'report', label: 'Report Agent', defaultExecutor: 'tron' },
] as const;

export const SECURITY_RISK_CLASSES = [
  { key: 'passive', label: 'Passive', approval: 'scope', description: 'Low-risk discovery and posture review.' },
  { key: 'authenticated_review', label: 'Authenticated review', approval: 'active_testing', description: 'Uses customer-provided test access without intrusive techniques.' },
  { key: 'active_test', label: 'Active test', approval: 'active_testing', description: 'Controlled active testing inside the written scope.' },
  { key: 'elevated_test', label: 'Elevated test', approval: 'elevated_testing', description: 'Higher-risk techniques requiring an explicit additional gate.' },
  { key: 'retest', label: 'Retest', approval: 'retest', description: 'Verification of agreed remediation.' },
] as const;

export const SAFE_DEFAULT_TEST_CATEGORIES = [
  'dns',
  'tls',
  'email_posture',
  'public_asset_discovery',
  'technology_fingerprinting',
  'known_vulnerability_correlation',
] as const;

export type SecurityRiskClass = typeof SECURITY_RISK_CLASSES[number]['key'];
export type SecurityAgentKey = typeof SECURITY_AGENT_OPTIONS[number]['key'];

export interface SecurityEngagementSummary {
  id: string;
  reference: string;
  customer_name: string;
  status: string;
  service_tier: string;
  emergency_stop: boolean;
  testing_window_start: string | null;
  testing_window_end: string | null;
  created_at: string;
}

export interface SecurityJobSummary {
  id: string;
  engagement_id: string;
  requested_target: string;
  agent_key: SecurityAgentKey;
  test_category: string;
  risk_class: SecurityRiskClass;
  status: string;
  executor: string | null;
  queued_at: string;
}

export const SECURITY_PLATFORM_GUARDRAILS = [
  'Written customer authorisation must be recorded before a job can be queued.',
  'Every job must reference an included scope asset.',
  'Explicit exclusions override inclusions.',
  'Testing must occur inside the approved time window.',
  'The requested test category must be allowed on the engagement.',
  'Active, elevated and retest work require the matching approval gate.',
  'Emergency stop prevents new jobs and blocks or cancels queued work.',
  'Material findings remain subject to human validation before customer reporting.',
] as const;
