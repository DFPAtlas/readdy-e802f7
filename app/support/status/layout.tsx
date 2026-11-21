import { socialMetadata } from '@/lib/seo';
export const metadata = {
  title: "Service Status",
  description: "Live service status for Digital Footprint products and platforms, including current incidents and planned maintenance.",
  ...socialMetadata({ title: "Service Status", description: "Live service status for Digital Footprint products and platforms, including current incidents and planned maintenance.", path: "/support/status" }),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
