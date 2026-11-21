import { socialMetadata } from '@/lib/seo';
export const metadata = {
  title: "Terms of Service",
  description: "The terms and conditions that apply when you use Digital Footprint's websites, products and services.",
  ...socialMetadata({ title: "Terms of Service", description: "The terms and conditions that apply when you use Digital Footprint's websites, products and services.", path: "/terms" }),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
