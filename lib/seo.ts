import type { Metadata } from "next";

export function socialMetadata(opts: {
  title: string;
  description: string;
  path: string;
}): Pick<Metadata, "openGraph" | "twitter"> {
  const { title, description, path } = opts;
  return {
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: path,
      siteName: "Digital Footprint",
      title,
      description,
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.jpg"],
      creator: "@digitalfootprint",
    },
  };
}