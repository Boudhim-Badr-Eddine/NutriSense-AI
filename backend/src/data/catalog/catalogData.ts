import slugify from "slugify";

import {
  ComplementCatalogItem,
  FoodCatalogItem,
  SupplementCatalogItem,
} from "./catalogTypes";

const createSlug = (name: string): string =>
  slugify(name, { lower: true, strict: true, trim: true });

export const supplementCatalog: SupplementCatalogItem[] = [
  {
    name: "Whey Protein Isolate",
    slug: createSlug("Whey Protein Isolate"),
    category: "proteins",
    description:
      "Premium whey isolate with fast digestion, high leucine content, and strong post-training recovery support for athletes focused on lean mass and performance.",
    benefits: [
      "Rapid muscle recovery",
      "Supports muscle protein synthesis",
      "Low lactose",
      "High protein density",
    ],
    dosage: "25-30g per serving",
    timing: "Post-workout or between meals",
    duration: "Daily",
    ingredients: ["Whey protein isolate", "Sunflower lecithin"],
    contraindications: ["Milk allergy", "Severe lactose intolerance"],
    scientificStudies: [
      {
        title: "Whey protein and skeletal muscle adaptation",
        url: "https://pubmed.ncbi.nlm.nih.gov/24276305/",
        summary:
          "Clinical evidence supports whey protein for recovery and lean mass adaptation with resistance training.",
      },
    ],
    images: ["/images/supplements/whey-protein-isolate.jpg"],
    goals: ["mass", "endurance"],
    popularity: 95,
  },
  {
    name: "Creatine Monohydrate",
    slug: createSlug("Creatine Monohydrate"),
    category: "creatine",
    description:
      "Evidence-backed creatine supplement that improves phosphocreatine availability, high-intensity training output, and long-term strength adaptation.",
    benefits: [
      "Improved power output",
      "Strength gains",
      "Better repeated sprint performance",
      "Supports lean mass",
    ],
    dosage: "3-5g daily",
    timing: "Any consistent time daily",
    duration: "Daily",
    ingredients: ["Creatine monohydrate"],
    contraindications: ["Kidney disease without medical supervision"],
    scientificStudies: [
      {
        title: "ISSN position stand on creatine supplementation",
        url: "https://pubmed.ncbi.nlm.nih.gov/28615996/",
        summary:
          "Creatine monohydrate remains one of the most effective performance supplements for strength and high-intensity work.",
      },
    ],
    images: ["/images/supplements/creatine-monohydrate.jpg"],
    goals: ["mass", "endurance"],
    popularity: 100,
  },
  {
    name: "Casein Protein",
    slug: createSlug("Casein Protein"),
    category: "proteins",
    description:
      "Slow-digesting milk protein ideal for overnight recovery, satiety support, and sustained amino acid delivery.",
    benefits: [
      "Slow amino acid release",
      "Supports overnight recovery",
      "Helps satiety",
      "Supports lean mass retention",
    ],
    dosage: "25-35g per serving",
    timing: "Before bed or long gaps between meals",
    duration: "Daily",
    ingredients: ["Micellar casein"],
    contraindications: ["Milk allergy"],
    scientificStudies: [
      {
        title: "Casein supplementation and overnight muscle protein synthesis",
        url: "https://pubmed.ncbi.nlm.nih.gov/?term=casein+overnight+muscle+protein+synthesis",
        summary:
          "Casein may support sustained amino acid availability and overnight recovery processes.",
      },
    ],
    images: ["/images/supplements/casein-protein.jpg"],
    goals: ["mass", "cutting"],
    popularity: 72,
  },
  {
    name: "Electrolyte Recovery Mix",
    slug: createSlug("Electrolyte Recovery Mix"),
    category: "recovery",
    description:
      "Hydration-focused formula with sodium, potassium, and magnesium to support fluid balance and reduce performance decline during long sessions.",
    benefits: [
      "Hydration support",
      "Supports endurance performance",
      "Helps reduce cramping risk",
      "Useful in hot environments",
    ],
    dosage: "1 serving in 500-750ml water",
    timing: "During or after training",
    duration: "Training days",
    ingredients: ["Sodium", "Potassium", "Magnesium", "Chloride"],
    contraindications: ["Severe kidney disease", "Physician-supervised sodium restriction"],
    scientificStudies: [
      {
        title: "Electrolyte intake and endurance hydration",
        url: "https://pubmed.ncbi.nlm.nih.gov/?term=electrolytes+endurance+hydration",
        summary:
          "Electrolyte replacement supports fluid balance and helps maintain performance during prolonged exercise.",
      },
    ],
    images: ["/images/supplements/electrolyte-recovery-mix.jpg"],
    goals: ["endurance"],
    popularity: 69,
  },
  {
    name: "Beta-Alanine",
    slug: createSlug("Beta-Alanine"),
    category: "pre-workout",
    description:
      "Performance amino acid that helps buffer acidity during intense efforts and can improve repeated high-intensity output.",
    benefits: [
      "Supports muscular endurance",
      "Improves repeated effort capacity",
      "Useful for high-intensity intervals",
      "Pairs well with creatine",
    ],
    dosage: "3.2-6.4g daily",
    timing: "Daily, split doses preferred",
    duration: "At least 4 weeks for full effect",
    ingredients: ["Beta-alanine"],
    contraindications: ["May cause temporary tingling sensation"],
    scientificStudies: [
      {
        title: "Beta-alanine and exercise performance",
        url: "https://pubmed.ncbi.nlm.nih.gov/?term=beta-alanine+exercise+performance",
        summary:
          "Beta-alanine is associated with improved performance in exercises limited by muscular acidosis.",
      },
    ],
    images: ["/images/supplements/beta-alanine.jpg"],
    goals: ["endurance", "mass"],
    popularity: 76,
  },
  {
    name: "Citrulline Malate",
    slug: createSlug("Citrulline Malate"),
    category: "pre-workout",
    description:
      "Nitric oxide support ingredient commonly used to improve blood flow, work capacity, and training volume.",
    benefits: [
      "May improve blood flow",
      "Supports training volume",
      "Useful for pre-workout pump support",
      "May reduce fatigue perception",
    ],
    dosage: "6-8g pre-workout",
    timing: "30-60 minutes before training",
    duration: "Training days",
    ingredients: ["L-Citrulline", "Malate"],
    contraindications: ["Use caution with blood pressure medication"],
    scientificStudies: [
      {
        title: "Citrulline malate and high-intensity exercise",
        url: "https://pubmed.ncbi.nlm.nih.gov/?term=citrulline+malate+exercise",
        summary:
          "Some evidence suggests citrulline malate may support exercise volume and reduce fatigue.",
      },
    ],
    images: ["/images/supplements/citrulline-malate.jpg"],
    goals: ["endurance", "mass"],
    popularity: 74,
  },
  {
    name: "Vitamin D3 + K2",
    slug: createSlug("Vitamin D3 K2"),
    category: "recovery",
    description:
      "Micronutrient support formula combining vitamin D3 and K2 for bone health, calcium regulation, and general recovery support.",
    benefits: [
      "Supports bone health",
      "Supports calcium regulation",
      "Useful in low sun exposure periods",
      "Pairs well with performance nutrition",
    ],
    dosage: "As directed per label",
    timing: "With a meal containing fat",
    duration: "Daily",
    ingredients: ["Vitamin D3", "Vitamin K2 MK-7"],
    contraindications: ["Anticoagulant therapy requires medical guidance"],
    scientificStudies: [
      {
        title: "Vitamin D and musculoskeletal health",
        url: "https://pubmed.ncbi.nlm.nih.gov/?term=vitamin+d+musculoskeletal+health",
        summary:
          "Vitamin D status is strongly linked to bone and muscle health outcomes.",
      },
    ],
    images: ["/images/supplements/vitamin-d3-k2.jpg"],
    goals: ["endurance"],
    popularity: 67,
  },
  {
    name: "Multivitamin Performance Blend",
    slug: createSlug("Multivitamin Performance Blend"),
    category: "recovery",
    description:
      "Broad-spectrum daily micronutrient support formula intended to cover common intake gaps in active adults.",
    benefits: [
      "Supports baseline micronutrient intake",
      "Useful for busy athletes",
      "Helps cover dietary gaps",
      "Convenient daily support",
    ],
    dosage: "1 serving daily",
    timing: "With breakfast or lunch",
    duration: "Daily",
    ingredients: ["Vitamin D", "B-complex", "Magnesium", "Zinc", "Vitamin C"],
    contraindications: ["Avoid stacking with multiple high-dose micronutrient products"],
    scientificStudies: [
      {
        title: "Micronutrient adequacy in active populations",
        url: "https://pubmed.ncbi.nlm.nih.gov/?term=micronutrient+adequacy+athletes",
        summary:
          "Athletes may benefit from targeted micronutrient support when food intake is inconsistent or restricted.",
      },
    ],
    images: ["/images/supplements/multivitamin-performance-blend.jpg"],
    goals: ["mass", "cutting", "endurance"],
    popularity: 70,
  },
];

export const complementCatalog: ComplementCatalogItem[] = [
  {
    name: "Vitamin D3",
    slug: createSlug("Vitamin D3"),
    category: "vitamin",
    description:
      "Fat-soluble vitamin critical for calcium balance, immune support, musculoskeletal function, and general resilience.",
    biologicalRole:
      "Supports calcium absorption, bone remodeling, immune signaling, and neuromuscular function.",
    deficiencySymptoms: [
      "Fatigue",
      "Bone pain",
      "Muscle weakness",
      "Depression",
      "Frequent illness",
    ],
    foodSources: [
      { food: "Salmon", quantityPer100g: 570, unit: "IU" },
      { food: "Egg yolk", quantityPer100g: 44, unit: "IU" },
      { food: "Fortified milk", quantityPer100g: 40, unit: "IU" },
    ],
    dailyIntake: {
      men: "600-2000 IU",
      women: "600-2000 IU",
      pregnant: "1500-2000 IU",
      athletes: "2000-5000 IU",
    },
    supplementForms: [
      { form: "Cholecalciferol (D3)", bioavailability: "High" },
      { form: "Ergocalciferol (D2)", bioavailability: "Lower than D3" },
    ],
    interactions: ["Vitamin K2", "Calcium", "Steroid medications"],
    contraindications: ["Hypercalcemia", "Sarcoidosis", "Kidney disease"],
    images: ["/images/complements/vitamin-d3.jpg"],
  },
  {
    name: "Magnesium Citrate",
    slug: createSlug("Magnesium Citrate"),
    category: "mineral",
    description:
      "Bioavailable magnesium form supporting muscular relaxation, sleep quality, energy metabolism, and stress resilience.",
    biologicalRole:
      "Supports ATP production, nerve signaling, muscle contraction and relaxation, and enzyme activity.",
    deficiencySymptoms: [
      "Muscle cramps",
      "Poor sleep",
      "Anxiety",
      "Fatigue",
      "Heart palpitations",
    ],
    foodSources: [
      { food: "Almonds", quantityPer100g: 270, unit: "mg" },
      { food: "Dark chocolate", quantityPer100g: 228, unit: "mg" },
      { food: "Spinach", quantityPer100g: 79, unit: "mg" },
    ],
    dailyIntake: {
      men: "400-420mg",
      women: "310-320mg",
      pregnant: "350-360mg",
      athletes: "400-500mg",
    },
    supplementForms: [
      { form: "Citrate", bioavailability: "High" },
      { form: "Glycinate", bioavailability: "High and gentle" },
    ],
    interactions: ["Some antibiotics", "Zinc competition"],
    contraindications: ["Kidney failure", "Heart block"],
    images: ["/images/complements/magnesium-citrate.jpg"],
  },
  {
    name: "Iron",
    slug: createSlug("Iron"),
    category: "mineral",
    description:
      "Essential mineral for oxygen transport, endurance support, and energy metabolism, especially relevant in deficiency-related fatigue.",
    biologicalRole:
      "Required for hemoglobin production, oxygen transport, mitochondrial energy production, and cognitive function.",
    deficiencySymptoms: [
      "Fatigue",
      "Cold hands and feet",
      "Hair loss",
      "Brittle nails",
      "Poor concentration",
    ],
    foodSources: [
      { food: "Beef liver", quantityPer100g: 6.5, unit: "mg" },
      { food: "Lentils", quantityPer100g: 3.3, unit: "mg" },
      { food: "Spinach", quantityPer100g: 2.7, unit: "mg" },
    ],
    dailyIntake: {
      men: "8mg",
      women: "18mg",
      pregnant: "27mg",
      athletes: "8-18mg based on status",
    },
    supplementForms: [
      { form: "Ferrous bisglycinate", bioavailability: "High and gentle" },
      { form: "Ferrous sulfate", bioavailability: "Effective but harsher" },
    ],
    interactions: ["Vitamin C improves absorption", "Calcium reduces absorption"],
    contraindications: ["Hemochromatosis", "Iron overload disorders"],
    images: ["/images/complements/iron.jpg"],
  },
  {
    name: "Omega-3 (EPA/DHA)",
    slug: createSlug("Omega-3 EPA DHA"),
    category: "omega",
    description:
      "Marine omega-3 support for brain function, cardiovascular health, inflammation balance, and recovery quality.",
    biologicalRole:
      "Supports cell membrane function, cardiovascular regulation, cognitive health, and inflammation resolution.",
    deficiencySymptoms: [
      "Dry skin",
      "Poor memory",
      "Joint pain",
      "Depression",
      "Poor concentration",
    ],
    foodSources: [
      { food: "Salmon", quantityPer100g: 2260, unit: "mg" },
      { food: "Mackerel", quantityPer100g: 5134, unit: "mg" },
      { food: "Sardines", quantityPer100g: 2205, unit: "mg" },
    ],
    dailyIntake: {
      men: "500mg EPA+DHA",
      women: "500mg EPA+DHA",
      pregnant: "700mg with DHA emphasis",
      athletes: "1000-3000mg EPA+DHA",
    },
    supplementForms: [
      { form: "Fish oil triglyceride", bioavailability: "Good" },
      { form: "Krill oil", bioavailability: "High" },
    ],
    interactions: ["Anticoagulant medication"],
    contraindications: ["Fish allergy", "Bleeding disorders"],
    images: ["/images/complements/omega-3-epa-dha.jpg"],
  },
  {
    name: "Vitamin B12",
    slug: createSlug("Vitamin B12"),
    category: "vitamin",
    description:
      "Neurological and hematological support nutrient important for red blood cell production, nerve health, and mental clarity.",
    biologicalRole:
      "Supports DNA synthesis, neurological function, methylation, and red blood cell formation.",
    deficiencySymptoms: [
      "Fatigue",
      "Numbness in hands or feet",
      "Poor memory",
      "Depression",
      "Poor concentration",
    ],
    foodSources: [
      { food: "Beef liver", quantityPer100g: 70, unit: "mcg" },
      { food: "Clams", quantityPer100g: 98, unit: "mcg" },
      { food: "Sardines", quantityPer100g: 8.9, unit: "mcg" },
    ],
    dailyIntake: {
      men: "2.4mcg",
      women: "2.4mcg",
      pregnant: "2.6mcg",
      athletes: "2.4-4mcg",
    },
    supplementForms: [
      { form: "Methylcobalamin", bioavailability: "High" },
      { form: "Cyanocobalamin", bioavailability: "Good" },
    ],
    interactions: ["Metformin may reduce B12 status"],
    contraindications: ["Leber hereditary optic neuropathy"],
    images: ["/images/complements/vitamin-b12.jpg"],
  },
  {
    name: "Vitamin C",
    slug: createSlug("Vitamin C"),
    category: "vitamin",
    description:
      "Antioxidant vitamin important for immune support, collagen synthesis, and tissue repair during demanding training blocks.",
    biologicalRole:
      "Supports antioxidant protection, collagen formation, immune function, and iron absorption.",
    deficiencySymptoms: [
      "Frequent illness",
      "Slow wound healing",
      "Easy bruising",
      "Fatigue",
      "Low immunity",
    ],
    foodSources: [
      { food: "Bell peppers", quantityPer100g: 128, unit: "mg" },
      { food: "Kiwi", quantityPer100g: 93, unit: "mg" },
      { food: "Orange", quantityPer100g: 53, unit: "mg" },
    ],
    dailyIntake: {
      men: "90mg",
      women: "75mg",
      pregnant: "85mg",
      athletes: "100-300mg",
    },
    supplementForms: [
      { form: "Ascorbic acid", bioavailability: "Good" },
      { form: "Buffered vitamin C", bioavailability: "Good and gentler" },
    ],
    interactions: ["Improves iron absorption"],
    contraindications: ["High-dose use may not suit kidney stone risk"],
    images: ["/images/complements/vitamin-c.jpg"],
  },
  {
    name: "Zinc",
    slug: createSlug("Zinc"),
    category: "mineral",
    description:
      "Trace mineral important for immune resilience, wound healing, hormone balance, and skin health.",
    biologicalRole:
      "Supports immune signaling, tissue repair, protein synthesis, reproductive health, and skin integrity.",
    deficiencySymptoms: [
      "Hair loss",
      "Slow wound healing",
      "Frequent illness",
      "Loss of taste or smell",
      "Poor skin health",
    ],
    foodSources: [
      { food: "Oysters", quantityPer100g: 78, unit: "mg" },
      { food: "Beef", quantityPer100g: 12, unit: "mg" },
      { food: "Pumpkin seeds", quantityPer100g: 8, unit: "mg" },
    ],
    dailyIntake: {
      men: "11mg",
      women: "8mg",
      pregnant: "11mg",
      athletes: "11-20mg",
    },
    supplementForms: [
      { form: "Picolinate", bioavailability: "High" },
      { form: "Gluconate", bioavailability: "Good" },
    ],
    interactions: ["Competes with copper absorption"],
    contraindications: ["Long-term high dosing may cause copper deficiency"],
    images: ["/images/complements/zinc.jpg"],
  },
  {
    name: "Ashwagandha",
    slug: createSlug("Ashwagandha"),
    category: "adaptogen",
    description:
      "Adaptogenic herb commonly used to support stress resilience, sleep quality, and mental recovery.",
    biologicalRole:
      "Supports stress response modulation, relaxation, and general recovery during high mental or physical load.",
    deficiencySymptoms: [
      "High stress",
      "Anxiety",
      "Poor sleep",
      "Fatigue",
      "Poor recovery",
    ],
    foodSources: [],
    dailyIntake: {
      men: "300-600mg extract",
      women: "300-600mg extract",
      pregnant: "Avoid unless medically advised",
      athletes: "300-600mg extract",
    },
    supplementForms: [
      { form: "Root extract", bioavailability: "Standardized extracts preferred" },
    ],
    interactions: ["Sedatives", "Thyroid medication"],
    contraindications: ["Pregnancy", "Autoimmune conditions need medical review"],
    images: ["/images/complements/ashwagandha.jpg"],
  },
];

export const foodCatalog: FoodCatalogItem[] = [
  {
    name: "Salmon",
    slug: createSlug("Salmon"),
    category: "fish",
    type: "animal",
    per100g: {
      calories: 208,
      proteins: 20,
      carbs: 0,
      fats: 13,
      fiber: 0,
      vitamins: [
        { name: "Vitamin D", amount: 570, unit: "IU" },
        { name: "Vitamin B12", amount: 3.2, unit: "mcg" },
      ],
      minerals: [
        { name: "Selenium", amount: 36.5, unit: "mcg" },
        { name: "Potassium", amount: 363, unit: "mg" },
      ],
    },
    benefits: ["Omega-3 source", "High-quality protein", "Supports recovery"],
    mealIdeas: ["Grilled salmon bowl", "Baked salmon with potatoes"],
    dietaryTags: ["gluten-free", "high-protein"],
    image: "/images/foods/salmon.jpg",
  },
  {
    name: "Greek Yogurt",
    slug: createSlug("Greek Yogurt"),
    category: "dairy",
    type: "animal",
    per100g: {
      calories: 97,
      proteins: 10,
      carbs: 3.9,
      fats: 5,
      fiber: 0,
      vitamins: [{ name: "Vitamin B12", amount: 0.5, unit: "mcg" }],
      minerals: [
        { name: "Calcium", amount: 110, unit: "mg" },
        { name: "Potassium", amount: 141, unit: "mg" },
      ],
    },
    benefits: ["Protein-rich", "Supports gut-friendly eating patterns", "Calcium source"],
    mealIdeas: ["Greek yogurt parfait", "High-protein breakfast bowl"],
    dietaryTags: ["high-protein", "vegetarian"],
    image: "/images/foods/greek-yogurt.jpg",
  },
  {
    name: "Spinach",
    slug: createSlug("Spinach"),
    category: "leafy greens",
    type: "vegetal",
    per100g: {
      calories: 23,
      proteins: 2.9,
      carbs: 3.6,
      fats: 0.4,
      fiber: 2.2,
      vitamins: [
        { name: "Vitamin C", amount: 28.1, unit: "mg" },
        { name: "Folate", amount: 194, unit: "mcg" },
      ],
      minerals: [
        { name: "Iron", amount: 2.7, unit: "mg" },
        { name: "Magnesium", amount: 79, unit: "mg" },
      ],
    },
    benefits: ["Micronutrient dense", "Supports iron intake", "Low-calorie volume food"],
    mealIdeas: ["Spinach omelet", "Spinach smoothie", "Sauteed spinach"],
    dietaryTags: ["vegan", "gluten-free", "low-calorie"],
    image: "/images/foods/spinach.jpg",
  },
  {
    name: "Lentils",
    slug: createSlug("Lentils"),
    category: "legumes",
    type: "vegetal",
    per100g: {
      calories: 116,
      proteins: 9,
      carbs: 20.1,
      fats: 0.4,
      fiber: 7.9,
      vitamins: [{ name: "Folate", amount: 181, unit: "mcg" }],
      minerals: [
        { name: "Iron", amount: 3.3, unit: "mg" },
        { name: "Potassium", amount: 369, unit: "mg" },
      ],
    },
    benefits: ["Plant protein", "Fiber-rich", "Supports iron intake"],
    mealIdeas: ["Lentil soup", "Lentil salad", "Lentil curry"],
    dietaryTags: ["vegan", "high-fiber", "gluten-free"],
    image: "/images/foods/lentils.jpg",
  },
  {
    name: "Eggs",
    slug: createSlug("Eggs"),
    category: "eggs",
    type: "animal",
    per100g: {
      calories: 143,
      proteins: 12.6,
      carbs: 0.7,
      fats: 9.5,
      fiber: 0,
      vitamins: [
        { name: "Vitamin D", amount: 87, unit: "IU" },
        { name: "Vitamin B12", amount: 1.1, unit: "mcg" },
      ],
      minerals: [{ name: "Selenium", amount: 30.7, unit: "mcg" }],
    },
    benefits: ["Complete protein", "Choline source", "Versatile whole food"],
    mealIdeas: ["Boiled eggs", "Omelet", "Egg and toast breakfast"],
    dietaryTags: ["high-protein", "gluten-free"],
    image: "/images/foods/eggs.jpg",
  },
  {
    name: "Beef Liver",
    slug: createSlug("Beef Liver"),
    category: "organ meat",
    type: "animal",
    per100g: {
      calories: 135,
      proteins: 20.4,
      carbs: 3.9,
      fats: 3.6,
      fiber: 0,
      vitamins: [
        { name: "Vitamin B12", amount: 70, unit: "mcg" },
        { name: "Vitamin A", amount: 9442, unit: "mcg" },
      ],
      minerals: [
        { name: "Iron", amount: 6.5, unit: "mg" },
        { name: "Copper", amount: 12, unit: "mg" },
      ],
    },
    benefits: ["Extremely nutrient-dense", "High in B12", "Supports iron intake"],
    mealIdeas: ["Pan-seared liver", "Liver and onions"],
    dietaryTags: ["high-protein", "nutrient-dense", "gluten-free"],
    image: "/images/foods/beef-liver.jpg",
  },
  {
    name: "Sardines",
    slug: createSlug("Sardines"),
    category: "fish",
    type: "animal",
    per100g: {
      calories: 208,
      proteins: 24.6,
      carbs: 0,
      fats: 11.5,
      fiber: 0,
      vitamins: [
        { name: "Vitamin B12", amount: 8.9, unit: "mcg" },
        { name: "Vitamin D", amount: 272, unit: "IU" },
      ],
      minerals: [
        { name: "Calcium", amount: 382, unit: "mg" },
        { name: "Selenium", amount: 52.7, unit: "mcg" },
      ],
    },
    benefits: ["Omega-3 rich", "High-protein", "Calcium rich when bones included"],
    mealIdeas: ["Sardine toast", "Mediterranean sardine salad"],
    dietaryTags: ["high-protein", "gluten-free"],
    image: "/images/foods/sardines.jpg",
  },
  {
    name: "Almonds",
    slug: createSlug("Almonds"),
    category: "nuts",
    type: "vegetal",
    per100g: {
      calories: 579,
      proteins: 21.2,
      carbs: 21.6,
      fats: 49.9,
      fiber: 12.5,
      vitamins: [{ name: "Vitamin E", amount: 25.6, unit: "mg" }],
      minerals: [
        { name: "Magnesium", amount: 270, unit: "mg" },
        { name: "Calcium", amount: 269, unit: "mg" },
      ],
    },
    benefits: ["Magnesium source", "Healthy fats", "Portable snack"],
    mealIdeas: ["Almond snack pack", "Almond oatmeal topping"],
    dietaryTags: ["vegan", "gluten-free", "high-fiber"],
    image: "/images/foods/almonds.jpg",
  },
  {
    name: "Pumpkin Seeds",
    slug: createSlug("Pumpkin Seeds"),
    category: "seeds",
    type: "vegetal",
    per100g: {
      calories: 559,
      proteins: 30.2,
      carbs: 10.7,
      fats: 49,
      fiber: 6,
      vitamins: [{ name: "Vitamin K", amount: 7.3, unit: "mcg" }],
      minerals: [
        { name: "Zinc", amount: 7.8, unit: "mg" },
        { name: "Magnesium", amount: 592, unit: "mg" },
      ],
    },
    benefits: ["Rich in zinc", "Rich in magnesium", "Crunchy protein-rich topping"],
    mealIdeas: ["Pumpkin seed trail mix", "Salad topping"],
    dietaryTags: ["vegan", "gluten-free", "high-protein"],
    image: "/images/foods/pumpkin-seeds.jpg",
  },
  {
    name: "Oats",
    slug: createSlug("Oats"),
    category: "whole grains",
    type: "vegetal",
    per100g: {
      calories: 389,
      proteins: 16.9,
      carbs: 66.3,
      fats: 6.9,
      fiber: 10.6,
      vitamins: [{ name: "Thiamin", amount: 0.76, unit: "mg" }],
      minerals: [
        { name: "Magnesium", amount: 177, unit: "mg" },
        { name: "Iron", amount: 4.7, unit: "mg" },
      ],
    },
    benefits: ["High fiber", "Useful pre-workout carb source", "Supports satiety"],
    mealIdeas: ["Overnight oats", "Oatmeal bowl"],
    dietaryTags: ["vegetarian", "high-fiber"],
    image: "/images/foods/oats.jpg",
  },
  {
    name: "Sweet Potato",
    slug: createSlug("Sweet Potato"),
    category: "starchy vegetables",
    type: "vegetal",
    per100g: {
      calories: 86,
      proteins: 1.6,
      carbs: 20.1,
      fats: 0.1,
      fiber: 3,
      vitamins: [{ name: "Vitamin A", amount: 709, unit: "mcg" }],
      minerals: [{ name: "Potassium", amount: 337, unit: "mg" }],
    },
    benefits: ["Useful carb source", "Rich in vitamin A", "Supports training fuel"],
    mealIdeas: ["Roasted sweet potato", "Sweet potato mash"],
    dietaryTags: ["vegan", "gluten-free"],
    image: "/images/foods/sweet-potato.jpg",
  },
];
