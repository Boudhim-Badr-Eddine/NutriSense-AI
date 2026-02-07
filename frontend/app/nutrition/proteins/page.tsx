import type { Metadata } from "next";

import { TopProteinsPageClient } from "./TopProteinsPageClient";

export const metadata: Metadata = {
  title: "Top Protein Sources",
  description:
    "Foods ranked by protein content per 100g with detailed nutrition profiles.",
  keywords: [
    "protein",
    "top protein foods",
    "nutrition",
    "macros",
    "fitness",
    "diet",
  ],
  openGraph: {
    title: "Top Protein Sources | NutriSense AI",
    description:
      "Foods ranked by protein content per 100g with detailed nutrition profiles.",
    type: "website",
    url: "https://nutrisense-ai.com/nutrition/proteins",
  },
  twitter: {
    card: "summary_large_image",
    title: "Top Protein Sources | NutriSense AI",
    description:
      "Foods ranked by protein content per 100g with detailed nutrition profiles.",
  },
};

/**
 * WHY: Export SEO metadata and render the protein ranking table.
 */
export default function TopProteinsPage() {
  return <TopProteinsPageClient />;
}
