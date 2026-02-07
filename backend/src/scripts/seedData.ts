import slugify from "slugify";

import { connectDatabase } from "../config/database";
import { Complement } from "../models/Complement";
import { Conversation } from "../models/Conversation";
import { Food } from "../models/Food";
import { Supplement } from "../models/Supplement";

interface SupplementSeed {
  name: string;
  slug: string;
  category: "proteins" | "creatine" | "bcaa" | "pre-workout" | "recovery";
  description: string;
  benefits: string[];
  dosage: string;
  timing: string;
  duration: string;
  ingredients: string[];
  contraindications: string[];
  scientificStudies: Array<{ title: string; url: string; summary: string }>;
  images: string[];
  goals: Array<"mass" | "cutting" | "endurance">;
  popularity: number;
}

interface ComplementSeed {
  name: string;
  slug: string;
  category: "vitamin" | "mineral" | "antioxidant" | "omega" | "adaptogen";
  description: string;
  biologicalRole: string;
  deficiencySymptoms: string[];
  foodSources: Array<{ food: string; quantityPer100g: number; unit: string }>;
  dailyIntake: {
    men: string;
    women: string;
    pregnant: string;
    athletes: string;
  };
  supplementForms: Array<{ form: string; bioavailability: string }>;
  interactions: string[];
  contraindications: string[];
  images: string[];
}

interface FoodSeed {
  name: string;
  slug: string;
  category: string;
  type: "animal" | "vegetal" | "supplement";
  per100g: {
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
    fiber: number;
    vitamins: Array<{ name: string; amount: number; unit: string }>;
    minerals: Array<{ name: string; amount: number; unit: string }>;
  };
  benefits: string[];
  mealIdeas: string[];
  dietaryTags: string[];
  image: string;
}

const createSlug = (name: string): string =>
  slugify(name, { lower: true, strict: true, trim: true });

const supplementsData: SupplementSeed[] = [
  {
    name: "Whey Protein Isolate",
    slug: createSlug("Whey Protein Isolate"),
    category: "proteins",
    description:
      "Highly filtered whey isolate delivering fast-digesting protein with minimal lactose and fat. Supports lean muscle growth, recovery, and convenient daily protein intake.",
    benefits: [
      "Rapid amino acid delivery",
      "Supports muscle protein synthesis",
      "Low lactose and fat",
    ],
    dosage: "25-30g per serving",
    timing: "Post-workout or between meals",
    duration: "Daily",
    ingredients: ["Whey protein isolate", "Sunflower lecithin"],
    contraindications: ["Milk allergy"],
    scientificStudies: [
      {
        title: "Whey protein and muscle recovery overview",
        url: "https://pubmed.ncbi.nlm.nih.gov/?term=whey+protein+muscle+recovery",
        summary:
          "Clinical research supports whey protein for post-exercise recovery.",
      },
    ],
    images: ["https://placehold.co/800x600?text=Whey+Isolate"],
    goals: ["mass", "endurance"],
    popularity: 92,
  },
  {
    name: "Whey Protein Concentrate",
    slug: createSlug("Whey Protein Concentrate"),
    category: "proteins",
    description:
      "Balanced whey concentrate with natural milk fractions for a cost-effective protein source that supports lean mass and recovery.",
    benefits: ["Balanced amino profile", "Supports lean mass", "Great value"],
    dosage: "25-30g per serving",
    timing: "Post-workout or morning",
    duration: "Daily",
    ingredients: ["Whey protein concentrate"],
    contraindications: ["Milk allergy", "Lactose sensitivity"],
    scientificStudies: [
      {
        title: "Protein supplementation and resistance training",
        url: "https://pubmed.ncbi.nlm.nih.gov/?term=protein+supplementation+resistance+training",
        summary:
          "Evidence supports protein intake for strength and hypertrophy.",
      },
    ],
    images: ["https://placehold.co/800x600?text=Whey+Concentrate"],
    goals: ["mass"],
    popularity: 74,
  },
  {
    name: "Casein Protein",
    slug: createSlug("Casein Protein"),
    category: "proteins",
    description:
      "Slow-digesting casein ideal for overnight recovery and sustained amino acid release to reduce muscle breakdown.",
    benefits: [
      "Slow release protein",
      "Night-time recovery",
      "Satiety support",
    ],
    dosage: "25-30g per serving",
    timing: "Before bed",
    duration: "Daily",
    ingredients: ["Micellar casein"],
    contraindications: ["Milk allergy"],
    scientificStudies: [
      {
        title: "Casein and overnight muscle protein synthesis",
        url: "https://pubmed.ncbi.nlm.nih.gov/?term=casein+overnight+protein+synthesis",
        summary: "Studies show casein supports overnight recovery.",
      },
    ],
    images: ["https://placehold.co/800x600?text=Casein"],
    goals: ["mass"],
    popularity: 61,
  },
  {
    name: "Vegan Protein Blend",
    slug: createSlug("Vegan Protein Blend"),
    category: "proteins",
    description:
      "Plant-based blend of pea, rice, and pumpkin seed proteins for a complete amino profile without dairy.",
    benefits: ["Dairy-free", "Complete amino profile", "Easy to digest"],
    dosage: "25-30g per serving",
    timing: "Post-workout or breakfast",
    duration: "Daily",
    ingredients: ["Pea protein", "Rice protein", "Pumpkin seed protein"],
    contraindications: ["Legume sensitivity"],
    scientificStudies: [
      {
        title: "Plant protein for muscle adaptation",
        url: "https://pubmed.ncbi.nlm.nih.gov/?term=plant+protein+muscle+adaptation",
        summary: "Plant protein can support lean mass with adequate intake.",
      },
    ],
    images: ["https://placehold.co/800x600?text=Vegan+Protein"],
    goals: ["mass", "cutting"],
    popularity: 58,
  },
  {
    name: "Creatine Monohydrate",
    slug: createSlug("Creatine Monohydrate"),
    category: "creatine",
    description:
      "Gold-standard creatine with extensive research showing improvements in strength, power, and training volume.",
    benefits: [
      "Strength gains",
      "Improved power output",
      "Muscle cell hydration",
    ],
    dosage: "5g daily",
    timing: "Any time, consistent daily use",
    duration: "Daily",
    ingredients: ["Creatine monohydrate"],
    contraindications: ["Kidney disease without medical supervision"],
    scientificStudies: [
      {
        title: "Creatine monohydrate performance benefits",
        url: "https://pubmed.ncbi.nlm.nih.gov/?term=creatine+monohydrate+performance",
        summary: "Consistent evidence for improved strength and power.",
      },
    ],
    images: ["https://placehold.co/800x600?text=Creatine+Mono"],
    goals: ["mass", "endurance"],
    popularity: 98,
  },
  {
    name: "Creatine HCL",
    slug: createSlug("Creatine HCL"),
    category: "creatine",
    description:
      "Highly soluble creatine form designed for easy mixing and gentle digestion while supporting strength training.",
    benefits: ["Easy mixing", "Supports strength", "Lower serving size"],
    dosage: "2-3g daily",
    timing: "Any time, consistent daily use",
    duration: "Daily",
    ingredients: ["Creatine hydrochloride"],
    contraindications: ["Kidney disease without medical supervision"],
    scientificStudies: [
      {
        title: "Creatine HCL solubility overview",
        url: "https://pubmed.ncbi.nlm.nih.gov/?term=creatine+hcl+solubility",
        summary: "Higher solubility may improve user compliance.",
      },
    ],
    images: ["https://placehold.co/800x600?text=Creatine+HCL"],
    goals: ["mass", "endurance"],
    popularity: 52,
  },
  {
    name: "BCAA 2:1:1",
    slug: createSlug("BCAA 2:1:1"),
    category: "bcaa",
    description:
      "Branched-chain amino acids with a classic 2:1:1 ratio to support training endurance and reduce muscle soreness.",
    benefits: [
      "Supports recovery",
      "Helps reduce soreness",
      "Convenient intra-workout",
    ],
    dosage: "5-10g",
    timing: "During or after workout",
    duration: "Training days",
    ingredients: ["L-Leucine", "L-Isoleucine", "L-Valine"],
    contraindications: ["Consult clinician if pregnant"],
    scientificStudies: [
      {
        title: "BCAA and exercise recovery",
        url: "https://pubmed.ncbi.nlm.nih.gov/?term=bcaa+exercise+recovery",
        summary: "Evidence shows reduced soreness in some training contexts.",
      },
    ],
    images: ["https://placehold.co/800x600?text=BCAA+2:1:1"],
    goals: ["endurance"],
    popularity: 49,
  },
  {
    name: "EAA (Essential Amino Acids)",
    slug: createSlug("EAA Essential Amino Acids"),
    category: "bcaa",
    description:
      "Full spectrum essential amino acids supporting muscle protein synthesis and recovery when whole meals are not available.",
    benefits: [
      "Complete essential amino profile",
      "Supports recovery",
      "Low calorie",
    ],
    dosage: "7-12g",
    timing: "Post-workout or between meals",
    duration: "Training days",
    ingredients: ["Essential amino acid blend"],
    contraindications: ["Consult clinician if pregnant"],
    scientificStudies: [
      {
        title: "Essential amino acids and muscle synthesis",
        url: "https://pubmed.ncbi.nlm.nih.gov/?term=essential+amino+acids+muscle+protein+synthesis",
        summary:
          "EAAs stimulate muscle protein synthesis with adequate dosing.",
      },
    ],
    images: ["https://placehold.co/800x600?text=EAA"],
    goals: ["mass"],
    popularity: 55,
  },
  {
    name: "Caffeine + Beta-Alanine Pre-Workout",
    slug: createSlug("Caffeine Beta-Alanine Pre-Workout"),
    category: "pre-workout",
    description:
      "Performance-focused pre-workout with caffeine for focus and beta-alanine for muscular endurance during high-intensity training.",
    benefits: [
      "Improved focus",
      "Enhanced endurance",
      "Reduced perceived fatigue",
    ],
    dosage: "1 scoop (per label)",
    timing: "20-30 minutes before workout",
    duration: "Training days",
    ingredients: ["Caffeine", "Beta-alanine", "Citrulline malate"],
    contraindications: ["Caffeine sensitivity", "High blood pressure"],
    scientificStudies: [
      {
        title: "Caffeine and exercise performance",
        url: "https://pubmed.ncbi.nlm.nih.gov/?term=caffeine+exercise+performance",
        summary:
          "Caffeine improves alertness and performance for many athletes.",
      },
    ],
    images: ["https://placehold.co/800x600?text=Pre-Workout"],
    goals: ["endurance", "mass"],
    popularity: 86,
  },
  {
    name: "NO (Nitric Oxide) Booster",
    slug: createSlug("NO Booster"),
    category: "pre-workout",
    description:
      "Pump-focused formula with citrulline and arginine to support blood flow and training performance.",
    benefits: [
      "Improved blood flow",
      "Muscle pump support",
      "Workout performance",
    ],
    dosage: "1 scoop (per label)",
    timing: "20-30 minutes before workout",
    duration: "Training days",
    ingredients: ["L-Citrulline", "L-Arginine", "Beetroot extract"],
    contraindications: ["Low blood pressure", "Nitrate medication use"],
    scientificStudies: [
      {
        title: "Citrulline and exercise performance",
        url: "https://pubmed.ncbi.nlm.nih.gov/?term=citrulline+exercise+performance",
        summary: "Citrulline may improve blood flow and endurance.",
      },
    ],
    images: ["https://placehold.co/800x600?text=NO+Booster"],
    goals: ["endurance"],
    popularity: 63,
  },
  {
    name: "L-Glutamine",
    slug: createSlug("L-Glutamine"),
    category: "recovery",
    description:
      "Conditionally essential amino acid that supports recovery and immune function, especially during intense training blocks.",
    benefits: ["Recovery support", "Gut health support", "Immune support"],
    dosage: "5g daily",
    timing: "Post-workout or before bed",
    duration: "Daily",
    ingredients: ["L-Glutamine"],
    contraindications: ["Kidney disease without medical supervision"],
    scientificStudies: [
      {
        title: "Glutamine and exercise recovery",
        url: "https://pubmed.ncbi.nlm.nih.gov/?term=glutamine+exercise+recovery",
        summary: "Evidence supports glutamine for recovery in heavy training.",
      },
    ],
    images: ["https://placehold.co/800x600?text=L-Glutamine"],
    goals: ["endurance"],
    popularity: 45,
  },
  {
    name: "ZMA (Zinc, Magnesium, B6)",
    slug: createSlug("ZMA"),
    category: "recovery",
    description:
      "Night-time mineral complex supporting sleep quality, recovery, and normal testosterone metabolism.",
    benefits: ["Sleep support", "Recovery support", "Mineral replenishment"],
    dosage: "1 serving before bed",
    timing: "Before bed",
    duration: "Daily",
    ingredients: ["Zinc", "Magnesium", "Vitamin B6"],
    contraindications: ["Consult clinician if pregnant"],
    scientificStudies: [
      {
        title: "Magnesium and sleep quality",
        url: "https://pubmed.ncbi.nlm.nih.gov/?term=magnesium+sleep+quality",
        summary: "Magnesium is associated with improved sleep outcomes.",
      },
    ],
    images: ["https://placehold.co/800x600?text=ZMA"],
    goals: ["endurance"],
    popularity: 59,
  },
  {
    name: "Magnesium Glycinate",
    slug: createSlug("Magnesium Glycinate"),
    category: "recovery",
    description:
      "Highly absorbable magnesium form that supports muscle relaxation, stress management, and recovery.",
    benefits: ["Muscle relaxation", "Stress support", "Sleep quality support"],
    dosage: "200-400mg daily",
    timing: "Evening or with meals",
    duration: "Daily",
    ingredients: ["Magnesium glycinate"],
    contraindications: ["Kidney disease without medical supervision"],
    scientificStudies: [
      {
        title: "Magnesium glycinate absorption",
        url: "https://pubmed.ncbi.nlm.nih.gov/?term=magnesium+glycinate+absorption",
        summary: "Chelated magnesium forms show improved tolerance.",
      },
    ],
    images: ["https://placehold.co/800x600?text=Magnesium+Glycinate"],
    goals: ["endurance"],
    popularity: 53,
  },
  {
    name: "Collagen Peptides",
    slug: createSlug("Collagen Peptides"),
    category: "recovery",
    description:
      "Hydrolyzed collagen peptides to support connective tissue, joint comfort, and skin health.",
    benefits: ["Joint support", "Connective tissue support", "Skin health"],
    dosage: "10-15g daily",
    timing: "Morning or between meals",
    duration: "Daily",
    ingredients: ["Hydrolyzed collagen peptides"],
    contraindications: ["Fish or bovine allergies depending on source"],
    scientificStudies: [
      {
        title: "Collagen peptides for joint comfort",
        url: "https://pubmed.ncbi.nlm.nih.gov/?term=collagen+peptides+joint+comfort",
        summary: "Evidence suggests collagen may support joint comfort.",
      },
    ],
    images: ["https://placehold.co/800x600?text=Collagen"],
    goals: ["endurance"],
    popularity: 47,
  },
  {
    name: "Electrolyte Hydration Mix",
    slug: createSlug("Electrolyte Hydration Mix"),
    category: "recovery",
    description:
      "Electrolyte blend with sodium, potassium, and magnesium to support hydration and post-workout recovery.",
    benefits: [
      "Hydration support",
      "Electrolyte replenishment",
      "Reduced cramping risk",
    ],
    dosage: "1 serving in 500-700ml water",
    timing: "During or after workout",
    duration: "Training days",
    ingredients: ["Sodium", "Potassium", "Magnesium", "Citrate"],
    contraindications: ["Kidney disease without medical supervision"],
    scientificStudies: [
      {
        title: "Electrolytes and exercise hydration",
        url: "https://pubmed.ncbi.nlm.nih.gov/?term=electrolyte+hydration+exercise",
        summary: "Electrolyte intake supports fluid balance in training.",
      },
    ],
    images: ["https://placehold.co/800x600?text=Electrolytes"],
    goals: ["endurance"],
    popularity: 51,
  },
];

const complementsData: ComplementSeed[] = [
  {
    name: "Vitamin D3",
    slug: createSlug("Vitamin D3"),
    category: "vitamin",
    description:
      "Essential fat-soluble vitamin supporting bone health, immune function, and muscle performance.",
    biologicalRole: "Regulates calcium absorption and immune signaling.",
    deficiencySymptoms: ["Fatigue", "Low mood", "Bone discomfort"],
    foodSources: [
      { food: "Salmon", quantityPer100g: 10, unit: "mcg" },
      { food: "Egg yolk", quantityPer100g: 2, unit: "mcg" },
    ],
    dailyIntake: {
      men: "15-20 mcg",
      women: "15-20 mcg",
      pregnant: "15-20 mcg",
      athletes: "20 mcg",
    },
    supplementForms: [
      { form: "Cholecalciferol", bioavailability: "High" },
      { form: "Liquid drops", bioavailability: "High" },
    ],
    interactions: ["Corticosteroids may reduce absorption"],
    contraindications: ["Hypercalcemia"],
    images: ["https://placehold.co/800x600?text=Vitamin+D3"],
  },
  {
    name: "Vitamin B Complex",
    slug: createSlug("Vitamin B Complex"),
    category: "vitamin",
    description:
      "Comprehensive B-vitamin blend supporting energy metabolism and nervous system health.",
    biologicalRole:
      "Cofactors for energy production and neurotransmitter synthesis.",
    deficiencySymptoms: ["Fatigue", "Brain fog", "Irritability"],
    foodSources: [
      { food: "Lean beef", quantityPer100g: 2.5, unit: "mcg B12" },
      { food: "Spinach", quantityPer100g: 190, unit: "mcg folate" },
    ],
    dailyIntake: {
      men: "As labeled",
      women: "As labeled",
      pregnant: "Folate 600 mcg",
      athletes: "As labeled",
    },
    supplementForms: [
      { form: "Methylated B-complex", bioavailability: "High" },
      { form: "Standard B-complex", bioavailability: "Moderate" },
    ],
    interactions: ["Certain medications affect B12 absorption"],
    contraindications: ["Consult clinician if taking folate antagonists"],
    images: ["https://placehold.co/800x600?text=Vitamin+B+Complex"],
  },
  {
    name: "Vitamin C",
    slug: createSlug("Vitamin C"),
    category: "vitamin",
    description:
      "Water-soluble antioxidant supporting immune defense, collagen synthesis, and recovery.",
    biologicalRole: "Antioxidant protection and collagen formation.",
    deficiencySymptoms: ["Low immunity", "Slow wound healing"],
    foodSources: [
      { food: "Kiwi", quantityPer100g: 92, unit: "mg" },
      { food: "Bell pepper", quantityPer100g: 127, unit: "mg" },
    ],
    dailyIntake: {
      men: "90 mg",
      women: "75 mg",
      pregnant: "85 mg",
      athletes: "90-120 mg",
    },
    supplementForms: [
      { form: "Ascorbic acid", bioavailability: "High" },
      { form: "Buffered vitamin C", bioavailability: "High" },
    ],
    interactions: ["High doses may affect iron absorption"],
    contraindications: ["Kidney stone risk at very high doses"],
    images: ["https://placehold.co/800x600?text=Vitamin+C"],
  },
  {
    name: "Multivitamin",
    slug: createSlug("Multivitamin"),
    category: "vitamin",
    description:
      "Broad-spectrum multivitamin covering essential micronutrients for daily support.",
    biologicalRole: "Supports foundational nutrient intake.",
    deficiencySymptoms: ["General fatigue", "Low dietary intake"],
    foodSources: [
      {
        food: "Mixed vegetables",
        quantityPer100g: 50,
        unit: "mg micronutrients",
      },
    ],
    dailyIntake: {
      men: "1 serving daily",
      women: "1 serving daily",
      pregnant: "Prenatal formula recommended",
      athletes: "1 serving daily",
    },
    supplementForms: [
      { form: "Tablet", bioavailability: "Moderate" },
      { form: "Capsule", bioavailability: "Moderate" },
    ],
    interactions: ["May interact with thyroid medications"],
    contraindications: ["Consult clinician with medical conditions"],
    images: ["https://placehold.co/800x600?text=Multivitamin"],
  },
  {
    name: "Magnesium",
    slug: createSlug("Magnesium"),
    category: "mineral",
    description:
      "Mineral essential for muscle relaxation, energy production, and nervous system balance.",
    biologicalRole: "Supports ATP production and neuromuscular signaling.",
    deficiencySymptoms: ["Muscle cramps", "Poor sleep", "Fatigue"],
    foodSources: [
      { food: "Pumpkin seeds", quantityPer100g: 262, unit: "mg" },
      { food: "Spinach", quantityPer100g: 79, unit: "mg" },
    ],
    dailyIntake: {
      men: "400-420 mg",
      women: "310-320 mg",
      pregnant: "350-360 mg",
      athletes: "420 mg",
    },
    supplementForms: [
      { form: "Glycinate", bioavailability: "High" },
      { form: "Citrate", bioavailability: "High" },
    ],
    interactions: ["May reduce absorption of certain antibiotics"],
    contraindications: ["Kidney disease without medical supervision"],
    images: ["https://placehold.co/800x600?text=Magnesium"],
  },
  {
    name: "Zinc",
    slug: createSlug("Zinc"),
    category: "mineral",
    description:
      "Trace mineral supporting immune function, hormone balance, and skin health.",
    biologicalRole: "Supports enzyme function and immune response.",
    deficiencySymptoms: ["Low immunity", "Poor wound healing"],
    foodSources: [
      { food: "Oysters", quantityPer100g: 74, unit: "mg" },
      { food: "Beef", quantityPer100g: 5, unit: "mg" },
    ],
    dailyIntake: {
      men: "11 mg",
      women: "8 mg",
      pregnant: "11 mg",
      athletes: "11-15 mg",
    },
    supplementForms: [
      { form: "Zinc picolinate", bioavailability: "High" },
      { form: "Zinc gluconate", bioavailability: "Moderate" },
    ],
    interactions: ["High doses may reduce copper absorption"],
    contraindications: ["Long-term high-dose use without supervision"],
    images: ["https://placehold.co/800x600?text=Zinc"],
  },
  {
    name: "Iron",
    slug: createSlug("Iron"),
    category: "mineral",
    description:
      "Essential mineral for oxygen transport and energy metabolism.",
    biologicalRole: "Core component of hemoglobin and myoglobin.",
    deficiencySymptoms: ["Fatigue", "Pale skin", "Shortness of breath"],
    foodSources: [
      { food: "Lean beef", quantityPer100g: 2.6, unit: "mg" },
      { food: "Lentils", quantityPer100g: 3.3, unit: "mg" },
    ],
    dailyIntake: {
      men: "8 mg",
      women: "18 mg",
      pregnant: "27 mg",
      athletes: "18 mg",
    },
    supplementForms: [
      { form: "Ferrous bisglycinate", bioavailability: "High" },
      { form: "Ferrous sulfate", bioavailability: "Moderate" },
    ],
    interactions: ["Calcium may reduce absorption"],
    contraindications: ["Hemochromatosis"],
    images: ["https://placehold.co/800x600?text=Iron"],
  },
  {
    name: "Calcium",
    slug: createSlug("Calcium"),
    category: "mineral",
    description:
      "Key mineral for bone density, muscle contraction, and nerve signaling.",
    biologicalRole: "Supports skeletal structure and muscle function.",
    deficiencySymptoms: ["Bone weakness", "Muscle cramps"],
    foodSources: [
      { food: "Sardines", quantityPer100g: 382, unit: "mg" },
      { food: "Kale", quantityPer100g: 150, unit: "mg" },
    ],
    dailyIntake: {
      men: "1000 mg",
      women: "1000 mg",
      pregnant: "1000 mg",
      athletes: "1000-1200 mg",
    },
    supplementForms: [
      { form: "Calcium citrate", bioavailability: "High" },
      { form: "Calcium carbonate", bioavailability: "Moderate" },
    ],
    interactions: ["May reduce absorption of iron"],
    contraindications: ["Kidney stones without supervision"],
    images: ["https://placehold.co/800x600?text=Calcium"],
  },
  {
    name: "Omega-3 EPA/DHA",
    slug: createSlug("Omega-3 EPA DHA"),
    category: "omega",
    description:
      "Marine omega-3s supporting cardiovascular health, cognition, and inflammation balance.",
    biologicalRole:
      "Supports cell membrane function and inflammation modulation.",
    deficiencySymptoms: ["Dry skin", "Low focus"],
    foodSources: [
      { food: "Salmon", quantityPer100g: 2.2, unit: "g" },
      { food: "Sardines", quantityPer100g: 1.5, unit: "g" },
    ],
    dailyIntake: {
      men: "250-500 mg EPA/DHA",
      women: "250-500 mg EPA/DHA",
      pregnant: "300-500 mg DHA",
      athletes: "500-1000 mg EPA/DHA",
    },
    supplementForms: [
      { form: "Triglyceride fish oil", bioavailability: "High" },
      { form: "Ethyl ester", bioavailability: "Moderate" },
    ],
    interactions: ["High doses may affect blood thinning"],
    contraindications: ["Bleeding disorders without supervision"],
    images: ["https://placehold.co/800x600?text=Omega-3"],
  },
  {
    name: "Omega 3-6-9",
    slug: createSlug("Omega 3-6-9"),
    category: "omega",
    description:
      "Balanced fatty acid blend supporting general wellness and healthy lipid intake.",
    biologicalRole: "Supports cell membranes and hormone balance.",
    deficiencySymptoms: ["Dry skin", "Low energy"],
    foodSources: [
      { food: "Flaxseed", quantityPer100g: 22, unit: "g ALA" },
      { food: "Sunflower seeds", quantityPer100g: 20, unit: "g omega-6" },
    ],
    dailyIntake: {
      men: "As labeled",
      women: "As labeled",
      pregnant: "As labeled",
      athletes: "As labeled",
    },
    supplementForms: [{ form: "Softgel", bioavailability: "Moderate" }],
    interactions: ["High doses may affect blood thinning"],
    contraindications: ["Bleeding disorders without supervision"],
    images: ["https://placehold.co/800x600?text=Omega+3-6-9"],
  },
  {
    name: "Ashwagandha",
    slug: createSlug("Ashwagandha"),
    category: "adaptogen",
    description:
      "Adaptogenic herb supporting stress resilience, recovery, and sleep quality.",
    biologicalRole: "Modulates stress response and cortisol balance.",
    deficiencySymptoms: ["High stress", "Poor sleep"],
    foodSources: [{ food: "Ashwagandha root", quantityPer100g: 0, unit: "g" }],
    dailyIntake: {
      men: "300-600 mg extract",
      women: "300-600 mg extract",
      pregnant: "Avoid unless supervised",
      athletes: "300-600 mg extract",
    },
    supplementForms: [
      { form: "KSM-66 extract", bioavailability: "High" },
      { form: "Root powder", bioavailability: "Moderate" },
    ],
    interactions: ["May enhance sedative medications"],
    contraindications: ["Pregnancy without supervision"],
    images: ["https://placehold.co/800x600?text=Ashwagandha"],
  },
  {
    name: "Rhodiola Rosea",
    slug: createSlug("Rhodiola Rosea"),
    category: "adaptogen",
    description:
      "Adaptogen that supports mental focus, fatigue resistance, and exercise performance.",
    biologicalRole: "Supports stress response and energy metabolism.",
    deficiencySymptoms: ["Low energy", "Fatigue"],
    foodSources: [{ food: "Rhodiola root", quantityPer100g: 0, unit: "g" }],
    dailyIntake: {
      men: "200-400 mg extract",
      women: "200-400 mg extract",
      pregnant: "Avoid unless supervised",
      athletes: "200-400 mg extract",
    },
    supplementForms: [
      { form: "Standardized extract", bioavailability: "High" },
    ],
    interactions: ["May interact with stimulants"],
    contraindications: ["Pregnancy without supervision"],
    images: ["https://placehold.co/800x600?text=Rhodiola"],
  },
];

const foodsData: FoodSeed[] = [
  {
    name: "Chicken breast",
    slug: createSlug("Chicken breast"),
    category: "meat",
    type: "animal",
    per100g: {
      calories: 165,
      proteins: 31,
      carbs: 0,
      fats: 3.6,
      fiber: 0,
      vitamins: [{ name: "Niacin", amount: 13.7, unit: "mg" }],
      minerals: [{ name: "Selenium", amount: 27.6, unit: "mcg" }],
    },
    benefits: ["High protein", "Low fat"],
    mealIdeas: ["Grilled chicken salad", "Chicken stir-fry"],
    dietaryTags: ["gluten-free"],
    image: "https://placehold.co/800x600?text=Chicken+Breast",
  },
  {
    name: "Turkey breast",
    slug: createSlug("Turkey breast"),
    category: "meat",
    type: "animal",
    per100g: {
      calories: 135,
      proteins: 29,
      carbs: 0,
      fats: 1.6,
      fiber: 0,
      vitamins: [{ name: "Niacin", amount: 10.6, unit: "mg" }],
      minerals: [{ name: "Selenium", amount: 29, unit: "mcg" }],
    },
    benefits: ["Lean protein", "Low fat"],
    mealIdeas: ["Roasted turkey slices", "Turkey lettuce wraps"],
    dietaryTags: ["gluten-free"],
    image: "https://placehold.co/800x600?text=Turkey+Breast",
  },
  {
    name: "Lean beef",
    slug: createSlug("Lean beef"),
    category: "meat",
    type: "animal",
    per100g: {
      calories: 170,
      proteins: 26,
      carbs: 0,
      fats: 7,
      fiber: 0,
      vitamins: [{ name: "Vitamin B12", amount: 2.5, unit: "mcg" }],
      minerals: [{ name: "Iron", amount: 2.6, unit: "mg" }],
    },
    benefits: ["Iron rich", "Supports strength"],
    mealIdeas: ["Lean beef stir-fry", "Beef and quinoa bowl"],
    dietaryTags: ["gluten-free"],
    image: "https://placehold.co/800x600?text=Lean+Beef",
  },
  {
    name: "Pork loin",
    slug: createSlug("Pork loin"),
    category: "meat",
    type: "animal",
    per100g: {
      calories: 143,
      proteins: 27,
      carbs: 0,
      fats: 3.5,
      fiber: 0,
      vitamins: [{ name: "Thiamin", amount: 0.9, unit: "mg" }],
      minerals: [{ name: "Phosphorus", amount: 230, unit: "mg" }],
    },
    benefits: ["Lean protein", "B-vitamin support"],
    mealIdeas: ["Pork loin roast", "Pork lettuce bowls"],
    dietaryTags: ["gluten-free"],
    image: "https://placehold.co/800x600?text=Pork+Loin",
  },
  {
    name: "Salmon",
    slug: createSlug("Salmon"),
    category: "fish",
    type: "animal",
    per100g: {
      calories: 200,
      proteins: 25,
      carbs: 0,
      fats: 13,
      fiber: 0,
      vitamins: [{ name: "Vitamin D", amount: 10, unit: "mcg" }],
      minerals: [{ name: "Potassium", amount: 363, unit: "mg" }],
    },
    benefits: ["Omega-3 rich", "High protein"],
    mealIdeas: ["Baked salmon", "Salmon poke bowl"],
    dietaryTags: ["gluten-free"],
    image: "https://placehold.co/800x600?text=Salmon",
  },
  {
    name: "Tuna (canned)",
    slug: createSlug("Tuna canned"),
    category: "fish",
    type: "animal",
    per100g: {
      calories: 116,
      proteins: 26,
      carbs: 0,
      fats: 0.8,
      fiber: 0,
      vitamins: [{ name: "Vitamin B12", amount: 2.5, unit: "mcg" }],
      minerals: [{ name: "Selenium", amount: 80, unit: "mcg" }],
    },
    benefits: ["High protein", "Low fat"],
    mealIdeas: ["Tuna salad", "Tuna rice bowl"],
    dietaryTags: ["gluten-free"],
    image: "https://placehold.co/800x600?text=Tuna",
  },
  {
    name: "Tilapia",
    slug: createSlug("Tilapia"),
    category: "fish",
    type: "animal",
    per100g: {
      calories: 128,
      proteins: 26,
      carbs: 0,
      fats: 2.7,
      fiber: 0,
      vitamins: [{ name: "Niacin", amount: 4.7, unit: "mg" }],
      minerals: [{ name: "Phosphorus", amount: 204, unit: "mg" }],
    },
    benefits: ["Lean protein", "Easy to digest"],
    mealIdeas: ["Grilled tilapia", "Tilapia tacos"],
    dietaryTags: ["gluten-free"],
    image: "https://placehold.co/800x600?text=Tilapia",
  },
  {
    name: "Sardines",
    slug: createSlug("Sardines"),
    category: "fish",
    type: "animal",
    per100g: {
      calories: 208,
      proteins: 25,
      carbs: 0,
      fats: 11,
      fiber: 0,
      vitamins: [{ name: "Vitamin D", amount: 4.8, unit: "mcg" }],
      minerals: [{ name: "Calcium", amount: 382, unit: "mg" }],
    },
    benefits: ["Omega-3 rich", "Calcium source"],
    mealIdeas: ["Sardine toast", "Sardine salad"],
    dietaryTags: ["gluten-free"],
    image: "https://placehold.co/800x600?text=Sardines",
  },
  {
    name: "Greek yogurt",
    slug: createSlug("Greek yogurt"),
    category: "dairy",
    type: "animal",
    per100g: {
      calories: 60,
      proteins: 10,
      carbs: 3.6,
      fats: 0.4,
      fiber: 0,
      vitamins: [{ name: "Vitamin B12", amount: 0.75, unit: "mcg" }],
      minerals: [{ name: "Calcium", amount: 110, unit: "mg" }],
    },
    benefits: ["High protein", "Gut-friendly"],
    mealIdeas: ["Greek yogurt parfait", "Savory yogurt dip"],
    dietaryTags: ["vegetarian", "gluten-free"],
    image: "https://placehold.co/800x600?text=Greek+Yogurt",
  },
  {
    name: "Cottage cheese",
    slug: createSlug("Cottage cheese"),
    category: "dairy",
    type: "animal",
    per100g: {
      calories: 98,
      proteins: 11,
      carbs: 3.4,
      fats: 4.3,
      fiber: 0,
      vitamins: [{ name: "Vitamin B12", amount: 0.7, unit: "mcg" }],
      minerals: [{ name: "Calcium", amount: 83, unit: "mg" }],
    },
    benefits: ["Slow-digesting protein", "Satiety support"],
    mealIdeas: ["Cottage cheese bowl", "Cottage cheese toast"],
    dietaryTags: ["vegetarian", "gluten-free"],
    image: "https://placehold.co/800x600?text=Cottage+Cheese",
  },
  {
    name: "Whole eggs",
    slug: createSlug("Whole eggs"),
    category: "eggs",
    type: "animal",
    per100g: {
      calories: 155,
      proteins: 13,
      carbs: 1.1,
      fats: 11,
      fiber: 0,
      vitamins: [{ name: "Vitamin D", amount: 2, unit: "mcg" }],
      minerals: [{ name: "Selenium", amount: 30, unit: "mcg" }],
    },
    benefits: ["Complete protein", "Nutrient-dense"],
    mealIdeas: ["Omelet", "Hard-boiled eggs"],
    dietaryTags: ["gluten-free"],
    image: "https://placehold.co/800x600?text=Whole+Eggs",
  },
  {
    name: "Egg whites",
    slug: createSlug("Egg whites"),
    category: "eggs",
    type: "animal",
    per100g: {
      calories: 52,
      proteins: 11,
      carbs: 0.7,
      fats: 0.2,
      fiber: 0,
      vitamins: [{ name: "Riboflavin", amount: 0.4, unit: "mg" }],
      minerals: [{ name: "Potassium", amount: 163, unit: "mg" }],
    },
    benefits: ["Low fat protein", "Easy to digest"],
    mealIdeas: ["Egg white scramble", "Protein pancakes"],
    dietaryTags: ["gluten-free"],
    image: "https://placehold.co/800x600?text=Egg+Whites",
  },
  {
    name: "Lentils",
    slug: createSlug("Lentils"),
    category: "legumes",
    type: "vegetal",
    per100g: {
      calories: 116,
      proteins: 9,
      carbs: 20,
      fats: 0.4,
      fiber: 8,
      vitamins: [{ name: "Folate", amount: 181, unit: "mcg" }],
      minerals: [{ name: "Iron", amount: 3.3, unit: "mg" }],
    },
    benefits: ["High fiber", "Plant protein"],
    mealIdeas: ["Lentil soup", "Lentil salad"],
    dietaryTags: ["vegan", "gluten-free"],
    image: "https://placehold.co/800x600?text=Lentils",
  },
  {
    name: "Chickpeas",
    slug: createSlug("Chickpeas"),
    category: "legumes",
    type: "vegetal",
    per100g: {
      calories: 164,
      proteins: 9,
      carbs: 27,
      fats: 2.6,
      fiber: 7.6,
      vitamins: [{ name: "Folate", amount: 172, unit: "mcg" }],
      minerals: [{ name: "Manganese", amount: 1, unit: "mg" }],
    },
    benefits: ["Plant protein", "Satiety support"],
    mealIdeas: ["Hummus", "Chickpea curry"],
    dietaryTags: ["vegan", "gluten-free"],
    image: "https://placehold.co/800x600?text=Chickpeas",
  },
  {
    name: "Black beans",
    slug: createSlug("Black beans"),
    category: "legumes",
    type: "vegetal",
    per100g: {
      calories: 132,
      proteins: 8.9,
      carbs: 23.7,
      fats: 0.5,
      fiber: 8.7,
      vitamins: [{ name: "Folate", amount: 149, unit: "mcg" }],
      minerals: [{ name: "Magnesium", amount: 70, unit: "mg" }],
    },
    benefits: ["High fiber", "Plant protein"],
    mealIdeas: ["Bean salad", "Black bean tacos"],
    dietaryTags: ["vegan", "gluten-free"],
    image: "https://placehold.co/800x600?text=Black+Beans",
  },
  {
    name: "Soybeans",
    slug: createSlug("Soybeans"),
    category: "legumes",
    type: "vegetal",
    per100g: {
      calories: 173,
      proteins: 16.6,
      carbs: 9.9,
      fats: 9,
      fiber: 6,
      vitamins: [{ name: "Vitamin K", amount: 47, unit: "mcg" }],
      minerals: [{ name: "Iron", amount: 3.6, unit: "mg" }],
    },
    benefits: ["Complete plant protein", "Healthy fats"],
    mealIdeas: ["Edamame bowl", "Stir-fried soybeans"],
    dietaryTags: ["vegan", "gluten-free"],
    image: "https://placehold.co/800x600?text=Soybeans",
  },
  {
    name: "Oats",
    slug: createSlug("Oats"),
    category: "grains",
    type: "vegetal",
    per100g: {
      calories: 389,
      proteins: 13,
      carbs: 66,
      fats: 7,
      fiber: 10.6,
      vitamins: [{ name: "Thiamin", amount: 0.76, unit: "mg" }],
      minerals: [{ name: "Magnesium", amount: 177, unit: "mg" }],
    },
    benefits: ["Sustained energy", "High fiber"],
    mealIdeas: ["Overnight oats", "Oatmeal bowl"],
    dietaryTags: ["vegetarian"],
    image: "https://placehold.co/800x600?text=Oats",
  },
  {
    name: "Brown rice",
    slug: createSlug("Brown rice"),
    category: "grains",
    type: "vegetal",
    per100g: {
      calories: 123,
      proteins: 2.7,
      carbs: 25.6,
      fats: 1,
      fiber: 1.8,
      vitamins: [{ name: "Niacin", amount: 2.6, unit: "mg" }],
      minerals: [{ name: "Manganese", amount: 1.1, unit: "mg" }],
    },
    benefits: ["Complex carbs", "Micronutrient rich"],
    mealIdeas: ["Brown rice bowl", "Rice with vegetables"],
    dietaryTags: ["vegan", "gluten-free"],
    image: "https://placehold.co/800x600?text=Brown+Rice",
  },
  {
    name: "Quinoa",
    slug: createSlug("Quinoa"),
    category: "grains",
    type: "vegetal",
    per100g: {
      calories: 120,
      proteins: 4.4,
      carbs: 21.3,
      fats: 1.9,
      fiber: 2.8,
      vitamins: [{ name: "Folate", amount: 42, unit: "mcg" }],
      minerals: [{ name: "Magnesium", amount: 64, unit: "mg" }],
    },
    benefits: ["Complete plant protein", "Gluten-free"],
    mealIdeas: ["Quinoa salad", "Quinoa bowl"],
    dietaryTags: ["vegan", "gluten-free"],
    image: "https://placehold.co/800x600?text=Quinoa",
  },
  {
    name: "Almonds",
    slug: createSlug("Almonds"),
    category: "nuts",
    type: "vegetal",
    per100g: {
      calories: 579,
      proteins: 21,
      carbs: 22,
      fats: 50,
      fiber: 12.5,
      vitamins: [{ name: "Vitamin E", amount: 25.6, unit: "mg" }],
      minerals: [{ name: "Magnesium", amount: 268, unit: "mg" }],
    },
    benefits: ["Healthy fats", "Vitamin E source"],
    mealIdeas: ["Almond snack", "Almond butter toast"],
    dietaryTags: ["vegan", "gluten-free"],
    image: "https://placehold.co/800x600?text=Almonds",
  },
  {
    name: "Walnuts",
    slug: createSlug("Walnuts"),
    category: "nuts",
    type: "vegetal",
    per100g: {
      calories: 654,
      proteins: 15,
      carbs: 14,
      fats: 65,
      fiber: 6.7,
      vitamins: [{ name: "Vitamin B6", amount: 0.5, unit: "mg" }],
      minerals: [{ name: "Copper", amount: 1.6, unit: "mg" }],
    },
    benefits: ["Omega-3 ALA source", "Brain health support"],
    mealIdeas: ["Walnut snack", "Walnut salad topper"],
    dietaryTags: ["vegan", "gluten-free"],
    image: "https://placehold.co/800x600?text=Walnuts",
  },
  {
    name: "Broccoli",
    slug: createSlug("Broccoli"),
    category: "vegetable",
    type: "vegetal",
    per100g: {
      calories: 35,
      proteins: 2.8,
      carbs: 7.2,
      fats: 0.4,
      fiber: 2.6,
      vitamins: [{ name: "Vitamin C", amount: 89, unit: "mg" }],
      minerals: [{ name: "Potassium", amount: 316, unit: "mg" }],
    },
    benefits: ["Antioxidants", "High fiber"],
    mealIdeas: ["Steamed broccoli", "Broccoli stir-fry"],
    dietaryTags: ["vegan", "gluten-free"],
    image: "https://placehold.co/800x600?text=Broccoli",
  },
  {
    name: "Spinach",
    slug: createSlug("Spinach"),
    category: "vegetable",
    type: "vegetal",
    per100g: {
      calories: 23,
      proteins: 2.9,
      carbs: 3.6,
      fats: 0.4,
      fiber: 2.2,
      vitamins: [{ name: "Vitamin K", amount: 483, unit: "mcg" }],
      minerals: [{ name: "Iron", amount: 2.7, unit: "mg" }],
    },
    benefits: ["Micronutrient dense", "Low calorie"],
    mealIdeas: ["Spinach salad", "Green smoothie"],
    dietaryTags: ["vegan", "gluten-free"],
    image: "https://placehold.co/800x600?text=Spinach",
  },
  {
    name: "Kale",
    slug: createSlug("Kale"),
    category: "vegetable",
    type: "vegetal",
    per100g: {
      calories: 49,
      proteins: 4.3,
      carbs: 8.8,
      fats: 0.9,
      fiber: 3.6,
      vitamins: [{ name: "Vitamin A", amount: 500, unit: "mcg" }],
      minerals: [{ name: "Calcium", amount: 150, unit: "mg" }],
    },
    benefits: ["Antioxidant rich", "Supports bone health"],
    mealIdeas: ["Kale chips", "Kale salad"],
    dietaryTags: ["vegan", "gluten-free"],
    image: "https://placehold.co/800x600?text=Kale",
  },
  {
    name: "Banana",
    slug: createSlug("Banana"),
    category: "fruit",
    type: "vegetal",
    per100g: {
      calories: 89,
      proteins: 1.1,
      carbs: 22.8,
      fats: 0.3,
      fiber: 2.6,
      vitamins: [{ name: "Vitamin B6", amount: 0.4, unit: "mg" }],
      minerals: [{ name: "Potassium", amount: 358, unit: "mg" }],
    },
    benefits: ["Quick energy", "Potassium source"],
    mealIdeas: ["Banana smoothie", "Banana oatmeal"],
    dietaryTags: ["vegan", "gluten-free"],
    image: "https://placehold.co/800x600?text=Banana",
  },
  {
    name: "Apple",
    slug: createSlug("Apple"),
    category: "fruit",
    type: "vegetal",
    per100g: {
      calories: 52,
      proteins: 0.3,
      carbs: 14,
      fats: 0.2,
      fiber: 2.4,
      vitamins: [{ name: "Vitamin C", amount: 4.6, unit: "mg" }],
      minerals: [{ name: "Potassium", amount: 107, unit: "mg" }],
    },
    benefits: ["Fiber support", "Hydration"],
    mealIdeas: ["Apple slices", "Apple cinnamon snack"],
    dietaryTags: ["vegan", "gluten-free"],
    image: "https://placehold.co/800x600?text=Apple",
  },
  {
    name: "Blueberries",
    slug: createSlug("Blueberries"),
    category: "fruit",
    type: "vegetal",
    per100g: {
      calories: 57,
      proteins: 0.7,
      carbs: 14.5,
      fats: 0.3,
      fiber: 2.4,
      vitamins: [{ name: "Vitamin C", amount: 9.7, unit: "mg" }],
      minerals: [{ name: "Manganese", amount: 0.3, unit: "mg" }],
    },
    benefits: ["Antioxidant support", "Brain health"],
    mealIdeas: ["Blueberry smoothie", "Yogurt topping"],
    dietaryTags: ["vegan", "gluten-free"],
    image: "https://placehold.co/800x600?text=Blueberries",
  },
  {
    name: "Avocado",
    slug: createSlug("Avocado"),
    category: "fats",
    type: "vegetal",
    per100g: {
      calories: 160,
      proteins: 2,
      carbs: 8.5,
      fats: 14.7,
      fiber: 6.7,
      vitamins: [{ name: "Vitamin E", amount: 2.1, unit: "mg" }],
      minerals: [{ name: "Potassium", amount: 485, unit: "mg" }],
    },
    benefits: ["Healthy fats", "High fiber"],
    mealIdeas: ["Avocado toast", "Guacamole"],
    dietaryTags: ["vegan", "gluten-free"],
    image: "https://placehold.co/800x600?text=Avocado",
  },
  {
    name: "Olive oil",
    slug: createSlug("Olive oil"),
    category: "fats",
    type: "vegetal",
    per100g: {
      calories: 884,
      proteins: 0,
      carbs: 0,
      fats: 100,
      fiber: 0,
      vitamins: [{ name: "Vitamin E", amount: 14.4, unit: "mg" }],
      minerals: [{ name: "Polyphenols", amount: 0.2, unit: "g" }],
    },
    benefits: ["Heart-healthy fats", "Anti-inflammatory"],
    mealIdeas: ["Salad dressing", "Cooking oil"],
    dietaryTags: ["vegan", "gluten-free"],
    image: "https://placehold.co/800x600?text=Olive+Oil",
  },
  {
    name: "Coconut oil",
    slug: createSlug("Coconut oil"),
    category: "fats",
    type: "vegetal",
    per100g: {
      calories: 862,
      proteins: 0,
      carbs: 0,
      fats: 100,
      fiber: 0,
      vitamins: [{ name: "Vitamin E", amount: 0.1, unit: "mg" }],
      minerals: [{ name: "Iron", amount: 0.1, unit: "mg" }],
    },
    benefits: ["Energy source", "Cooking stability"],
    mealIdeas: ["Cooking oil", "Baking ingredient"],
    dietaryTags: ["vegan", "gluten-free"],
    image: "https://placehold.co/800x600?text=Coconut+Oil",
  },
];

const seedDatabase = async (): Promise<void> => {
  try {
    await connectDatabase();

    console.log("Clearing existing data...");
    await Promise.all([
      Supplement.deleteMany({}),
      Complement.deleteMany({}),
      Food.deleteMany({}),
      Conversation.deleteMany({}),
    ]);

    console.log("Seeding supplements...");
    await Supplement.insertMany(supplementsData);

    console.log("Seeding complements...");
    await Complement.insertMany(complementsData);

    console.log("Seeding foods...");
    await Food.insertMany(foodsData);

    console.log("✅ Database seeded successfully!");
    console.log(
      `Created: ${supplementsData.length} supplements, ${complementsData.length} complements, ${foodsData.length} foods`,
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
};

void seedDatabase();
