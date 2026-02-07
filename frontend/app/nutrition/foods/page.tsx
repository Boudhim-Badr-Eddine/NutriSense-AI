import type { Metadata } from "next";

import { FoodsPageClient } from "./FoodsPageClient";

export const metadata: Metadata = {
  title: "Foods Catalog",
  description:
    "Search foods by diet or type and compare macro values per 100g.",
};

/**
 * WHY: Export SEO metadata and render the interactive foods catalog.
 */
export default function FoodsPage() {
  return <FoodsPageClient />;
}
