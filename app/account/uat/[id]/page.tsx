import RedirectClient from './RedirectClient';

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

export default async function AccountUatDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RedirectClient assignmentId={id} />;
}