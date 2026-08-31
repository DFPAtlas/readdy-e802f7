import TesterMailbox from './TesterMailbox';

export async function generateStaticParams() {
  return [];
}

export default async function MailboxPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TesterMailbox assignmentId={id} />;
}