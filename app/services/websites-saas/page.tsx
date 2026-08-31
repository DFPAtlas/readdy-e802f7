import type { Metadata } from "next";
import { socialMetadata } from "@/lib/seo";
import WebsitesSaaSClient from "./WebsitesSaaSClient";

const title = "Websites & SaaS Development | Digital Footprint";
const description =
  "Digital Footprint designs and develops professional websites, business applications and SaaS platforms built around how your organisation works.";

export const metadata: Metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path: "/services/websites-saas" }),
};

export default function Page() {
  return <WebsitesSaaSClient />;
}