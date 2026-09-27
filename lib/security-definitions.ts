export type SecurityServiceType = 'ai_security_scan' | 'ai_security_assessment' | 'security_watch';
export type SecurityEngagementStatus =
  | 'draft' | 'pending_authorisation' | 'authorised' | 'discovery' | 'assessment'
  | 'validation' | 'reporting' | 'remediation' | 'retest' | 'monitoring'
  | 'paused' | 'stopped' | 'closed';

export type SecurityRiskLevel = 'passive' | 'active' | 'elevated';
export type SecurityApprovalGate = 'scope' | 'active_testing' | 'elevated_testing' | 'critical_finding' | 'retest';

export const SECURITY_AGENTS = [
  'security-master',
  'recon',
  'web-security',
  'cloud-security',
  'identity',
  'email-security',
  'vulnerability-intelligence',
  'ai-llm-security',
  'evidence',
  'risk-correlation',
  'remediation',
  'report',
] as const;

export type SecurityAgentKey = (typeof SECURITY_AGENTS)[number];

export const SAFE_DEFAULT_AGENT_RISK: Record<SecurityAgentKey, SecurityRiskLevel> = {
  'security-master': 'passive',
  recon: 'passive',
  'web-security': 'active',
  'cloud-security': 'active',
  identity: 'active',
  'email-security': 'passive',
  'vulnerability-intelligence': 'passive',
  'ai-llm-security': 'active',
  evidence: 'passive',
  'risk-correlation': 'passive',
  remediation: 'passive',
  report: 'passive',
};

export function requiredApprovalGate(risk: SecurityRiskLevel): SecurityApprovalGate | null {
  if (risk === 'elevated') return 'elevated_testing';
  if (risk === 'active') return 'active_testing';
  return 'scope';
}

export function isExecutionStatus(status: SecurityEngagementStatus): boolean {
  return ['authorised','discovery','assessment','validation','reporting','remediation','retest','monitoring'].includes(status);
}

export type ScopeDecisionInput = {
  writtenAuthorisationAt: string | null;
  emergencyStop: boolean;
  engagementStatus: SecurityEngagementStatus;
  testingStartsAt?: string | null;
  testingEndsAt?: string | null;
  assetPermission?: 'permitted' | 'prohibited' | null;
  approvalGranted: boolean;
};

export function canDispatchSecurityJob(input: ScopeDecisionInput, now = new Date()): boolean {
  if (!input.writtenAuthorisationAt || input.emergencyStop) return false;
  if (!isExecutionStatus(input.engagementStatus)) return false;
  if (input.assetPermission === 'prohibited') return false;
  if (!input.approvalGranted) return false;
  if (input.testingStartsAt && now < new Date(input.testingStartsAt)) return false;
  if (input.testingEndsAt && now > new Date(input.testingEndsAt)) return false;
  return true;
}
