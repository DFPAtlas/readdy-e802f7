export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

export interface ReportFinding {
  id: string;
  title: string;
  severity: Severity;
  asset: string;
  status: string;
}

export const reportTabs = [
  { id: 'summary', label: 'Executive Summary', icon: 'ri-dashboard-line' },
  { id: 'findings', label: 'Findings', icon: 'ri-list-check-2' },
  { id: 'paths', label: 'Attack Paths', icon: 'ri-node-tree' },
  { id: 'remediation', label: 'Remediation', icon: 'ri-tools-line' },
  { id: 'retest', label: 'Retest', icon: 'ri-refresh-line' },
];

export const summaryMetrics = [
  { label: 'Critical findings', value: '1', tone: 'critical' },
  { label: 'High findings', value: '2', tone: 'high' },
  { label: 'Medium findings', value: '5', tone: 'medium' },
  { label: 'Low findings', value: '6', tone: 'low' },
  { label: 'Assets reviewed', value: '42', tone: 'neutral' },
  { label: 'Attack paths identified', value: '3', tone: 'neutral' },
];

export const keyObservations = [
  {
    title: 'External Exposure',
    risk: 'High' as Severity,
    desc: 'Several externally visible services require configuration review.',
    action: 'Review exposed services and restrict access where not required.',
    icon: 'ri-global-line',
  },
  {
    title: 'Identity Controls',
    risk: 'High' as Severity,
    desc: 'Privileged access and MFA enforcement should be strengthened.',
    action: 'Enforce MFA and reduce standing administrator access.',
    icon: 'ri-shield-user-line',
  },
  {
    title: 'Cloud Access',
    risk: 'Medium' as Severity,
    desc: 'Permissions should be reviewed to reduce unnecessary administrative access.',
    action: 'Review roles and apply least-privilege to cloud resources.',
    icon: 'ri-cloud-line',
  },
];

export const findings: ReportFinding[] = [
  { id: 'DFP-001', title: 'Publicly accessible customer database', severity: 'Critical', asset: 'db.example-company.test', status: 'Open' },
  { id: 'DFP-002', title: 'Administrator account without MFA', severity: 'High', asset: 'Identity', status: 'Open' },
  { id: 'DFP-003', title: 'Unauthenticated API data exposure', severity: 'High', asset: 'api.example-company.test', status: 'Open' },
  { id: 'DFP-004', title: 'Incomplete DMARC enforcement', severity: 'Medium', asset: 'Email domain', status: 'Open' },
];

export const findingDetail = {
  id: 'DFP-002',
  title: 'Administrator account without MFA',
  severity: 'High' as Severity,
  description: 'A privileged account was identified without an enforced second authentication factor.',
  evidence: ['Privileged account detected', 'MFA policy: not enforced'],
  impact: 'If the credentials were compromised, an attacker could potentially gain elevated access to business systems.',
  remediation: [
    'Enforce MFA for privileged accounts',
    'Review administrator membership',
    'Separate administrative and daily-use accounts',
    'Remove unnecessary privileges',
    'Review authentication logs',
    'Retest after implementation',
  ],
  status: 'Open',
};

export const attackPaths = [
  {
    id: 'AP-01',
    title: 'Potential customer-data exposure',
    severity: 'Critical' as Severity,
    nodes: ['Exposed credentials', 'No MFA', 'Privileged cloud access', 'Production database'],
    linked: '4 linked findings',
    impact: 'Potential unauthorised access to customer information.',
    priority: 'Immediate',
  },
  {
    id: 'AP-02',
    title: 'Legacy service path',
    severity: 'High' as Severity,
    nodes: ['Legacy subdomain', 'Outdated service', 'Internal application access'],
    linked: '3 linked findings',
    impact: 'Potential access to an internal application through an unmaintained service.',
    priority: 'High',
  },
];

export const remediationPlan = [
  {
    group: 'Immediate',
    tone: 'critical',
    items: [
      { task: 'Restrict public database access', owner: 'Cloud', effort: 'Low' },
      { task: 'Protect privileged accounts with MFA', owner: 'IT', effort: 'Low' },
    ],
  },
  {
    group: '7 days',
    tone: 'high',
    items: [
      { task: 'Correct API authorisation controls', owner: 'Development', effort: 'Medium' },
      { task: 'Review cloud administrative permissions', owner: 'Cloud', effort: 'Medium' },
    ],
  },
  {
    group: '30 days',
    tone: 'medium',
    items: [
      { task: 'Strengthen email authentication policy', owner: 'IT', effort: 'Low' },
      { task: 'Remove unused external services', owner: 'Management', effort: 'Low' },
      { task: 'Review dormant accounts', owner: 'IT', effort: 'Medium' },
    ],
  },
];

export const retestRows = [
  { finding: 'Public database', initial: 'Critical' as Severity, retest: 'Resolved', tone: 'resolved' },
  { finding: 'Admin without MFA', initial: 'High' as Severity, retest: 'Resolved', tone: 'resolved' },
  { finding: 'API access control', initial: 'High' as Severity, retest: 'Partially resolved', tone: 'partial' },
  { finding: 'DMARC policy', initial: 'Medium' as Severity, retest: 'Open', tone: 'open' },
];

export const audienceSplit = {
  technical: ['Evidence', 'Affected assets', 'Reproduction context', 'Recommended controls', 'Retest results'],
  decision: ['Business impact', 'Priority', 'Risk themes', 'Remediation progress', 'Areas requiring investment'],
};

export const lifecycle = ['Assessment', 'Human validation', 'Report', 'Remediation', 'Retest', 'Updated status'];