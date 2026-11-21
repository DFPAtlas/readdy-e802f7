import { socialMetadata } from '@/lib/seo';
export const metadata = {
  title: "GuardianHub \u2014 Client Portal Platform",
  description: "GuardianHub is Digital Footprint's secure client portal, bringing projects, documents, messaging and approvals into one place.",
  ...socialMetadata({ title: "GuardianHub \u2014 Client Portal Platform", description: "GuardianHub is Digital Footprint's secure client portal, bringing projects, documents, messaging and approvals into one place.", path: "/products/guardianhub" }),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
