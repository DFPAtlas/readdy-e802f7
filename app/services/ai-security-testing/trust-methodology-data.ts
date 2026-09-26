export const methodologySteps = [
  { title: 'Scope', desc: 'Identify the systems, applications, domains and environments that may be assessed.', icon: 'ri-focus-3-line' },
  { title: 'Authorise', desc: 'Agree permitted testing methods, restrictions, contacts and the testing window.', icon: 'ri-file-shield-2-line' },
  { title: 'Discover', desc: 'Map the authorised attack surface and identify areas requiring deeper assessment.', icon: 'ri-radar-line' },
  { title: 'Test', desc: 'Use AI-assisted analysis, security tooling and controlled testing techniques.', icon: 'ri-code-box-line' },
  { title: 'Validate', desc: 'Human review confirms material findings and removes noise where possible.', icon: 'ri-user-search-line' },
  { title: 'Remediate & Retest', desc: 'Prioritise fixes, support remediation and verify agreed corrections.', icon: 'ri-loop-right-line' },
];

export const engagementControls = [
  'Approved assets',
  'Approved testing methods',
  'Approved testing window',
  'Rate limits',
  'Excluded systems',
  'Emergency contact',
  'Stop-test procedure',
  'Data handling requirements',
];

export const oversightFlow = ['AI Agent', 'Security Tooling', 'Evidence', 'Human Review', 'Client Finding'];

export const criticalProcess = [
  'Critical issue identified',
  'Evidence validated',
  'Named customer contact notified',
  'Immediate containment guidance',
  'Full remediation plan',
];

export const safeTestingPrinciples = [
  { title: 'Least Disruptive First', desc: 'Start with lower-risk checks before deeper testing.', icon: 'ri-arrow-down-double-line' },
  { title: 'Defined Scope', desc: 'Only approved assets and methods are included.', icon: 'ri-focus-2-line' },
  { title: 'Human Oversight', desc: 'Material findings are reviewed before reporting.', icon: 'ri-user-star-line' },
  { title: 'Evidence Preservation', desc: 'Findings are documented clearly enough to support remediation.', icon: 'ri-file-list-3-line' },
  { title: 'Stop Procedure', desc: 'Testing can be paused if the agreed stop conditions are reached.', icon: 'ri-pause-circle-line' },
];

export const trustFaqs = [
  {
    q: 'Will the testing break our systems?',
    a: 'The assessment is scoped to minimise unnecessary operational risk. Testing methods, rate limits and restrictions are agreed before work begins. Higher-risk techniques are only used where explicitly authorised.',
  },
  {
    q: 'Can you test production systems?',
    a: 'Yes, where appropriate and specifically authorised. In some cases a staging or test environment may be preferred. The safest approach depends on the system and the assessment objective.',
  },
  {
    q: 'Do you need our passwords?',
    a: 'Not always. External assessments can often begin without credentials. Deeper authenticated testing may require temporary test accounts or agreed access. Digital Footprint should never be sent passwords or secrets through the public enquiry form.',
  },
  {
    q: 'How is AI used?',
    a: 'AI assists with discovery, analysis, correlation and prioritisation. It does not replace human review or the agreed rules of engagement.',
  },
  {
    q: 'Is this just an automated vulnerability scan?',
    a: 'No. Automated tooling may form part of the assessment, but Digital Footprint also examines context, configuration, identity, attack paths and business impact.',
  },
  {
    q: 'What happens if you find a critical issue?',
    a: 'Material critical findings are validated and handled according to the escalation process agreed during scoping.',
  },
  {
    q: 'Can you test Microsoft 365 or Google Workspace?',
    a: 'Yes, where access and scope are authorised. Identity, MFA, administrative roles and related controls can be included in a broader assessment.',
  },
  {
    q: 'Can you test cloud environments?',
    a: 'Yes. AWS, Azure, Google Cloud, Supabase, Firebase and other hosted environments can be reviewed where appropriate access and authorisation are provided.',
  },
  {
    q: 'Can you test AI agents and chatbots?',
    a: 'Yes. AI-enabled applications can be assessed for issues such as excessive tool permissions, sensitive data exposure, prompt-injection risk and weak access boundaries.',
  },
  {
    q: 'Do you provide Cyber Essentials certification?',
    a: 'Digital Footprint can help assess readiness and identify gaps, but should not be presented as a Cyber Essentials certification body unless that status exists.',
  },
  {
    q: 'Is this a penetration test?',
    a: 'The service can include penetration-testing techniques within an agreed authorised scope, but the exact depth depends on the selected assessment and rules of engagement.',
  },
  {
    q: 'Do you provide a retest?',
    a: 'Retesting can be included to verify whether agreed remediation has addressed the original findings.',
  },
];

export const trustStrip = [
  { title: 'Authorised', desc: 'Testing only within agreed scope', icon: 'ri-shield-check-line' },
  { title: 'Human-reviewed', desc: 'Material findings validated', icon: 'ri-user-star-line' },
  { title: 'Evidence-led', desc: 'Clear supporting evidence', icon: 'ri-file-search-line' },
  { title: 'Remediation-focused', desc: 'Designed to drive improvement', icon: 'ri-tools-line' },
];