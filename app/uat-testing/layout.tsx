import { socialMetadata } from '@/lib/seo';
export const metadata = {
  title: "Become a Software Tester",
  description: "Join the Digital Footprint UAT programme to test real software, report issues and help improve the products we build.",
  ...socialMetadata({ title: "Become a Software Tester", description: "Join the Digital Footprint UAT programme to test real software, report issues and help improve the products we build.", path: "/uat-testing" }),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
