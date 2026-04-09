import type { Metadata } from "next";

import type { ApiResponse, Complement } from "@/types";
import { ComplementDetailPageClient } from "./ComplementDetailPageClient";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
const siteUrl = "https://nutrisense-ai.com";

const clampDescription = (text: string, maxLength = 160): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, Math.max(0, maxLength - 3))}...`;
};

const getComplement = async (id: string): Promise<Complement | null> => {
  try {
    const response = await fetch(`${baseUrl}/complements/${id}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as ApiResponse<Complement>;
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
  const complement = await getComplement(id);

  if (!complement) {
    return {
      title: "Complement Details",
      description: "Complement benefits, sources, and usage guidance.",
      openGraph: {
        title: "Complement Details | NutriSense AI",
        description: "Complement benefits, sources, and usage guidance.",
        type: "website",
        url: `${siteUrl}/complements/${id}`,
      },
      twitter: {
        card: "summary_large_image",
        title: "Complement Details | NutriSense AI",
        description: "Complement benefits, sources, and usage guidance.",
      },
    };
  }

  const description = clampDescription(
    complement.description || "Complement benefits and usage guidance.",
  );

  return {
    title: complement.name,
    description,
    openGraph: {
      title: `${complement.name} | NutriSense AI`,
      description,
      type: "website",
      url: `${siteUrl}/complements/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${complement.name} | NutriSense AI`,
      description,
    },
  };
}

/**
 * WHY: Export SEO metadata and render the complement detail experience.
 */
export default function ComplementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const idPromise = params;
  return <ComplementDetailPageLoader idPromise={idPromise} />;
}

async function ComplementDetailPageLoader({
  idPromise,
}: {
  idPromise: Promise<{ id: string }>;
}) {
  const { id } = await idPromise;
  return <ComplementDetailPageClient id={id} />;
}
