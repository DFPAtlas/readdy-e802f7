import { socialMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = slug.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ') + ' | Help Centre';
  const description = 'Digital Footprint help and guidance: ' + title.replace(' | Help Centre', '') + '.';
  return { title, description, ...socialMetadata({ title, description, path: '/help/article/' + encodeURIComponent(slug) }) };
}

import HelpArticleDetail from './HelpArticleDetail';

export async function generateStaticParams() {
  return [
    { slug: 'getting-started-with-digital-footprint' },
    { slug: 'how-to-sign-in-to-your-client-portal' },
    { slug: 'understanding-your-invoice-and-making-payment' },
    { slug: 'troubleshooting-common-portal-issues' },
    { slug: 'privacy-and-data-protection' },
    { slug: 'how-to-report-a-security-concern' },
    { slug: 'getting-started-with-cloud-pbx' },
    { slug: 'understanding-the-uat-testing-process' },
  ];
}

export default async function HelpArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return <HelpArticleDetail slug={resolvedParams.slug} />;
}