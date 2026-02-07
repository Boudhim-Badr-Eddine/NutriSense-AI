import type { Metadata } from "next";

import { SupplementsPageClient } from "./SupplementsPageClient";

export const metadata: Metadata = {
  title: "Supplements Catalog",
  description:
    "Browse our comprehensive catalog of sports supplements including proteins, creatine, BCAAs, and more. Get expert AI recommendations.",
  keywords: [
    "supplements",
    "proteins",
    "creatine",
    "BCAA",
    "pre-workout",
    "recovery",
    "nutrition",
  ],
  openGraph: {
    title: "Supplements Catalog | NutriSense AI",
    description:
      "Browse our comprehensive catalog of sports supplements including proteins, creatine, BCAAs, and more. Get expert AI recommendations.",
    type: "website",
    url: "https://nutrisense-ai.com/supplements",
  },
  twitter: {
    card: "summary_large_image",
    title: "Supplements Catalog | NutriSense AI",
    description:
      "Browse our comprehensive catalog of sports supplements including proteins, creatine, BCAAs, and more. Get expert AI recommendations.",
  },
};

/**
 * WHY: Export SEO metadata and render the interactive supplements catalog.
 */
export default function SupplementsPage() {
  return <SupplementsPageClient />;
}
