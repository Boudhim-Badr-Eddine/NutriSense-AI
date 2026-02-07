import type { Metadata } from "next";

import { TopFatsPageClient } from "./TopFatsPageClient";

export const metadata: Metadata = {
  title: "Top Healthy Fats",
  description:
    "Foods ranked by fat content per 100g with detailed nutrition profiles.",
  keywords: [
    "healthy fats",
    "top fat foods",
    "nutrition",
    "macros",
    "omega",
    "diet",
  ],
  openGraph: {
    title: "Top Healthy Fats | NutriSense AI",
    description:
      "Foods ranked by fat content per 100g with detailed nutrition profiles.",
    type: "website",
    url: "https://nutrisense-ai.com/nutrition/fats",
  },
  twitter: {
    card: "summary_large_image",
    title: "Top Healthy Fats | NutriSense AI",
    description:
      "Foods ranked by fat content per 100g with detailed nutrition profiles.",
  },
};

/**
 * WHY: Export SEO metadata and render the fat ranking table.
 */
export default function TopFatsPage() {
  return <TopFatsPageClient />;
}
