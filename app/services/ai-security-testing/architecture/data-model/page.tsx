import type { Metadata } from "next";
import { socialMetadata } from "@/lib/seo";
import DataModelClient from "./DataModelClient";

const title = "Proposed Security Service Data Model | Digital Footprint";
const description =
  "PROPOSED SECURITY SERVICE DATA MODEL: a design-only schema specification for the Digital Footprint AI Security Assessment service, covering organisations, engagements, scope, approvals, runs, agents, findings, evidence, remediation, retesting, reporting and Security Watch.";

export const metadata: Metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path: "/services/ai-security-testing/architecture/data-model" }),
};

export default function Page() {
  return <DataModelClient />;
}