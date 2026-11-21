import { socialMetadata } from '@/lib/seo';
export const metadata = {
  title: "Automation of Business Process | Synqoro",
  description: "Synqoro is Digital Footprint's business automation platform, connecting your systems and removing repetitive manual work.",
  ...socialMetadata({ title: "Automation of Business Process | Synqoro", description: "Synqoro is Digital Footprint's business automation platform, connecting your systems and removing repetitive manual work.", path: "/products/synqoro" }),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
