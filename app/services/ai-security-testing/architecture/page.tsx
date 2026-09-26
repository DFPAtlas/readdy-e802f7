import type { Metadata } from "next";
import { socialMetadata } from "@/lib/seo";
import ArchitectureClient from "./ArchitectureClient";

const title = "Security Assessment Architecture | Digital Footprint";
const description =
  "How the Digital Footprint AI Security Assessment service is designed to operate: DFP Command, scoped orchestration, approval gates, evidence, human validation and Security Watch.";

export const metadata: Metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path: "/services/ai-security-testing/architecture" }),
};

export default function Page() {
  return <ArchitectureClient />;
}