import type { Metadata } from "next";
import { socialMetadata } from "@/lib/seo";
import AiAutomationClient from "./AiAutomationClient";

const title = "AI & Business Automation | Digital Footprint";
const description =
  "Digital Footprint builds AI agents and business automation systems that connect workflows, customer services, data and existing business platforms.";

export const metadata: Metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path: "/services/ai-automation" }),
};

export default function Page() {
  return <AiAutomationClient />;
}