import type { Metadata } from "next";

export function socialMetadata(opts: {
  title: string;
  description: string;
  path: string;
}): Pick<Metadata, "openGraph" | "twitter" | "alternates"> {
  const { title, description, path } = opts;
  return {
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: path,
      siteName: "Digital Footprint",
      title,
      description,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
      creator: "@digitalfootprint",
    },
  };
}

export const privateMetadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};
