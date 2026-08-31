import type { Metadata } from "next";
import { socialMetadata } from "@/lib/seo";
import CloudInfrastructureClient from "./CloudInfrastructureClient";

const title = "Cloud, Infrastructure & IT Support | Digital Footprint";
const description =
  "Digital Footprint supports cloud platforms, servers, networks, cyber security and business IT infrastructure, helping organisations build reliable foundations for their digital systems.";

export const metadata: Metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path: "/services/cloud-infrastructure" }),
};

export default function Page() {
  return <CloudInfrastructureClient />;
}