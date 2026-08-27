import type { Metadata } from "next";
import { socialMetadata } from "@/lib/seo";
import AccessibilityClient from "./AccessibilityClient";

const title = "Accessibility Statement";
const description =
  "Digital Footprint's commitment to digital accessibility, our conformance with WCAG 2.1 Level AA, and how to report issues or provide feedback.";

export const metadata: Metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path: "/accessibility" }),
};

export default function Page() {
  return <AccessibilityClient />;
}