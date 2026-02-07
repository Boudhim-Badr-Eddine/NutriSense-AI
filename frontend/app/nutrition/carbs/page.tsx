import type { Metadata } from "next";

import { TopCarbsPageClient } from "./TopCarbsPageClient";

export const metadata: Metadata = {
  title: "Top Carbohydrate Sources",
  description:
    "Foods ranked by carbohydrate content per 100g with detailed nutrition profiles.",
  keywords: [
    "carbohydrates",
    "top carb foods",
    "nutrition",
    "macros",
    "energy",
    "diet",
  ],
  openGraph: {
    title: "Top Carbohydrate Sources | NutriSense AI",
    description:
      "Foods ranked by carbohydrate content per 100g with detailed nutrition profiles.",
    type: "website",
    url: "https://nutrisense-ai.com/nutrition/carbs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Top Carbohydrate Sources | NutriSense AI",
    description:
      "Foods ranked by carbohydrate content per 100g with detailed nutrition profiles.",
  },
};

/**
 * WHY: Export SEO metadata and render the carb ranking table.
 */
export default function TopCarbsPage() {
  return <TopCarbsPageClient />;
}
