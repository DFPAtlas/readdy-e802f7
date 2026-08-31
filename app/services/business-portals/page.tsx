import type { Metadata } from "next";
import { socialMetadata } from "@/lib/seo";
import BusinessPortalsClient from "./BusinessPortalsClient";

const title = "Business Portals & Dashboards | Digital Footprint";
const description =
  "Digital Footprint builds customer portals, staff portals, dashboards and business management systems that bring information, communication and workflows into one secure place.";

export const metadata: Metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path: "/services/business-portals" }),
};

export default function Page() {
  return <BusinessPortalsClient />;
}