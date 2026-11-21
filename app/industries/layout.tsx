import { socialMetadata } from '@/lib/seo';
export const metadata = {
  title: "Industries We Serve",
  description: "See the industries Digital Footprint builds for \u2014 trades, professional services, property, healthcare, retail and more across the UK.",
  ...socialMetadata({ title: "Industries We Serve", description: "See the industries Digital Footprint builds for \u2014 trades, professional services, property, healthcare, retail and more across the UK.", path: "/industries" }),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
