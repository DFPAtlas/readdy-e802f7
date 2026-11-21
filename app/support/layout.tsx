import { socialMetadata } from '@/lib/seo';
export const metadata = {
  title: "Support",
  description: "Get help from Digital Footprint \u2014 raise a request, check service status or contact the support team.",
  ...socialMetadata({ title: "Support", description: "Get help from Digital Footprint \u2014 raise a request, check service status or contact the support team.", path: "/support" }),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
