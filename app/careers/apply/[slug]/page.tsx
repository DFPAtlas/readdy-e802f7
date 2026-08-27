import type { Metadata } from "next";
import { socialMetadata } from "@/lib/seo";
import CareersApplyClient from './CareersApplyClient';

export const metadata: Metadata = {
  title: "Apply for a Role — Careers",
  description:
    "Apply for a role at Digital Footprint. Submit your CV and cover note and a real person will review every application.",
  ...socialMetadata({
    title: "Apply for a Role — Careers",
    description:
      "Apply for a role at Digital Footprint. Submit your CV and cover note and a real person will review every application.",
    path: "/careers",
  }),
};

export async function generateStaticParams() {
  return [
    { slug: 'senior-frontend-engineer' },
    { slug: 'cloud-infrastructure-engineer' },
    { slug: 'graduate-software-developer' },
    { slug: 'product-manager-saas' },
  ];
}

export default async function CareersApplyPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return <CareersApplyClient slug={resolvedParams.slug} />;
}