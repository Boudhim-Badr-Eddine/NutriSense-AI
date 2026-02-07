import {
  ComplementResult,
  FoodResult,
  SupplementResult,
} from "./searchService";

export interface Link {
  text: string;
  url: string;
  type: "supplement" | "complement" | "food";
}

interface LinkSource {
  name: string;
  slug: string;
  type: Link["type"];
}

const buildSources = (
  supplements: SupplementResult[],
  complements: ComplementResult[],
  foods: FoodResult[],
): LinkSource[] => [
  ...supplements.map((item) => ({
    name: item.name,
    slug: item.slug,
    type: "supplement" as const,
  })),
  ...complements.map((item) => ({
    name: item.name,
    slug: item.slug,
    type: "complement" as const,
  })),
  ...foods.map((item) => ({
    name: item.name,
    slug: item.slug,
    type: "food" as const,
  })),
];

const buildUrl = (source: LinkSource): string => {
  switch (source.type) {
    case "supplement":
      return `/supplements/${source.slug}`;
    case "complement":
      return `/complements/${source.slug}`;
    case "food":
      return `/nutrition/foods/${source.slug}`;
  }
};

const hasWholeWord = (text: string, word: string): boolean => {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`\b${escaped}\b`, "i");
  return regex.test(text);
};

/**
 * WHY: Turn matched entity names into clickable links for the UI.
 */
export const extractLinks = (
  answer: string,
  supplements: SupplementResult[],
  complements: ComplementResult[],
  foods: FoodResult[],
): Link[] => {
  const sources = buildSources(supplements, complements, foods);

  return sources
    .filter((source) => hasWholeWord(answer, source.name))
    .map((source) => ({
      text: source.name,
      url: buildUrl(source),
      type: source.type,
    }));
};
