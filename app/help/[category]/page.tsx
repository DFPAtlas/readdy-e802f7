import { socialMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const title = category.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ') + ' | Help Centre';
  const description = 'Digital Footprint help and guidance: ' + title.replace(' | Help Centre', '') + '.';
  return { title, description, ...socialMetadata({ title, description, path: '/help/' + encodeURIComponent(category) }) };
}

import HelpCategoryClient from './HelpCategoryClient';

export async function generateStaticParams() {
  return [
    { category: 'getting-started' },
    { category: 'account-and-billing' },
    { category: 'projects-and-tasks' },
    { category: 'file-management' },
    { category: 'security-and-privacy' },
    { category: 'integrations' },
    { category: 'troubleshooting' },
    { category: 'account-settings' },
  ];
}

export default async function HelpCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  return <HelpCategoryClient category={resolvedParams.category} />;
}