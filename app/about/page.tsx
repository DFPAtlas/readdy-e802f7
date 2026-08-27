import type { Metadata } from "next";
import { socialMetadata } from "@/lib/seo";
import AboutClient from "./AboutClient";

const title = "About Us — Our Story, Method & Team";
const description =
  "Learn about Digital Footprint: how we turn ideas into working digital systems, the CDD method we follow, and the team behind it all.";

export const metadata: Metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path: "/about" }),
};

export default function Page() {
  return <AboutClient />;
}