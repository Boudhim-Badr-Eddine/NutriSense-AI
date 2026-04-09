import slugify from 'slugify';

import { connectDatabase } from '../config/database';
import { Complement, ComplementCategory } from '../models/Complement';

interface ComplementSeed {
  name: string;
  slug: string;
  category: ComplementCategory;
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

const createSlug = (name: string): string =>
  slugify(name, { lower: true, strict: true, trim: true });

const complementsData: ComplementSeed[] = [
  {
    name: 'Vitamin D3',
    slug: createSlug('Vitamin D3'),
    category: 'vitamin',
    description:
      'Essential fat-soluble vitamin that supports bone strength, immune resilience, hormonal health, and athletic recovery.',
    biologicalRole:
      'Regulates calcium absorption, supports immune function, bone health, and testosterone production',
    deficiencySymptoms: [
      'Fatigue',
      'Bone pain',
      'Muscle weakness',
      'Depression',
      'Frequent illness',
    ],
    foodSources: [
      { food: 'Salmon', quantityPer100g: 570, unit: 'IU' },
      { food: 'Egg yolk', quantityPer100g: 44, unit: 'IU' },
      { food: 'Fortified milk', quantityPer100g: 40, unit: 'IU' },
    ],
    dailyIntake: {
      men: '600-2000 IU',
      women: '600-2000 IU',
      pregnant: '1500-2000 IU',
      athletes: '2000-5000 IU',
    },
    supplementForms: [
      {
        form: 'D3 (Cholecalciferol)',
        bioavailability: 'Superior - raises blood levels more effectively',
      },
      {
        form: 'D2 (Ergocalciferol)',
        bioavailability: 'Less effective, plant-based',
      },
    ],
    interactions: [
      'Enhances calcium absorption',
      'Works synergistically with Vitamin K2',
      'May interact with steroids',
    ],
    contraindications: ['Hypercalcemia', 'Sarcoidosis', 'Kidney disease'],
    images: ['/images/complements/vitamin-d3.jpg'],
  },
  {
    name: 'Magnesium Citrate',
    slug: createSlug('Magnesium Citrate'),
    category: 'mineral',
    description:
      'Highly bioavailable magnesium form that supports muscular function, sleep quality, stress management, and recovery.',
    biologicalRole:
      'Involved in 300+ enzyme reactions, muscle contraction, nerve function, energy production, protein synthesis',
    deficiencySymptoms: [
      'Muscle cramps',
      'Anxiety',
      'Poor sleep',
      'Fatigue',
      'Headaches',
      'Heart palpitations',
    ],
    foodSources: [
      { food: 'Dark chocolate', quantityPer100g: 228, unit: 'mg' },
      { food: 'Almonds', quantityPer100g: 270, unit: 'mg' },
      { food: 'Spinach', quantityPer100g: 79, unit: 'mg' },
    ],
    dailyIntake: {
      men: '400-420mg',
      women: '310-320mg',
      pregnant: '350-360mg',
      athletes: '400-500mg',
    },
    supplementForms: [
      { form: 'Citrate', bioavailability: 'High - best absorbed form' },
      { form: 'Glycinate', bioavailability: 'High - gentle on stomach' },
      { form: 'Oxide', bioavailability: 'Low - cheap but poorly absorbed' },
    ],
    interactions: [
      'May reduce absorption of some antibiotics',
      'Zinc can compete for absorption',
    ],
    contraindications: ['Kidney failure', 'Myasthenia gravis', 'Heart block'],
    images: ['/images/complements/magnesium-citrate.jpg'],
  },
  {
    name: 'Vitamin C',
    slug: createSlug('Vitamin C'),
    category: 'vitamin',
    description:
      'Powerful antioxidant vitamin that supports immunity, collagen production, and faster adaptation to training stress.',
    biologicalRole:
      'Powerful antioxidant, collagen synthesis, immune enhancement, iron absorption, wound healing',
    deficiencySymptoms: [
      'Fatigue',
      'Gum bleeding',
      'Easy bruising',
      'Slow wound healing',
      'Scurvy (severe)',
    ],
    foodSources: [
      { food: 'Bell peppers', quantityPer100g: 128, unit: 'mg' },
      { food: 'Kiwi', quantityPer100g: 93, unit: 'mg' },
      { food: 'Oranges', quantityPer100g: 53, unit: 'mg' },
    ],
    dailyIntake: {
      men: '90mg',
      women: '75mg',
      pregnant: '85mg',
      athletes: '200-1000mg',
    },
    supplementForms: [
      { form: 'Ascorbic acid', bioavailability: 'Standard, well absorbed' },
      {
        form: 'Liposomal C',
        bioavailability: 'Superior - higher cellular uptake',
      },
      { form: 'Sodium ascorbate', bioavailability: 'Good, gentle on stomach' },
    ],
    interactions: [
      'Enhances iron absorption',
      'Works with Vitamin E as antioxidant network',
      'High doses may interfere with B12',
    ],
    contraindications: [
      'Kidney stones (high doses)',
      'Hemochromatosis',
      'G6PD deficiency',
    ],
    images: ['/images/complements/vitamin-c.jpg'],
  },
  {
    name: 'Zinc',
    slug: createSlug('Zinc'),
    category: 'mineral',
    description:
      'Essential trace mineral for immune defense, hormonal balance, tissue repair, and high-performance metabolism.',
    biologicalRole:
      'Immune function, wound healing, testosterone production, protein synthesis, DNA repair, taste and smell',
    deficiencySymptoms: [
      'Frequent infections',
      'Hair loss',
      'Loss of taste/smell',
      'Slow wound healing',
      'Low testosterone',
    ],
    foodSources: [
      { food: 'Oysters', quantityPer100g: 78, unit: 'mg' },
      { food: 'Beef', quantityPer100g: 12, unit: 'mg' },
      { food: 'Pumpkin seeds', quantityPer100g: 8, unit: 'mg' },
    ],
    dailyIntake: {
      men: '11mg',
      women: '8mg',
      pregnant: '11mg',
      athletes: '15-25mg',
    },
    supplementForms: [
      { form: 'Zinc gluconate', bioavailability: 'Good - commonly used' },
      { form: 'Zinc picolinate', bioavailability: 'Superior absorption' },
      { form: 'Zinc oxide', bioavailability: 'Poor' },
    ],
    interactions: [
      'Competes with copper absorption',
      'Reduces absorption if taken with calcium',
      'Phytates in grains reduce zinc absorption',
    ],
    contraindications: [
      'High doses can cause copper deficiency',
      'Avoid with certain antibiotics',
    ],
    images: ['/images/complements/zinc.jpg'],
  },
  {
    name: 'Omega-3 (EPA/DHA)',
    slug: createSlug('Omega-3 EPA DHA'),
    category: 'omega',
    description:
      'Essential fatty acid support for cardiovascular performance, anti-inflammatory response, cognition, and recovery.',
    biologicalRole:
      'Anti-inflammatory, cardiovascular health, brain function, joint lubrication, hormone production',
    deficiencySymptoms: [
      'Dry skin',
      'Poor memory',
      'Joint pain',
      'Depression',
      'Poor heart health markers',
    ],
    foodSources: [
      { food: 'Salmon', quantityPer100g: 2260, unit: 'mg' },
      { food: 'Mackerel', quantityPer100g: 5134, unit: 'mg' },
      { food: 'Walnuts', quantityPer100g: 2570, unit: 'mg' },
    ],
    dailyIntake: {
      men: '1.6g ALA / 500mg EPA+DHA',
      women: '1.1g ALA / 500mg EPA+DHA',
      pregnant: '1.4g + 200mg DHA extra',
      athletes: '2-3g EPA+DHA',
    },
    supplementForms: [
      { form: 'Fish oil (triglyceride)', bioavailability: 'Good with meals' },
      { form: 'Krill oil', bioavailability: 'Superior - phospholipid form' },
      { form: 'Algae oil', bioavailability: 'Good - vegan source of DHA' },
    ],
    interactions: [
      'Blood thinners (warfarin)',
      'Aspirin interaction at high doses',
    ],
    contraindications: [
      'Fish/shellfish allergy',
      'Before surgery',
      'Active bleeding disorders',
    ],
    images: ['/images/complements/omega-3-epa-dha.jpg'],
  },
  {
    name: 'Vitamin B12',
    slug: createSlug('Vitamin B12'),
    category: 'vitamin',
    description:
      'Critical B vitamin for red blood cell formation, cognitive function, and sustained energy metabolism.',
    biologicalRole:
      'Red blood cell formation, neurological function, DNA synthesis, energy metabolism',
    deficiencySymptoms: [
      'Fatigue and weakness',
      'Numbness in hands/feet',
      'Memory problems',
      'Depression',
      'Anemia',
    ],
    foodSources: [
      { food: 'Beef liver', quantityPer100g: 70, unit: 'mcg' },
      { food: 'Clams', quantityPer100g: 98, unit: 'mcg' },
      { food: 'Sardines', quantityPer100g: 8.9, unit: 'mcg' },
    ],
    dailyIntake: {
      men: '2.4mcg',
      women: '2.4mcg',
      pregnant: '2.6mcg',
      athletes: '2.4-3mcg',
    },
    supplementForms: [
      {
        form: 'Methylcobalamin',
        bioavailability: 'Best - active form, stays in body longer',
      },
      {
        form: 'Cyanocobalamin',
        bioavailability: 'Good - synthetic, widely used',
      },
      {
        form: 'Adenosylcobalamin',
        bioavailability: 'Good - mitochondrial form',
      },
    ],
    interactions: [
      'Metformin reduces B12 absorption',
      'Proton pump inhibitors reduce absorption',
      'Works with folate for homocysteine metabolism',
    ],
    contraindications: ['Leber disease', 'Cobalt allergy (rare)'],
    images: ['/images/complements/vitamin-b12.jpg'],
  },
  {
    name: 'Iron',
    slug: createSlug('Iron'),
    category: 'mineral',
    description:
      'Essential mineral for oxygen transport, cellular energy, and reducing fatigue linked to low ferritin status.',
    biologicalRole:
      'Oxygen transport in hemoglobin, energy production, immune function, cognitive performance',
    deficiencySymptoms: [
      'Extreme fatigue',
      'Pale skin',
      'Shortness of breath',
      'Cold hands/feet',
      'Brittle nails',
      'Iron deficiency anemia',
    ],
    foodSources: [
      { food: 'Beef liver', quantityPer100g: 6.5, unit: 'mg' },
      { food: 'Lentils', quantityPer100g: 3.3, unit: 'mg' },
      { food: 'Spinach', quantityPer100g: 2.7, unit: 'mg' },
    ],
    dailyIntake: {
      men: '8mg',
      women: '18mg (27mg pregnant)',
      pregnant: '27mg',
      athletes: 'Up to 30mg for female athletes',
    },
    supplementForms: [
      {
        form: 'Ferrous sulfate',
        bioavailability: 'Standard, may cause GI issues',
      },
      {
        form: 'Ferrous bisglycinate',
        bioavailability: 'Superior - gentle on stomach',
      },
      { form: 'Ferric iron', bioavailability: 'Lower absorption' },
    ],
    interactions: [
      'Vitamin C dramatically increases absorption',
      'Calcium inhibits absorption',
      'Tea/coffee reduce absorption',
    ],
    contraindications: [
      'Hemochromatosis',
      'Never supplement without confirmed deficiency',
      'Avoid with certain antibiotics',
    ],
    images: ['/images/complements/iron.jpg'],
  },
  {
    name: 'Ashwagandha',
    slug: createSlug('Ashwagandha'),
    category: 'adaptogen',
    description:
      'Adaptogenic herb used to support stress resilience, hormonal balance, performance recovery, and sleep quality.',
    biologicalRole:
      'Cortisol regulation, stress adaptation, testosterone support, thyroid function, neuroprotection',
    deficiencySymptoms: [
      'Not applicable - adaptogen not an essential nutrient',
    ],
    foodSources: [{ food: 'Ashwagandha root (herb)', quantityPer100g: 0, unit: 'mg' }],
    dailyIntake: {
      men: '300-600mg extract',
      women: '300mg extract',
      pregnant: 'Avoid - contraindicated',
      athletes: '500-600mg KSM-66',
    },
    supplementForms: [
      {
        form: 'KSM-66 (root extract)',
        bioavailability: 'Gold standard - 5% withanolides',
      },
      {
        form: 'Sensoril (root+leaf)',
        bioavailability: 'High withanolide content',
      },
      {
        form: 'Raw powder',
        bioavailability: 'Lower - less standardized',
      },
    ],
    interactions: [
      'May potentiate thyroid medication',
      'Sedative interaction',
      'Immunosuppressant interaction',
    ],
    contraindications: [
      'Pregnancy',
      'Autoimmune diseases (MS, lupus, RA)',
      'Thyroid disorders without supervision',
    ],
    images: ['/images/complements/ashwagandha.jpg'],
  },
  {
    name: 'Vitamin B Complex',
    slug: createSlug('Vitamin B Complex'),
    category: 'vitamin',
    description:
      'Comprehensive B-vitamin formula to support energy pathways, nervous system health, and micronutrient sufficiency.',
    biologicalRole:
      'Energy metabolism, red blood cell production, nerve function, homocysteine regulation, skin and hair health',
    deficiencySymptoms: [
      'Fatigue',
      'Mouth sores',
      'Dermatitis',
      'Depression',
      'Numbness',
      'Brain fog',
    ],
    foodSources: [
      { food: 'Nutritional yeast', quantityPer100g: 40, unit: 'mg B vitamins' },
      { food: 'Beef liver', quantityPer100g: 15, unit: 'mg' },
      { food: 'Eggs', quantityPer100g: 2, unit: 'mg' },
    ],
    dailyIntake: {
      men: 'Varies per B vitamin',
      women: 'Varies per B vitamin',
      pregnant: 'Increased B9 (folate) 600mcg',
      athletes: '1.5-2x RDA due to energy demands',
    },
    supplementForms: [
      {
        form: 'B-Complex (balanced formula)',
        bioavailability: 'Good - contains all 8 B vitamins',
      },
      {
        form: 'Methylated B-Complex',
        bioavailability: 'Superior for MTHFR gene variants',
      },
    ],
    interactions: [
      'Alcohol depletes B vitamins significantly',
      'Some medications (metformin, PPIs) deplete B12',
    ],
    contraindications: [
      'High-dose B6 long-term can cause neuropathy',
      'B3 (niacin) flush at high doses',
    ],
    images: ['/images/complements/vitamin-b-complex.jpg'],
  },
  {
    name: 'Calcium',
    slug: createSlug('Calcium'),
    category: 'mineral',
    description:
      'Fundamental mineral for skeletal integrity, neuromuscular signaling, and long-term bone density protection.',
    biologicalRole:
      'Bone and teeth structure, muscle contraction, nerve transmission, blood clotting, hormone secretion',
    deficiencySymptoms: [
      'Muscle cramps',
      'Brittle nails',
      'Osteoporosis',
      'Dental problems',
      'Numbness in fingers',
    ],
    foodSources: [
      { food: 'Parmesan cheese', quantityPer100g: 1184, unit: 'mg' },
      { food: 'Sardines (with bones)', quantityPer100g: 382, unit: 'mg' },
      { food: 'Kale', quantityPer100g: 150, unit: 'mg' },
    ],
    dailyIntake: {
      men: '1000mg',
      women: '1000-1200mg',
      pregnant: '1300mg',
      athletes: '1000-1200mg',
    },
    supplementForms: [
      {
        form: 'Calcium citrate',
        bioavailability: 'Best absorbed - can take without food',
      },
      {
        form: 'Calcium carbonate',
        bioavailability: 'Requires stomach acid - take with food',
      },
      { form: 'Calcium phosphate', bioavailability: 'Moderate' },
    ],
    interactions: [
      'Inhibits iron and zinc absorption',
      'Requires Vitamin D for optimal absorption',
      'Works with K2 for bone deposition',
    ],
    contraindications: ['Hypercalcemia', 'Kidney stones history', 'Hyperparathyroidism'],
    images: ['/images/complements/calcium.jpg'],
  },
  {
    name: 'Selenium',
    slug: createSlug('Selenium'),
    category: 'mineral',
    description:
      'Trace mineral essential for antioxidant enzymes, thyroid function, immune balance, and reproductive health.',
    biologicalRole:
      'Thyroid hormone metabolism, antioxidant defense, immune function, DNA synthesis, male fertility',
    deficiencySymptoms: [
      'Thyroid dysfunction',
      'Weakened immunity',
      'Fatigue',
      'Brain fog',
      'Male infertility',
    ],
    foodSources: [
      { food: 'Brazil nuts', quantityPer100g: 1917, unit: 'mcg' },
      { food: 'Tuna', quantityPer100g: 90, unit: 'mcg' },
      { food: 'Eggs', quantityPer100g: 27, unit: 'mcg' },
    ],
    dailyIntake: {
      men: '55mcg',
      women: '55mcg',
      pregnant: '60mcg',
      athletes: '55-200mcg',
    },
    supplementForms: [
      {
        form: 'Selenomethionine',
        bioavailability: 'Superior organic form',
      },
      { form: 'Sodium selenite', bioavailability: 'Standard inorganic form' },
    ],
    interactions: [
      'Works with Vitamin E in antioxidant defense',
      'High doses can be toxic - do not exceed 400mcg',
    ],
    contraindications: [
      'Toxicity above 400mcg/day',
      'Brazil nuts already very high - monitor intake',
    ],
    images: ['/images/complements/selenium.jpg'],
  },
  {
    name: 'Rhodiola Rosea',
    slug: createSlug('Rhodiola Rosea'),
    category: 'adaptogen',
    description:
      'Adaptogenic botanical used for stress resilience, cognitive sharpness, fatigue reduction, and endurance support.',
    biologicalRole:
      'Stress resilience, mental performance, exercise endurance, fatigue reduction, mood regulation',
    deficiencySymptoms: ['Not applicable - adaptogen'],
    foodSources: [{ food: 'Rhodiola root (herb only)', quantityPer100g: 0, unit: 'mg' }],
    dailyIntake: {
      men: '200-600mg extract',
      women: '200-400mg extract',
      pregnant: 'Avoid',
      athletes: '200-600mg before training',
    },
    supplementForms: [
      {
        form: 'Standardized extract (3% rosavins, 1% salidroside)',
        bioavailability: 'Optimal potency',
      },
      { form: 'Raw root powder', bioavailability: 'Lower standardization' },
    ],
    interactions: [
      'May interact with antidepressants (MAOIs, SSRIs)',
      'Stimulant-like effects - avoid late evening',
    ],
    contraindications: ['Bipolar disorder', 'Pregnancy', 'Autoimmune conditions'],
    images: ['/images/complements/rhodiola-rosea.jpg'],
  },
];

const run = async (): Promise<void> => {
  try {
    await connectDatabase();

    const existing = await Complement.find(
      { slug: { $in: complementsData.map((item) => item.slug) } },
      { slug: 1 },
    )
      .lean()
      .exec();

    const existingSlugs = new Set(existing.map((item) => item.slug));
    const toInsert = complementsData.filter((item) => !existingSlugs.has(item.slug));

    if (toInsert.length > 0) {
      await Complement.insertMany(toInsert, { ordered: true });
    }

    const insertedCount = toInsert.length;
    const alreadyExistedCount = complementsData.length - insertedCount;

    console.log(`Complements inserted: ${insertedCount}`);
    console.log(`Complements already existed: ${alreadyExistedCount}`);

    process.exit(0);
  } catch (error) {
    console.error('Complement seed failed:', error);
    process.exit(1);
  }
};

void run();
