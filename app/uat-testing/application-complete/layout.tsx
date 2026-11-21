import { privateMetadata } from '@/lib/seo';
export const metadata = {
  title: "UAT Application Received",
  ...privateMetadata,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
