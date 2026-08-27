import type { Metadata } from "next";
import { socialMetadata } from "@/lib/seo";
import CareersClient from "./CareersClient";

const title = "Careers — Join the Digital Footprint Team";
const description =
  "Explore current vacancies at Digital Footprint, a technology venture studio building digital products for independent UK businesses.";

export const metadata: Metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path: "/careers" }),
};

export default function Page() {
  return <CareersClient />;
}