import TesterSandbox from './TesterSandbox';

export async function generateStaticParams() {
  return [];
}

export default async function TesterSandboxPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TesterSandbox assignmentId={id} />;
}