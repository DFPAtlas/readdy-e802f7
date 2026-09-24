import type { Metadata } from "next";
import { socialMetadata } from "@/lib/seo";
import AiSecurityTestingClient from "./AiSecurityTestingClient";

const title = "AI Security Testing | Digital Footprint";
const description =
  "Digital Footprint uses AI-driven attack simulation to test your websites, applications, APIs and cloud systems for security weaknesses before attackers find them.";

export const metadata: Metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path: "/services/ai-security-testing" }),
};

export default function Page() {
  return <AiSecurityTestingClient />;
}