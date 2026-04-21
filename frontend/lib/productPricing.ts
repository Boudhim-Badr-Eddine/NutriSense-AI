import type { Complement, Supplement } from "@/types";

const supplementPriceRanges: Record<Supplement["category"], [number, number]> =
  {
    proteins: [899, 1999],
    creatine: [450, 500],
    bcaa: [399, 599],
    "pre-workout": [499, 799],
    recovery: [349, 649],
  };

const complementPriceRanges: Record<Complement["category"], [number, number]> =
  {
    vitamin: [179, 259],
    mineral: [199, 299],
    antioxidant: [219, 329],
    omega: [229, 349],
    adaptogen: [239, 359],
  };

const getNameHash = (name: string): number => {
  return name.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
};

export const getSupplementPrice = (
  supplement: Pick<Supplement, "category" | "name" | "popularity" | "price">,
): number => {
  if (typeof supplement.price === "number") {
    return supplement.price;
  }

  const [minPrice, maxPrice] = supplementPriceRanges[supplement.category];
  const spread = Math.max(1, maxPrice - minPrice);

  return (
    minPrice + ((getNameHash(supplement.name) + supplement.popularity) % spread)
  );
};

export const getComplementPrice = (
  complement: Pick<Complement, "category" | "name" | "price">,
): number => {
  if (typeof complement.price === "number") {
    return complement.price;
  }

  const [minPrice, maxPrice] = complementPriceRanges[complement.category];
  const spread = Math.max(1, maxPrice - minPrice);

  return minPrice + (getNameHash(complement.name) % spread);
};

export const formatPrice = (price: number): string => `${price} DH`;
