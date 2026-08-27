import type { Metadata } from "next";
import { socialMetadata } from "@/lib/seo";
import BlogClient from "./BlogClient";

const title = "Insights — Technology, Automation & Digital Systems";
const description =
  "Practical thinking on technology, automation, cloud infrastructure and digital systems for independent UK businesses.";

export const metadata: Metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path: "/blog" }),
};

export default function Page() {
  return <BlogClient />;
}