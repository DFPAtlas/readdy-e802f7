import { privateMetadata } from '@/lib/seo';

export const metadata = { title: 'Sign In', ...privateMetadata };

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
