import type { Metadata } from "next";

import type { ApiResponse, Food } from "@/types";
import { FoodDetailPageClient } from "./FoodDetailPageClient";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
const siteUrl = "https://nutrisense-ai.com";

const clampDescription = (text: string, maxLength = 160): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, Math.max(0, maxLength - 3))}...`;
};

const getFood = async (id: string): Promise<Food | null> => {
  try {
    const response = await fetch(`${baseUrl}/foods/${id}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as ApiResponse<Food>;
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
  const food = await getFood(id);

  if (!food) {
    return {
      title: "Food Details",
      description: "Food nutrition details, benefits, and meal ideas.",
      openGraph: {
        title: "Food Details | NutriSense AI",
        description: "Food nutrition details, benefits, and meal ideas.",
        type: "website",
        url: `${siteUrl}/nutrition/foods/${id}`,
      },
      twitter: {
        card: "summary_large_image",
        title: "Food Details | NutriSense AI",
        description: "Food nutrition details, benefits, and meal ideas.",
      },
    };
  }

  const description = clampDescription(
    `Nutrition details for ${food.name}. ${food.category || ""}`.trim(),
  );

  return {
    title: food.name,
    description,
    openGraph: {
      title: `${food.name} | NutriSense AI`,
      description,
      type: "website",
      url: `${siteUrl}/nutrition/foods/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${food.name} | NutriSense AI`,
      description,
    },
  };
}

/**
 * WHY: Export SEO metadata and render the food detail experience.
 */
export default function FoodDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const idPromise = params;
  return <FoodDetailPageLoader idPromise={idPromise} />;
}

async function FoodDetailPageLoader({
  idPromise,
}: {
  idPromise: Promise<{ id: string }>;
}) {
  const { id } = await idPromise;
  return <FoodDetailPageClient id={id} />;
}
