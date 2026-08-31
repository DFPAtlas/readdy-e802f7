import TesterEvents from './TesterEvents';

export async function generateStaticParams() {
  return [];
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TesterEvents assignmentId={id} />;
}