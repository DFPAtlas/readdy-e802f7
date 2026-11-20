import type { Metadata } from 'next';
import { socialMetadata } from '@/lib/seo';
import WebsiteDiscoveryWizard from './WebsiteDiscoveryWizard';

const title = 'Plan Your Website';
const description = 'Share your vision, style and goals in our guided website discovery questionnaire. No technical knowledge needed.';

export const metadata: Metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path: '/services/websites-saas/plan-your-website' }),
};

export default function Page() {
  return <WebsiteDiscoveryWizard />;
}
