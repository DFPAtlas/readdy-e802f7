type DiagramLayer = {
  id: string;
  title: string;
  desc: string;
  boundary: string;
  icon: string;
  tags: string[];
};

export const diagramLayers: DiagramLayer[] = [
  {
    id: 'customer',
    title: 'Customer',
    desc: 'Enquiry, scope questionnaire and written authorisation.',
    boundary: 'Customer boundary',
    icon: 'ri-user-3-line',
    tags: [],
  },
  {
    id: 'command',
    title: 'DFP Command',
    desc: 'Control plane and source of truth for engagement state.',
    boundary: 'DFP control plane',
    icon: 'ri-command-line',
    tags: [],
  },
  {
    id: 'scope',
    title: 'Scope & Approval Engine',
    desc: 'Validates requested targets against the approved scope before anything runs.',
    boundary: 'DFP control plane',
    icon: 'ri-focus-3-line',
    tags: [],
  },
  {
    id: 'orchestrator',
    title: 'n8n Security Orchestrator',
    desc: 'Coordinates approved jobs. Receives scope from DFP Command and does not decide what may be tested.',
    boundary: 'DFP control plane',
    icon: 'ri-flow-chart',
    tags: [],
  },
  {
    id: 'execution',
    title: 'Execution Layer',
    desc: 'Approved agents operate strictly inside the assessment scope.',
    boundary: 'Agent execution',
    icon: 'ri-cpu-line',
    tags: ['Cloud Security Agents', 'HAL', 'TRON'],
  },
  {
    id: 'evidence',
    title: 'Evidence Store',
    desc: 'Timestamped, source-tagged artefacts with validation and remediation state.',
    boundary: 'Evidence storage',
    icon: 'ri-database-2-line',
    tags: [],
  },
  {
    id: 'validation',
    title: 'Validation & Correlation',
    desc: 'Human review confirms material findings and groups them into attack paths.',
    boundary: 'DFP control plane',
    icon: 'ri-user-search-line',
    tags: [],
  },
  {
    id: 'outputs',
    title: 'Report · Remediation · Retest · Security Watch',
    desc: 'Customer reporting and post-assessment delivery.',
    boundary: 'Customer reporting',
    icon: 'ri-file-chart-line',
    tags: [],
  },
];

export const commandResponsibilities = [
  'Engagement records',
  'Scope definition',
  'Authorisation state',
  'Agent assignment',
  'Approvals',
  'Findings',
  'Remediation',
  'Retest status',
  'Customer reporting',
];

export const orchestratorResponsibilities = [
  'Receive approved assessment jobs',
  'Assign approved work to agents',
  'Collect results',
  'Trigger evidence processing',
  'Require approvals before higher-risk stages',
  'Update DFP Command',
  'Trigger report workflows',
];

export const orchestratorNote =
  'n8n does not independently decide which systems may be tested. It receives scope from DFP Command.';

export const executionEnvironments = [
  {
    name: 'Cloud Security Agents',
    icon: 'ri-global-line',
    uses: [
      'Public attack-surface discovery',
      'DNS analysis',
      'TLS review',
      'Public vulnerability intelligence',
      'External metadata analysis',
    ],
    note: 'No internal customer network access by default.',
  },
  {
    name: 'HAL',
    icon: 'ri-cpu-line',
    uses: [
      'Orchestration support',
      'Lightweight analysis',
      'Evidence processing',
      'Local tool execution where specifically approved',
      'n8n integration',
      'Report enrichment',
    ],
    note: '',
  },
  {
    name: 'TRON',
    icon: 'ri-server-line',
    uses: [
      'Heavier analysis',
      'RAG',
      'Correlation',
      'Local LLM tasks',
      'Evidence summarisation',
      'Attack-path reasoning',
      'Larger model workloads',
    ],
    note: 'Analysis and correlation only — TRON does not autonomously attack targets unless explicitly approved otherwise.',
  },
];

export const logicalAgents = [
  { name: 'Security Master Agent', role: 'Coordinates specialist agents and enforces scope', icon: 'ri-command-line', master: true },
  { name: 'Recon Agent', role: 'Attack-surface discovery', icon: 'ri-radar-line', master: false },
  { name: 'Web Security Agent', role: 'Web application review', icon: 'ri-global-line', master: false },
  { name: 'Cloud Security Agent', role: 'Cloud configuration review', icon: 'ri-cloud-line', master: false },
  { name: 'Identity Agent', role: 'Identity and access review', icon: 'ri-fingerprint-line', master: false },
  { name: 'Email Security Agent', role: 'Email authentication review', icon: 'ri-mail-lock-line', master: false },
  { name: 'Vulnerability Intelligence Agent', role: 'Public vulnerability intelligence', icon: 'ri-bug-2-line', master: false },
  { name: 'AI / LLM Security Agent', role: 'AI and LLM boundary testing', icon: 'ri-sparkling-line', master: false },
  { name: 'Evidence Agent', role: 'Evidence capture and preservation', icon: 'ri-file-search-line', master: false },
  { name: 'Risk Correlation Agent', role: 'Groups findings into attack paths', icon: 'ri-node-tree', master: false },
  { name: 'Remediation Agent', role: 'Suggested controls and sequencing', icon: 'ri-tools-line', master: false },
  { name: 'Report Agent', role: 'Technical and executive output', icon: 'ri-file-chart-line', master: false },
];

export const scopeTokenFields = [
  { label: 'Engagement ID', icon: 'ri-hashtag' },
  { label: 'Customer ID', icon: 'ri-user-3-line' },
  { label: 'Permitted assets', icon: 'ri-checkbox-circle-line' },
  { label: 'Prohibited assets', icon: 'ri-close-circle-line' },
  { label: 'Allowed test categories', icon: 'ri-list-check' },
  { label: 'Testing window', icon: 'ri-calendar-check-line' },
  { label: 'Rate limits', icon: 'ri-speed-up-line' },
  { label: 'Approval level', icon: 'ri-shield-keyhole-line' },
  { label: 'Emergency stop state', icon: 'ri-stop-circle-line' },
];

export const approvalGates = [
  { id: 'Gate 1', title: 'Scope Approved', desc: 'Required before assessment starts.', owner: 'Customer + DFP' },
  { id: 'Gate 2', title: 'Active Testing Approved', desc: 'Required before any intrusive testing.', owner: 'DFP Assessment Lead' },
  { id: 'Gate 3', title: 'Elevated Test Approved', desc: 'Required for higher-risk techniques.', owner: 'DFP Assessment Lead' },
  { id: 'Gate 4', title: 'Critical Finding Confirmed', desc: 'Human validation before customer escalation.', owner: 'DFP Validator' },
  { id: 'Gate 5', title: 'Remediation Retest Approved', desc: 'Required before retesting production systems.', owner: 'Customer + DFP' },
];

export const lifecycle = [
  { title: 'Enquiry', desc: 'Customer submits the scope questionnaire.' },
  { title: 'Scope Draft', desc: 'DFP creates a candidate scope.' },
  { title: 'Written Authorisation', desc: 'Customer approves assets and boundaries.' },
  { title: 'Discovery', desc: 'Low-risk reconnaissance begins.' },
  { title: 'Assessment', desc: 'Approved specialist agents run.' },
  { title: 'Evidence Collection', desc: 'Results stored with timestamps and source metadata.' },
  { title: 'Human Validation', desc: 'DFP validates material findings.' },
  { title: 'Risk Correlation', desc: 'Findings are grouped into attack paths.' },
  { title: 'Report', desc: 'Technical and executive outputs generated.' },
  { title: 'Remediation', desc: 'Customer or DFP repairs issues.' },
  { title: 'Retest', desc: 'Approved fixes are verified.' },
  { title: 'Security Watch', desc: 'Optional ongoing monitoring begins.' },
];

export const evidenceFields = [
  'Engagement ID',
  'Finding ID',
  'Source agent',
  'Affected asset',
  'Timestamp',
  'Evidence type',
  'Evidence location',
  'Severity',
  'Confidence',
  'Validator',
  'Validation state',
  'Remediation state',
  'Retest state',
];

export const findingStates = [
  'Discovered',
  'Needs Validation',
  'Validated',
  'Reported',
  'Remediation In Progress',
  'Ready for Retest',
  'Resolved',
];

export const findingAltStates = ['Accepted Risk', 'False Positive'];

export const aiMayDo = ['Discover', 'Classify', 'Correlate', 'Summarise', 'Suggest remediation'];

export const humanApprovalRequired = [
  'Scope approval',
  'Higher-risk test execution',
  'Critical finding escalation',
  'Final customer findings',
  'Closing a critical finding',
  'Risk acceptance',
];

export const stopEffects = [
  'No new jobs are assigned',
  'Active workflows move to a safe stop where possible',
  'Agents receive the stop state',
  'DFP Command records who stopped it and when',
];

export const isolationItems = ['Tenant isolation', 'Engagement isolation', 'Scoped evidence', 'Separate report context'];

export const reportingPipeline = [
  'Validated Findings',
  'Evidence Agent',
  'Risk Correlation Agent',
  'Report Agent',
  'Human Review',
  'Client Report',
];

export const reportOutputs = [
  'Executive summary',
  'Technical findings',
  'Attack paths',
  'Remediation priorities',
  'Evidence references',
  'Retest status',
];

export const remediationWorkflow = [
  'Finding',
  'Recommended Control',
  'Assigned Owner',
  'Fix Implemented',
  'Retest',
  'Resolved / Further Work',
];

export const securityWatchFlow = [
  'Baseline',
  'Continuous authorised monitoring',
  'Change detected',
  'Analysis',
  'Material change?',
];

export const securityWatchBranches = [
  { label: 'No', outcome: 'Record only' },
  { label: 'Yes', outcome: 'Human review → Customer alert' },
];

export const safetyWording = ['Authorised', 'Scoped', 'Approved', 'Controlled', 'Human-reviewed', 'Evidence-led'];