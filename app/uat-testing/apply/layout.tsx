import { privateMetadata } from '@/lib/seo';
export const metadata = {
  title: "Apply to Become a UAT Tester",
  ...privateMetadata,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
