import type { Metadata } from "next";

import { MaterialDetailPageClient } from "./MaterialDetailPageClient";

export const metadata: Metadata = {
  title: "Material Details",
  description:
    "View training material details, usage purpose, and add accessories to your grocery cart.",
};

interface MaterialDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * WHY: Route users to a dedicated material detail page from Materials list and cart.
 */
export default async function MaterialDetailPage({
  params,
}: MaterialDetailPageProps) {
  const { id } = await params;
  return <MaterialDetailPageClient id={id} />;
}
