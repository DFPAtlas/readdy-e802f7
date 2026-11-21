import { privateMetadata } from '@/lib/seo';
export const metadata = {
  title: "Track Your UAT Application",
  ...privateMetadata,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
