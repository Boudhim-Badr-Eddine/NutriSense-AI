import type { Metadata } from "next";

import type { ApiResponse, Supplement } from "@/types";
import { SupplementDetailPageClient } from "./SupplementDetailPageClient";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
const siteUrl = "https://nutrisense-ai.com";

const clampDescription = (text: string, maxLength = 160): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, Math.max(0, maxLength - 3))}...`;
};

const getSupplement = async (id: string): Promise<Supplement | null> => {
  try {
    const response = await fetch(`${baseUrl}/supplements/${id}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as ApiResponse<Supplement>;
    return payload.data ?? null;
  } catch {
    return null;
  }
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supplement = await getSupplement(id);

  if (!supplement) {
    return {
      title: "Supplement Details",
      description: "Supplement benefits, usage, and research insights.",
      openGraph: {
        title: "Supplement Details | NutriSense AI",
        description: "Supplement benefits, usage, and research insights.",
        type: "website",
        url: `${siteUrl}/supplements/${id}`,
      },
      twitter: {
        card: "summary_large_image",
        title: "Supplement Details | NutriSense AI",
        description: "Supplement benefits, usage, and research insights.",
      },
    };
  }

  const description = clampDescription(
    supplement.description || "Supplement benefits and usage guidance.",
  );

  return {
    title: supplement.name,
    description,
    openGraph: {
      title: `${supplement.name} | NutriSense AI`,
      description,
      type: "website",
      url: `${siteUrl}/supplements/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${supplement.name} | NutriSense AI`,
      description,
    },
  };
}

/**
 * WHY: Export SEO metadata and render the supplement detail experience.
 */
export default function SupplementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const idPromise = params;
  return <SupplementDetailPageLoader idPromise={idPromise} />;
}

async function SupplementDetailPageLoader({
  idPromise,
}: {
  idPromise: Promise<{ id: string }>;
}) {
  const { id } = await idPromise;
  return <SupplementDetailPageClient id={id} />;
}
