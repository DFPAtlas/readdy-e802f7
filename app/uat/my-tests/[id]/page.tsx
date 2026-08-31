import TestDetail from './TestDetail';

export async function generateStaticParams() {
  return [];
}

export default async function MyTestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TestDetail assignmentId={id} />;
}