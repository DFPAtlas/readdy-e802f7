import type { Metadata } from "next";
import { socialMetadata } from "@/lib/seo";
import HomePage from "./HomePage";

const title = "Digital Systems, Automation & AI for Independent UK Businesses";
const description =
  "Websites, client portals, automation and AI-powered tools that help independent UK businesses launch, grow and operate more efficiently.";

export const metadata: Metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path: "/" }),
};

export default function Page() {
  return <HomePage />;
}