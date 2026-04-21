export interface SymptomProfile {
  canonical: string;
  aliases: string[];
  weight: number;
  linkedComplements: string[];
}

const profiles: SymptomProfile[] = [
  {
    canonical: "fatigue",
    aliases: ["low energy", "tired all day", "exhaustion"],
    weight: 1.4,
    linkedComplements: ["Vitamin B12", "Iron", "Magnesium Citrate", "Vitamin D3"],
  },
  {
    canonical: "brain fog",
    aliases: ["mental fog", "poor focus", "mental fatigue"],
    weight: 1.35,
    linkedComplements: ["Vitamin B12", "Omega-3 (EPA/DHA)", "Magnesium Citrate"],
  },
  {
    canonical: "poor concentration",
    aliases: ["focus issues", "hard to focus", "cannot focus"],
    weight: 1.3,
    linkedComplements: ["Vitamin B12", "Iron", "Omega-3 (EPA/DHA)"],
  },
  {
    canonical: "depression",
    aliases: ["low mood", "feeling down"],
    weight: 1.5,
    linkedComplements: ["Vitamin D3", "Omega-3 (EPA/DHA)", "Vitamin B12"],
  },
  {
    canonical: "anxiety",
    aliases: ["nervousness", "high anxiety"],
    weight: 1.3,
    linkedComplements: ["Magnesium Citrate", "Ashwagandha", "Omega-3 (EPA/DHA)"],
  },
  {
    canonical: "muscle cramps",
    aliases: ["cramping", "muscle spasms"],
    weight: 1.2,
    linkedComplements: ["Magnesium Citrate", "Potassium", "Calcium"],
  },
  {
    canonical: "muscle weakness",
    aliases: ["weak muscles", "low strength"],
    weight: 1.25,
    linkedComplements: ["Vitamin D3", "Magnesium Citrate", "Iron"],
  },
  {
    canonical: "poor sleep",
    aliases: ["sleep issues", "bad sleep"],
    weight: 1.2,
    linkedComplements: ["Magnesium Citrate", "Ashwagandha", "Zinc"],
  },
  {
    canonical: "insomnia",
    aliases: ["cannot sleep", "trouble sleeping"],
    weight: 1.25,
    linkedComplements: ["Magnesium Citrate", "Ashwagandha", "Zinc"],
  },
  {
    canonical: "high stress",
    aliases: ["stress", "chronic stress"],
    weight: 1.2,
    linkedComplements: ["Ashwagandha", "Magnesium Citrate", "Vitamin C"],
  },
  {
    canonical: "hair loss",
    aliases: ["thinning hair", "hair thinning"],
    weight: 1.25,
    linkedComplements: ["Zinc", "Iron", "Vitamin D3"],
  },
  {
    canonical: "brittle nails",
    aliases: ["weak nails", "nail breakage"],
    weight: 1.2,
    linkedComplements: ["Iron", "Zinc", "Biotin"],
  },
  {
    canonical: "dry skin",
    aliases: ["very dry skin", "dehydrated skin"],
    weight: 1.1,
    linkedComplements: ["Omega-3 (EPA/DHA)", "Vitamin C", "Vitamin E"],
  },
  {
    canonical: "frequent illness",
    aliases: ["often sick", "low immunity"],
    weight: 1.3,
    linkedComplements: ["Vitamin D3", "Vitamin C", "Zinc"],
  },
  {
    canonical: "slow recovery from sickness",
    aliases: ["slow immune recovery", "recover slowly"],
    weight: 1.25,
    linkedComplements: ["Vitamin C", "Zinc", "Vitamin D3"],
  },
  {
    canonical: "bone pain",
    aliases: ["aching bones"],
    weight: 1.35,
    linkedComplements: ["Vitamin D3", "Calcium", "Magnesium Citrate"],
  },
  {
    canonical: "frequent fractures",
    aliases: ["bone fractures", "easy fractures"],
    weight: 1.45,
    linkedComplements: ["Vitamin D3", "Calcium", "Vitamin K2"],
  },
  {
    canonical: "heart palpitations",
    aliases: ["palpitations", "irregular heartbeat"],
    weight: 1.45,
    linkedComplements: ["Magnesium Citrate", "Potassium", "Omega-3 (EPA/DHA)"],
  },
  {
    canonical: "numbness in hands or feet",
    aliases: ["tingling hands", "tingling feet", "numbness"],
    weight: 1.5,
    linkedComplements: ["Vitamin B12", "Magnesium Citrate", "Iron"],
  },
  {
    canonical: "cold hands and feet",
    aliases: ["cold extremities", "cold feet", "cold hands"],
    weight: 1.35,
    linkedComplements: ["Iron", "Vitamin B12", "Omega-3 (EPA/DHA)"],
  },
];

const normalize = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const aliasMap: Record<string, string> = profiles.reduce<Record<string, string>>(
  (acc, profile) => {
    acc[normalize(profile.canonical)] = profile.canonical;

    profile.aliases.forEach((alias) => {
      acc[normalize(alias)] = profile.canonical;
    });

    return acc;
  },
  {},
);

const profileByCanonical: Record<string, SymptomProfile> = profiles.reduce<
  Record<string, SymptomProfile>
>((acc, profile) => {
  acc[profile.canonical] = profile;
  return acc;
}, {});

export const resolveCanonicalSymptom = (symptom: string): string => {
  const normalized = normalize(symptom);
  return aliasMap[normalized] ?? normalized;
};

export const getSymptomProfile = (canonical: string): SymptomProfile | null => {
  return profileByCanonical[canonical] ?? null;
};

export const getSymptomWeight = (canonical: string): number => {
  return getSymptomProfile(canonical)?.weight ?? 1;
};

export const getLinkedComplements = (canonical: string): string[] => {
  return getSymptomProfile(canonical)?.linkedComplements ?? [];
};
