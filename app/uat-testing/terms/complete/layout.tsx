import { privateMetadata } from '@/lib/seo';
export const metadata = {
  title: "UAT Terms Accepted",
  ...privateMetadata,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
