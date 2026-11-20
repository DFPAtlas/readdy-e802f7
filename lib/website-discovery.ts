export const DISCOVERY_VERSION = 1;
export const DISCOVERY_STORAGE_KEY = 'dfp-website-discovery-v1';
export const DISCOVERY_DRAFT_LIFETIME = 14 * 24 * 60 * 60 * 1000;
export const DISCOVERY_ANSWER_LIMIT = 1500;

interface DiscoveryQuestion {
  id: number;
  title: string;
  hint?: string;
  choices?: readonly string[];
  multiple?: boolean;
}

interface DiscoveryPart {
  title: string;
  description: string;
  questions: readonly DiscoveryQuestion[];
}

export const DISCOVERY_PARTS: readonly DiscoveryPart[] = [
  {
    title: 'Brand Vibe & Personality',
    description: 'Let’s find the personality behind your website.',
    questions: [
      { id: 1, title: 'If your website were a physical space or a person, what would the vibe be?', choices: ['Cosy and welcoming', 'Sharp and minimalist', 'Bold and energetic', 'Traditional and trustworthy'], multiple: true },
      { id: 2, title: 'What are three words you want visitors to think of within five seconds of landing on your site?', hint: 'For example: approachable, capable, dependable.' },
      { id: 3, title: 'What do you want your site to avoid looking or feeling like?', choices: ['Overly corporate', 'Cluttered', 'Too flashy', 'Cookie-cutter'], multiple: true },
      { id: 4, title: 'Do you already have established brand colours, fonts, or a logo, or are you open to a fresh visual direction?', choices: ['Established branding', 'Some brand elements', 'Open to a fresh direction', 'Not sure yet'], hint: 'Tell us about any colours, fonts or logo you want to keep.' },
      { id: 5, title: 'How much breathing room do you prefer on a page?', choices: ['Clean and spacious', 'A balance of space and detail', 'Rich and visually detailed', 'Not sure yet'] },
    ],
  },
  {
    title: 'Visuals, Layout & Feel',
    description: 'Help us picture the look and rhythm of your site.',
    questions: [
      { id: 6, title: 'What kind of photography or visuals feels most authentic to what you do?', choices: ['Real behind-the-scenes photos', 'Clean studio shots', 'Custom illustrations', 'Abstract graphics', 'Minimal imagery'], multiple: true },
      { id: 7, title: 'How do you imagine your homepage feeling as someone scrolls down?', choices: ['A clean, structured introduction', 'A visual story', 'Straight to the point', 'Not sure yet'] },
      { id: 8, title: 'Are there specific sections or moments you already picture on the site?', choices: ['A bold welcoming header', 'Customer stories', 'A showcase of past work', 'A personal About story'], multiple: true, hint: 'Add any other sections you already have in mind.' },
      { id: 9, title: 'How much text do you like seeing on a page—short and punchy, or detailed and thorough?', choices: ['Short and punchy', 'Detailed and thorough', 'A mix, depending on the page', 'Not sure yet'] },
      { id: 10, title: 'What tone of voice feels most natural for your brand?', choices: ['Warm and conversational', 'Polished and authoritative', 'Playful and bold', 'Straightforward and practical'], multiple: true },
    ],
  },
  {
    title: 'Inspiration & Comparisons',
    description: 'Good references help us understand what you see.',
    questions: [
      { id: 11, title: 'Can you share 2–3 websites you like (even outside your industry) and tell us what you like about each one?', hint: 'Paste each website address and a few words about its design, layout, colours or feel.' },
      { id: 12, title: 'Are there any competitor or industry websites you look at and think, “I want something much better than that,” or “I don’t want to look like everyone else”?', hint: 'Share a website address or describe what you would do differently.' },
      { id: 13, title: 'When you picture your finished site on a phone versus a laptop, what feels most important to get right?', hint: 'For example: easy navigation, readable text, quick contact or a great-looking gallery.' },
    ],
  },
  {
    title: 'Audience & Goals',
    description: 'Who are we building for, and what should happen next?',
    questions: [
      { id: 14, title: 'Who is your ideal visitor, and what are they hoping to find quickly when they arrive?' },
      { id: 15, title: 'What is the main impression you want a first-time visitor to walk away with?' },
      { id: 16, title: 'What makes someone choose you over another option—and how should that come across on the site?' },
      { id: 17, title: 'Once someone visits the site, what is the #1 thing you’d love them to do next?', choices: ['Get in touch', 'Book a call', 'Make a purchase', 'Sign up', 'Explore our work'], hint: 'Choose the main action, or describe your own.' },
      { id: 18, title: 'Is there anything you feel your current website (or lack of one) is holding you back from right now?' },
    ],
  },
  {
    title: 'Content, Copy & Assets',
    description: 'Let’s see what you have and where you would like support.',
    questions: [
      { id: 19, title: 'Do you already have written text for your main pages, or are we starting from scratch?', choices: ['Copy is ready', 'Some copy is ready', 'Starting fresh; we will write it', 'Starting fresh; we would like help'], hint: 'Tell us if you would like help shaping the copy.' },
      { id: 20, title: 'Do you have existing brochures, pitch decks, social media posts, or old website copy we can pull from?', choices: ['Brochures', 'Pitch decks', 'Social media posts', 'Old website copy'], multiple: true, hint: 'Leave blank if you are starting fresh.' },
      { id: 21, title: 'Do you have customer testimonials, reviews, case studies, or client logos ready to showcase—and do we have permission to use them?', choices: ['Ready, with permission', 'Have some; permission still needed', 'Not yet', 'Not applicable'], hint: 'Describe what is available and any permission restrictions.' },
      { id: 22, title: 'Do you already have high-quality photos and videos of your work, team, or space, or will we need to source or create them?', choices: ['Photos and videos are ready', 'Some are ready', 'We need help sourcing or creating them', 'Not sure yet'] },
      { id: 23, title: 'Where are your brand files (logos, fonts, photos, videos) stored right now, and are they in high-resolution formats?', hint: 'For example: Google Drive, Dropbox or on your computer; SVG logos or original photos. Describe the location here—we can arrange file sharing later. Please don’t include passwords or private access links.' },
    ],
  },
  {
    title: 'Decisions, Timeline & Success',
    description: 'A little planning now helps your project move smoothly.',
    questions: [
      { id: 24, title: 'Who else on your team or in your circle will have a say in how the website looks, and when do they usually weigh in?' },
      { id: 25, title: 'Who will be responsible for gathering and approving final text and photos, and realistically, when do you think you can share them?' },
      { id: 26, title: 'Looking back a few months after launch, what would make you say, “Yes, this is exactly what I wanted”?' },
    ],
  },
];

export interface DiscoveryAnswer {
  choices: string[];
  text: string;
}
export type DiscoveryAnswers = Record<string, DiscoveryAnswer>;

export function discoveryAnswerText(answer?: DiscoveryAnswer): string {
  return [answer?.choices.join(', '), answer?.text.trim()].filter(Boolean).join('\n');
}

export function answeredDiscoveryQuestions(answers: DiscoveryAnswers): number {
  return DISCOVERY_PARTS.flatMap((part) => part.questions).filter((question) => discoveryAnswerText(answers[question.id])).length;
}

export function formatDiscoveryBrief(answers: DiscoveryAnswers): string {
  return [
    'Website Discovery & Vision Questionnaire',
    `Questionnaire version: ${DISCOVERY_VERSION}`,
    ...DISCOVERY_PARTS.map((part, index) => [
      `Part ${index + 1}: ${part.title}`,
      ...part.questions.map((question) => `${question.id}. ${question.title}\n${discoveryAnswerText(answers[question.id]) || 'Not answered'}`),
    ].join('\n\n')),
  ].join('\n\n');
}

// Only known questions and choices are restored; contact details and consent are
// deliberately excluded from the locally saved draft.
export function readDiscoveryDraft(raw: string | null, now = Date.now()): { step: number; answers: DiscoveryAnswers } | null {
  if (!raw) return null;
  try {
    const draft = JSON.parse(raw);
    if (!draft || draft.version !== DISCOVERY_VERSION || !Number.isFinite(draft.savedAt) || draft.savedAt > now || now - draft.savedAt >= DISCOVERY_DRAFT_LIFETIME) return null;
    if (!draft.answers || typeof draft.answers !== 'object' || Array.isArray(draft.answers)) return null;
    const answers: DiscoveryAnswers = {};
    for (const question of DISCOVERY_PARTS.flatMap((part) => part.questions)) {
      const answer = draft.answers[question.id];
      if (!answer || typeof answer !== 'object') continue;
      const choices = Array.isArray(answer.choices)
        ? [...new Set<string>(answer.choices.filter((value: unknown) => typeof value === 'string' && question.choices?.includes(value)))]
        : [];
      answers[question.id] = {
        choices: question.multiple ? choices : choices.slice(0, 1),
        text: typeof answer.text === 'string' ? answer.text.slice(0, DISCOVERY_ANSWER_LIMIT) : '',
      };
    }
    return { answers, step: Number.isInteger(draft.step) ? Math.min(DISCOVERY_PARTS.length, Math.max(0, draft.step)) : 0 };
  } catch {
    return null;
  }
}

export interface DiscoveryContact {
  name: string;
  email: string;
  company: string;
}

export function buildDiscoveryPayload(answers: DiscoveryAnswers, contact: DiscoveryContact) {
  return {
    name: contact.name.trim(),
    email: contact.email.trim(),
    project_type: 'Website discovery',
    budget_range: 'To discuss',
    initial_message: [
      'Website Discovery & Vision Questionnaire',
      'Source: /services/websites-saas/plan-your-website',
      contact.company.trim() ? `Business: ${contact.company.trim()}` : '',
      'The visitor has requested contact about this brief and acknowledged the privacy notice.',
    ].filter(Boolean).join('\n'),
    additional_notes: formatDiscoveryBrief(answers),
  };
}
