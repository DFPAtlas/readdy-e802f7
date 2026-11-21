import { socialMetadata } from '@/lib/seo';
export const metadata = {
  title: "Cookie Policy",
  description: "How Digital Footprint uses cookies and similar technologies, and the choices you have.",
  ...socialMetadata({ title: "Cookie Policy", description: "How Digital Footprint uses cookies and similar technologies, and the choices you have.", path: "/cookie-policy" }),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
