import type { Metadata } from "next";
import { socialMetadata } from "@/lib/seo";
import CareersVacancyDetail from './CareersVacancyDetail';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return {
  title: "Current Vacancies — Careers",
  description:
    "View open roles and career opportunities at Digital Footprint, a technology venture studio building digital products for independent UK businesses.",
  ...socialMetadata({
    title: "Current Vacancies — Careers",
    description:
      "View open roles and career opportunities at Digital Footprint, a technology venture studio building digital products for independent UK businesses.",
    path: `/careers/${encodeURIComponent(slug)}`,
  }),
};
}

export async function generateStaticParams() {
  return [
    { slug: 'senior-frontend-engineer' },
    { slug: 'cloud-infrastructure-engineer' },
    { slug: 'graduate-software-developer' },
    { slug: 'product-manager-saas' },
  ];
}

export default async function CareersVacancyPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return <CareersVacancyDetail slug={resolvedParams.slug} />;
}