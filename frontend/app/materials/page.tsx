import type { Metadata } from "next";

import { MaterialsPageClient } from "./MaterialsPageClient";

export const metadata: Metadata = {
  title: "Training Materials",
  description:
    "Browse gym training accessories like lifting straps, belts, smelling salts, chalk, and sleeves.",
};

/**
 * WHY: Expose a dedicated section for training accessories next to supplements and complements.
 */
export default function MaterialsPage() {
  return <MaterialsPageClient />;
}
