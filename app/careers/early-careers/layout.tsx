import { socialMetadata } from '@/lib/seo';
export const metadata = {
  title: "Early Careers",
  description: "Early careers at Digital Footprint \u2014 placements, apprenticeships and first roles for people starting out in technology.",
  ...socialMetadata({ title: "Early Careers", description: "Early careers at Digital Footprint \u2014 placements, apprenticeships and first roles for people starting out in technology.", path: "/careers/early-careers" }),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
