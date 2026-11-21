import { socialMetadata } from '@/lib/seo';
export const metadata = {
  title: "Help Centre",
  description: "Find answers, guides and support for Digital Footprint products and services in the help centre.",
  ...socialMetadata({ title: "Help Centre", description: "Find answers, guides and support for Digital Footprint products and services in the help centre.", path: "/help" }),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
