import { privateMetadata } from '@/lib/seo';
export const metadata = {
  title: "Withdraw a Careers Application",
  ...privateMetadata,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
