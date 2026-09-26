export type SecurityInsight = {
  icon: string;
  color: string;
  title: string;
  body: string;
  tag: string;
};

export const securityInsights: SecurityInsight[] = [
  {
    icon: 'ri-share-forward-line',
    color: '#E11D48',
    title: 'A vulnerability is not always the biggest risk.',
    body: 'Several low-severity weaknesses can combine into one critical attack path.',
    tag: 'Attack Path Analysis',
  },
  {
    icon: 'ri-shield-user-line',
    color: '#7C3AED',
    title: 'Identity is often the shortest route into a business.',
    body: 'Weak authentication, excessive privileges and dormant accounts can create a path into systems that are otherwise well protected.',
    tag: 'Identity Security',
  },
  {
    icon: 'ri-radar-line',
    color: '#0891B2',
    title: 'Your forgotten systems still count.',
    body: 'Old subdomains, test environments and unused services can remain visible on the internet long after a project has finished.',
    tag: 'Attack Surface',
  },
  {
    icon: 'ri-cloud-line',
    color: '#2563EB',
    title: 'Cloud permissions can matter more than open ports.',
    body: 'A storage bucket, database policy or service account with excessive access can expose valuable data without a traditional network vulnerability.',
    tag: 'Cloud Security',
  },
  {
    icon: 'ri-robot-2-line',
    color: '#DB2777',
    title: 'AI creates new security boundaries.',
    body: 'An AI agent may be secure at the model level but still be dangerous if its tools, data access or permissions are too broad.',
    tag: 'AI Security',
  },
];

export const attackSurfaceNodes = [
  { label: 'Main website', icon: 'ri-global-line', status: 'Known', color: '#10B981' },
  { label: 'Customer portal', icon: 'ri-user-3-line', status: 'Known', color: '#10B981' },
  { label: 'API', icon: 'ri-plug-line', status: 'Review required', color: '#CA8A04' },
  { label: 'VPN', icon: 'ri-lock-line', status: 'Known', color: '#10B981' },
  { label: 'Mail', icon: 'ri-mail-line', status: 'Known', color: '#10B981' },
  { label: 'Cloud storage', icon: 'ri-database-2-line', status: 'Exposed', color: '#DC2626' },
  { label: 'Database', icon: 'ri-server-line', status: 'Unexpected', color: '#F97316' },
  { label: 'Old subdomain', icon: 'ri-history-line', status: 'Unexpected', color: '#F97316' },
  { label: 'Development environment', icon: 'ri-code-box-line', status: 'Exposed', color: '#DC2626' },
  { label: 'AI chatbot', icon: 'ri-robot-2-line', status: 'Review required', color: '#CA8A04' },
];

export const attackSurfaceOutputs = [
  { label: 'Asset inventory', icon: 'ri-list-check-2' },
  { label: 'Exposure map', icon: 'ri-map-2-line' },
  { label: 'Technology discovery', icon: 'ri-cpu-line' },
  { label: 'Priority investigation list', icon: 'ri-sort-desc' },
];

export const solutionExamples = [
  {
    icon: 'ri-cloud-line',
    color: '#2563EB',
    problem: 'Sensitive resource accessible more broadly than intended.',
    solution: 'Cloud Configuration Hardening',
    items: ['Restrict access', 'Review roles', 'Remove public exposure', 'Rotate affected secrets if necessary', 'Verify configuration'],
  },
  {
    icon: 'ri-mail-lock-line',
    color: '#0D9488',
    problem: 'Domain anti-spoofing configuration is incomplete.',
    solution: 'Email Security Hardening',
    items: ['Review SPF', 'Configure DKIM', 'Introduce or strengthen DMARC', 'Check sending services', 'Monitor policy alignment'],
  },
  {
    icon: 'ri-code-s-slash-line',
    color: '#E11D48',
    problem: 'Application access-control behaviour allows users to reach data or functionality outside their intended permissions.',
    solution: 'Application Security Remediation',
    items: ['Correct authorisation checks', 'Review affected routes', 'Validate API permissions', 'Test related roles', 'Retest after repair'],
  },
];

export const journeySteps = [
  { title: 'Discover', desc: 'Know what exists.', icon: 'ri-search-eye-line' },
  { title: 'Assess', desc: 'Find weaknesses.', icon: 'ri-bug-2-line' },
  { title: 'Prioritise', desc: 'Understand real risk.', icon: 'ri-sort-desc' },
  { title: 'Remediate', desc: 'Fix the important issues.', icon: 'ri-tools-line' },
  { title: 'Verify', desc: 'Prove the fixes.', icon: 'ri-check-double-line' },
  { title: 'Monitor', desc: 'Detect future change.', icon: 'ri-radar-line' },
];

export const remediationServices = [
  {
    title: 'Website & Application Security',
    icon: 'ri-code-s-slash-line',
    color: '#E11D48',
    items: ['Authentication repairs', 'Access-control repairs', 'API hardening', 'Security headers', 'Dependency remediation'],
  },
  {
    title: 'Cloud Security',
    icon: 'ri-cloud-line',
    color: '#2563EB',
    items: ['Permission hardening', 'Database policy review', 'Storage security', 'Secrets management', 'Service configuration'],
  },
  {
    title: 'Identity Security',
    icon: 'ri-shield-user-line',
    color: '#7C3AED',
    items: ['MFA rollout', 'Role review', 'Privileged access', 'Account lifecycle', 'Permission reduction'],
  },
  {
    title: 'Email Security',
    icon: 'ri-mail-send-line',
    color: '#0D9488',
    items: ['SPF', 'DKIM', 'DMARC', 'Mail configuration', 'Domain protection'],
  },
  {
    title: 'Infrastructure Security',
    icon: 'ri-server-line',
    color: '#0891B2',
    items: ['Firewall configuration', 'Network exposure reduction', 'Server hardening', 'Patch remediation', 'Backup security'],
  },
  {
    title: 'AI System Security',
    icon: 'ri-robot-2-line',
    color: '#DB2777',
    items: ['Agent permission review', 'Tool-access restrictions', 'Prompt-injection controls', 'RAG access boundaries', 'Secret protection'],
  },
];

export const beforeItems = [
  'Unknown assets',
  'Public services',
  'Weak identity controls',
  'Excess permissions',
  'Unprioritised vulnerabilities',
  'No continuous visibility',
];

export const afterItems = [
  'Known attack surface',
  'Reduced exposure',
  'Stronger identity controls',
  'Least-privilege access',
  'Prioritised remediation',
  'Continuous monitoring option',
];

export const monitoringExamples = [
  { label: 'New subdomain detected', icon: 'ri-global-line' },
  { label: 'New exposed service', icon: 'ri-plug-line' },
  { label: 'DNS change', icon: 'ri-exchange-line' },
  { label: 'TLS change', icon: 'ri-lock-line' },
  { label: 'Newly relevant vulnerability', icon: 'ri-bug-2-line' },
  { label: 'Cloud configuration change', icon: 'ri-cloud-line' },
  { label: 'Credential exposure signal', icon: 'ri-key-2-line' },
  { label: 'Security control regression', icon: 'ri-arrow-go-back-line' },
];

export const riskFindings = [
  { name: 'Missing security header', likelihood: 4, impact: 1, icon: 'ri-shield-line' },
  { name: 'Incomplete DMARC', likelihood: 3, impact: 2, icon: 'ri-mail-line' },
  { name: 'Administrator without MFA', likelihood: 3, impact: 4, icon: 'ri-shield-user-line' },
  { name: 'Public customer database', likelihood: 5, impact: 5, icon: 'ri-database-2-line' },
];

export const attackPathNodes = [
  { label: 'Leaked credentials', color: '#CA8A04' },
  { label: 'No MFA', color: '#F97316' },
  { label: 'Privileged account', color: '#EA580C' },
  { label: 'Cloud console', color: '#DC2626' },
  { label: 'Customer database', color: '#B91C1C' },
];

export type SecurityIntelligenceType = 'intelligence' | 'lab' | 'fix' | 'ai';

export type SecurityIntelligenceItem = {
  type: SecurityIntelligenceType;
  label: string;
  icon: string;
  accent: string;
  edition: string;
  title: string;
  summary: string;
  whyItMatters?: string;
  scenario?: string;
  flow?: string[];
  outcome?: string;
  problem?: string;
  controls?: string[];
  checks?: string[];
  solutionLabel: string;
  solution: string;
  tags: string[];
  ctaLabel: string;
  ctaRoute: string;
  illustrative?: boolean;
};

export const securityIntelligence: SecurityIntelligenceItem[] = [
  {
    type: 'intelligence',
    label: 'Security Intelligence',
    icon: 'ri-radar-line',
    accent: '#E11D48',
    edition: 'September 2026',
    title: 'Forgotten internet-facing systems increase attack surface',
    summary:
      'Old test environments, subdomains and remote-access services can remain exposed long after teams stop actively using them.',
    whyItMatters:
      'Unmanaged assets may not receive the same patching, monitoring or access-control attention as production systems.',
    solutionLabel: 'DFP response',
    solution: 'Attack Surface Discovery can help identify externally visible assets within an authorised scope.',
    tags: ['Attack Surface', 'Asset Discovery'],
    ctaLabel: 'Assess My Attack Surface',
    ctaRoute: '/contact?need=security&need_label=Attack%20Surface%20Assessment',
  },
  {
    type: 'lab',
    label: 'DFP Security Lab',
    icon: 'ri-node-tree',
    accent: '#F97316',
    edition: 'September 2026',
    title: 'Three small weaknesses. One serious path.',
    summary:
      'A fictional test environment contained three individually moderate issues: an old employee account, missing MFA and excessive cloud permissions.',
    flow: ['Dormant account', 'No MFA', 'Excess cloud permissions', 'Sensitive data access'],
    outcome:
      'Correlation changes the priority from three isolated findings to one significant attack path.',
    solutionLabel: 'DFP response',
    solution: 'Risk Correlation considers how validated findings may connect, so remediation focuses on the path that matters.',
    tags: ['Attack Path', 'Correlation'],
    ctaLabel: 'Talk About Attack Paths',
    ctaRoute: '/contact?need=security&need_label=Attack%20Path%20Analysis',
    illustrative: true,
  },
  {
    type: 'fix',
    label: 'Security Fix',
    icon: 'ri-tools-line',
    accent: '#0D9488',
    edition: 'September 2026',
    title: 'Protect administrator accounts with MFA',
    summary:
      'Administrator credentials provide access to high-value systems. Password-only authentication leaves those accounts dependent on a single security factor.',
    problem: 'Password-only authentication leaves privileged accounts dependent on a single security factor.',
    controls: [
      'Enforce MFA',
      'Separate privileged and everyday accounts',
      'Review administrator membership',
      'Remove dormant privileged accounts',
      'Monitor privileged sign-ins',
    ],
    solutionLabel: 'DFP service',
    solution: 'Identity Security Review',
    tags: ['Identity', 'Access Control'],
    ctaLabel: 'Discuss Identity Security',
    ctaRoute: '/contact?need=security&need_label=Identity%20Security%20Review',
  },
  {
    type: 'ai',
    label: 'AI Security Note',
    icon: 'ri-robot-2-line',
    accent: '#7C3AED',
    edition: 'September 2026',
    title: 'An AI agent is only as safe as the tools it can reach.',
    summary:
      'A model may have strong prompt safeguards while the surrounding agent still has excessive permissions to databases, APIs, files or third-party services.',
    checks: [
      'What tools can the agent call?',
      'What data can those tools access?',
      'Are actions scoped per user?',
      'Are destructive actions gated?',
      'Are secrets exposed to prompts or tools?',
    ],
    solutionLabel: 'DFP response',
    solution: 'AI / LLM Security Assessment',
    tags: ['AI Security', 'Agent Permissions'],
    ctaLabel: 'Assess an AI System',
    ctaRoute: '/contact?need=security&need_label=AI%20System%20Assessment',
  },
];