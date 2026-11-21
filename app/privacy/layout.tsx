import { socialMetadata } from '@/lib/seo';
export const metadata = {
  title: "Privacy Policy",
  description: "How Digital Footprint collects, uses and protects your personal data, and the rights you have under UK GDPR.",
  ...socialMetadata({ title: "Privacy Policy", description: "How Digital Footprint collects, uses and protects your personal data, and the rights you have under UK GDPR.", path: "/privacy" }),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
