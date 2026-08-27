import type { Metadata } from "next";
import { socialMetadata } from "@/lib/seo";
import ContactPage from "./ContactClient";

const title = "Contact Us — Book a Free Consultation";
const description =
  "Get in touch with Digital Footprint. Tell us about your project and we'll respond within one business day with honest, no-pressure advice.";

export const metadata: Metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path: "/contact" }),
};

export default function Page() {
  return <ContactPage />;
}