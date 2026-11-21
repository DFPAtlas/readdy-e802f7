import { socialMetadata } from '@/lib/seo';
export const metadata = {
  title: "Partner, Supplier & Referral Network",
  description: "How Digital Footprint works with referral, supplier and technology partners \u2014 and how to join the network.",
  ...socialMetadata({ title: "Partner, Supplier & Referral Network", description: "How Digital Footprint works with referral, supplier and technology partners \u2014 and how to join the network.", path: "/partners" }),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
