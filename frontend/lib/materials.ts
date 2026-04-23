export interface MaterialItem {
  id: string;
  name: string;
  category: string;
  purpose: string;
  description: string;
  price: number;
  image: string;
  icon: "grip" | "belt" | "salts" | "chalk" | "sleeves";
  level: "Essential" | "Power" | "Recovery";
}

export const MATERIALS_STORAGE_KEY = "nutrisense_materials";

export const defaultMaterials: MaterialItem[] = [
  {
    id: "lifting-straps",
    name: "Lifting Straps",
    category: "Grip Support",
    purpose: "Improves pulling grip during deadlifts and rows.",
    description:
      "Heavy-duty figure-8 style straps built for maximal pull sessions and secure bar control.",
    price: 129,
    image:
      "https://www.tuffwraps.com/cdn/shop/files/tuff-figure-8-lifting-straps-heavy-duty-weightlifting-straps-tuffwraps-1152130643.png?v=1743160973&width=1200",
    icon: "grip",
    level: "Essential",
  },
  {
    id: "lifting-straps-premium",
    name: "Lifting Straps Premium",
    category: "Grip Support",
    purpose: "Extra wrist comfort and lock-in for heavy pull sessions.",
    description:
      "Premium cotton straps for repeated volume blocks, reducing grip fatigue on rows and RDLs.",
    price: 169,
    image:
      "https://uppper.com/cdn/shop/files/uppper-lifting-straps-white-premium-fitness-gear.jpg?v=1772398894&width=1946",
    icon: "grip",
    level: "Power",
  },
  {
    id: "powerlifting-belt",
    name: "Powerlifting Belt",
    category: "Core Stability",
    purpose: "Supports bracing and spinal stability on heavy PR sets.",
    description:
      "Lever belt designed for high intra-abdominal pressure and confident setup during compound lifts.",
    price: 399,
    image:
      "https://ntgear.eu/cdn/shop/files/Premium_Lever_Belt_Front_5000x.jpg?v=1740743918",
    icon: "belt",
    level: "Power",
  },
  {
    id: "smelling-salts",
    name: "Smelling Salts",
    category: "PR Focus",
    purpose: "Boosts alertness before max-effort compounds.",
    description:
      "High-intensity aromatic stimulant for short pre-lift activation moments before heavy attempts.",
    price: 89,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEB4gxb_myPVbFJbNInB2NlHKJ7h5Gs8S2wg&s",
    icon: "salts",
    level: "Power",
  },
  {
    id: "gym-chalk-block",
    name: "Gym Chalk",
    category: "Grip Control",
    purpose: "Reduces hand moisture for safer and stronger lifts.",
    description:
      "High-friction chalk block helping maintain dry palms and stable grip on bars, rings, and plates.",
    price: 49,
    image:
      "https://m.media-amazon.com/images/I/61mdc73u15L._AC_UF1000,1000_QL80_.jpg",
    icon: "chalk",
    level: "Essential",
  },
  {
    id: "knee-sleeves",
    name: "Knee Sleeves",
    category: "Joint Support",
    purpose: "Adds warmth and confidence for squat sessions.",
    description:
      "Compression sleeves for knee warmth, rebound support, and improved confidence under load.",
    price: 249,
    image:
      "https://markbellslingshot.com/cdn/shop/products/KNEESLEEVE3D-grippyx.jpg?v=1606096626&width=1080",
    icon: "sleeves",
    level: "Recovery",
  },
];

export const materials: MaterialItem[] = defaultMaterials;

const sanitizeMaterialList = (value: unknown): MaterialItem[] => {
  if (!Array.isArray(value)) {
    return defaultMaterials;
  }

  const validItems = value.filter((item): item is MaterialItem => {
    if (typeof item !== "object" || item === null) {
      return false;
    }

    const candidate = item as Partial<MaterialItem>;
    return (
      typeof candidate.id === "string" &&
      typeof candidate.name === "string" &&
      typeof candidate.category === "string" &&
      typeof candidate.purpose === "string" &&
      typeof candidate.description === "string" &&
      typeof candidate.price === "number" &&
      typeof candidate.image === "string" &&
      (candidate.icon === "grip" ||
        candidate.icon === "belt" ||
        candidate.icon === "salts" ||
        candidate.icon === "chalk" ||
        candidate.icon === "sleeves") &&
      (candidate.level === "Essential" ||
        candidate.level === "Power" ||
        candidate.level === "Recovery")
    );
  });

  return validItems.length > 0 ? validItems : defaultMaterials;
};

export const getStoredMaterials = (): MaterialItem[] => {
  if (typeof window === "undefined") {
    return defaultMaterials;
  }

  const raw = window.localStorage.getItem(MATERIALS_STORAGE_KEY);
  if (!raw) {
    return defaultMaterials;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    return sanitizeMaterialList(parsed);
  } catch {
    return defaultMaterials;
  }
};

export const saveStoredMaterials = (items: MaterialItem[]): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(MATERIALS_STORAGE_KEY, JSON.stringify(items));
};

const slugify = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

export const createMaterialId = (
  name: string,
  existing: MaterialItem[],
): string => {
  const baseId = slugify(name) || "material";
  const existingIds = new Set(existing.map((item) => item.id));

  if (!existingIds.has(baseId)) {
    return baseId;
  }

  let suffix = 2;
  while (existingIds.has(`${baseId}-${suffix}`)) {
    suffix += 1;
  }

  return `${baseId}-${suffix}`;
};

export const getMaterialById = (id: string): MaterialItem | undefined => {
  return getStoredMaterials().find((material) => material.id === id);
};
