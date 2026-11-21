import { socialMetadata } from '@/lib/seo';
export const metadata = {
  title: "LetHub \u2014 Lettings Software",
  description: "LetHub is Digital Footprint's lettings platform for landlords and agents \u2014 listings, tenants, maintenance and compliance in one system.",
  ...socialMetadata({ title: "LetHub \u2014 Lettings Software", description: "LetHub is Digital Footprint's lettings platform for landlords and agents \u2014 listings, tenants, maintenance and compliance in one system.", path: "/products/lethub" }),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
