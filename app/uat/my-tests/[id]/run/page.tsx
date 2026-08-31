import RunnerClient from './RunnerClient';

export async function generateStaticParams() {
  return [];
}

export default async function RunTestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RunnerClient assignmentId={id} />;
}