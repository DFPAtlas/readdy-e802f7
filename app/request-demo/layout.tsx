import { socialMetadata } from '@/lib/seo';
export const metadata = {
  title: "Request a Software Demo",
  description: "Request a demonstration of Digital Footprint software, client portals, business automation and AI tools for your UK business.",
  ...socialMetadata({ title: "Request a Software Demo", description: "Request a demonstration of Digital Footprint software, client portals, business automation and AI tools for your UK business.", path: "/request-demo" }),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
