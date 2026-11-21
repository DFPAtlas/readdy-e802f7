import { socialMetadata } from '@/lib/seo';
export const metadata = {
  title: "QuickGuard \u2014 Security & Compliance",
  description: "QuickGuard is Digital Footprint's security and compliance platform, giving UK businesses clear visibility of risk, policies and safeguards.",
  ...socialMetadata({ title: "QuickGuard \u2014 Security & Compliance", description: "QuickGuard is Digital Footprint's security and compliance platform, giving UK businesses clear visibility of risk, policies and safeguards.", path: "/products/quickguard" }),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
