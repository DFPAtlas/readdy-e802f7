import { PortalAccessProvider } from '@/components/portal/PortalAccessProvider';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <PortalAccessProvider>{children}</PortalAccessProvider>;
}