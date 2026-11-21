import { socialMetadata } from '@/lib/seo';
export const metadata = {
  title: "Referral Programme",
  description: "Refer clients to Digital Footprint and earn a reward \u2014 how the referral programme works and how to submit a referral.",
  ...socialMetadata({ title: "Referral Programme", description: "Refer clients to Digital Footprint and earn a reward \u2014 how the referral programme works and how to submit a referral.", path: "/partners/referrals" }),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
