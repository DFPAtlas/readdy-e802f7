import { socialMetadata } from '@/lib/seo';
export const metadata = {
  title: "Case Studies",
  description: "Real examples of websites, portals, automation and AI systems Digital Footprint has designed and built for UK businesses.",
  ...socialMetadata({ title: "Case Studies", description: "Real examples of websites, portals, automation and AI systems Digital Footprint has designed and built for UK businesses.", path: "/case-studies" }),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
