import type { Metadata } from "next";
import { socialMetadata } from "@/lib/seo";
import ServicesPage from "./ServicesClient";

const title = "Our Services — Websites, Automation, AI & Support";
const description =
  "Explore Digital Footprint's services: website design and development, AI agents, business automation, customer portals, cloud systems, cyber security and IT support.";

export const metadata: Metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path: "/services" }),
};

export default function Page() {
  return <ServicesPage />;
}