import { privateMetadata } from '@/lib/seo';
export const metadata = {
  title: "Submit a Support Request",
  ...privateMetadata,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
