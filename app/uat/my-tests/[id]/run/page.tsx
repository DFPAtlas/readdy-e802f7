import RunnerClient from './RunnerClient';

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

export default async function RunTestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RunnerClient assignmentId={id} />;
}