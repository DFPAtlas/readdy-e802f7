import { socialMetadata } from '@/lib/seo';
export const metadata = {
  title: "Technology Partners",
  description: "Digital Footprint's technology partners and the platforms, tools and integrations we build with.",
  ...socialMetadata({ title: "Technology Partners", description: "Digital Footprint's technology partners and the platforms, tools and integrations we build with.", path: "/partners/technology" }),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
