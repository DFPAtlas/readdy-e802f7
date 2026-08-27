import type { Metadata } from "next";
import { socialMetadata } from "@/lib/seo";
import WhoWeHelpPage from "./WhoWeHelpClient";

const title = "Who We Help";
const description =
  "We build digital systems for independent UK businesses, founders, growing companies and agency partners — shaped around real business needs, not a fixed package.";

export const metadata: Metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path: "/who-we-help" }),
};

export default function Page() {
  return <WhoWeHelpPage />;
}