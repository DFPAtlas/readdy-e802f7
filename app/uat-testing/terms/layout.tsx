import { privateMetadata } from '@/lib/seo';
export const metadata = {
  title: "UAT Tester Terms",
  ...privateMetadata,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
