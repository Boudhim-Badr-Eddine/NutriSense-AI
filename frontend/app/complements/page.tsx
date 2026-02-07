import type { Metadata } from "next";

import { ComplementsPageClient } from "./ComplementsPageClient";

export const metadata: Metadata = {
  title: "Complements Catalog",
  description:
    "Explore vitamins, minerals, and essential nutrients with science-backed guidance.",
  keywords: [
    "complements",
    "vitamins",
    "minerals",
    "antioxidants",
    "omega",
    "adaptogens",
    "nutrition",
  ],
  openGraph: {
    title: "Complements Catalog | NutriSense AI",
    description:
      "Explore vitamins, minerals, and essential nutrients with science-backed guidance.",
    type: "website",
    url: "https://nutrisense-ai.com/complements",
  },
  twitter: {
    card: "summary_large_image",
    title: "Complements Catalog | NutriSense AI",
    description:
      "Explore vitamins, minerals, and essential nutrients with science-backed guidance.",
  },
};

/**
 * WHY: Export SEO metadata and render the interactive complements catalog.
 */
export default function ComplementsPage() {
  return <ComplementsPageClient />;
}
