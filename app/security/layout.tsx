import { socialMetadata } from '@/lib/seo';
export const metadata = {
  title: "Security at Digital Footprint",
  description: "How Digital Footprint protects your data and systems \u2014 security practices, controls and our approach to risk.",
  ...socialMetadata({ title: "Security at Digital Footprint", description: "How Digital Footprint protects your data and systems \u2014 security practices, controls and our approach to risk.", path: "/security" }),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
