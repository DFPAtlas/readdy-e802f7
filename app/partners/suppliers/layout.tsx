import { socialMetadata } from '@/lib/seo';
export const metadata = {
  title: "Supplier Interest",
  description: "Register your interest in supplying goods or services to Digital Footprint and hear about opportunities.",
  ...socialMetadata({ title: "Supplier Interest", description: "Register your interest in supplying goods or services to Digital Footprint and hear about opportunities.", path: "/partners/suppliers" }),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
