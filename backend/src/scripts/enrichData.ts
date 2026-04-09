import { AnyBulkWriteOperation, Model } from 'mongoose';
import slugify from 'slugify';

import { connectDatabase } from '../config/database';
import { Complement } from '../models/Complement';
import { Food } from '../models/Food';
import { Supplement } from '../models/Supplement';

const createSlug = (name: string): string =>
  slugify(name, { lower: true, strict: true, trim: true });

const extraSupplements = [
  {
    name: 'Hydrolyzed Whey Protein',
    slug: createSlug('Hydrolyzed Whey Protein'),
    category: 'proteins',
    description:
      'Predigested whey peptides designed for rapid absorption after intense training sessions and faster recovery support.',
    benefits: [
      'Rapid amino acid absorption',
      'Supports post-workout recovery',
      'Low lactose profile',
    ],
    dosage: '25-30g per serving',
    timing: 'Immediately post-workout',
    duration: 'Daily',
    ingredients: ['Hydrolyzed whey protein isolate', 'Sunflower lecithin'],
    contraindications: ['Milk allergy'],
    scientificStudies: [
      {
        title: 'Hydrolyzed whey and post-exercise recovery',
        url: 'https://pubmed.ncbi.nlm.nih.gov/?term=hydrolyzed+whey+recovery',
        summary:
          'Hydrolyzed protein may accelerate amino acid availability after exercise.',
      },
    ],
    images: ['https://placehold.co/800x600?text=Hydrolyzed+Whey+Protein'],
    goals: ['mass', 'endurance'],
    popularity: 67,
  },
  {
    name: 'Mass Gainer Complex',
    slug: createSlug('Mass Gainer Complex'),
    category: 'proteins',
    description:
      'High-calorie blend of proteins and carbohydrates designed to help hard gainers increase total daily calorie intake.',
    benefits: ['Supports calorie surplus', 'Convenient mass gain formula', 'Adds daily protein'],
    dosage: '1-2 scoops (as labeled)',
    timing: 'After training or between meals',
    duration: 'Daily',
    ingredients: ['Whey concentrate', 'Oat flour', 'Maltodextrin'],
    contraindications: ['Milk allergy', 'Diabetes without supervision'],
    scientificStudies: [
      {
        title: 'Energy surplus and muscle mass increase',
        url: 'https://pubmed.ncbi.nlm.nih.gov/?term=energy+surplus+muscle+mass',
        summary: 'Calorie surplus combined with resistance training supports weight and muscle gain.',
      },
    ],
    images: ['https://placehold.co/800x600?text=Mass+Gainer'],
    goals: ['mass'],
    popularity: 62,
  },
  {
    name: 'Citrulline Malate 2:1',
    slug: createSlug('Citrulline Malate 2:1'),
    category: 'pre-workout',
    description:
      'Pre-workout amino compound used to support nitric oxide production, blood flow, and training volume.',
    benefits: ['Improved blood flow', 'Pump support', 'May improve training performance'],
    dosage: '6-8g pre-workout',
    timing: '30-45 minutes before workout',
    duration: 'Training days',
    ingredients: ['L-Citrulline malate'],
    contraindications: ['Low blood pressure without supervision'],
    scientificStudies: [
      {
        title: 'Citrulline malate and exercise performance',
        url: 'https://pubmed.ncbi.nlm.nih.gov/?term=citrulline+malate+performance',
        summary: 'Citrulline malate may support high-intensity exercise volume.',
      },
    ],
    images: ['https://placehold.co/800x600?text=Citrulline+Malate'],
    goals: ['endurance', 'mass'],
    popularity: 64,
  },
  {
    name: 'Beta-Alanine Powder',
    slug: createSlug('Beta-Alanine Powder'),
    category: 'pre-workout',
    description:
      'Performance amino acid that increases muscle carnosine stores and helps buffer fatigue during repeated efforts.',
    benefits: ['Buffers muscular fatigue', 'Supports endurance', 'Useful for high-intensity intervals'],
    dosage: '3.2-6.4g daily split doses',
    timing: 'Daily with meals or pre-workout',
    duration: 'Daily',
    ingredients: ['Beta-alanine'],
    contraindications: ['Temporary tingling sensation is common'],
    scientificStudies: [
      {
        title: 'Beta-alanine supplementation and performance',
        url: 'https://pubmed.ncbi.nlm.nih.gov/?term=beta+alanine+exercise+performance',
        summary: 'Evidence supports improved performance in high-intensity efforts.',
      },
    ],
    images: ['https://placehold.co/800x600?text=Beta+Alanine'],
    goals: ['endurance'],
    popularity: 57,
  },
  {
    name: 'HMB (Beta-Hydroxy Beta-Methylbutyrate)',
    slug: createSlug('HMB Beta-Hydroxy Beta-Methylbutyrate'),
    category: 'recovery',
    description:
      'Leucine metabolite used to support muscle recovery and reduce muscle protein breakdown during demanding training phases.',
    benefits: ['Supports recovery', 'May reduce muscle breakdown', 'Useful during calorie deficit'],
    dosage: '3g daily',
    timing: 'Split across meals',
    duration: 'Daily',
    ingredients: ['Calcium HMB'],
    contraindications: ['Consult clinician if on chronic medication'],
    scientificStudies: [
      {
        title: 'HMB and muscle protein turnover',
        url: 'https://pubmed.ncbi.nlm.nih.gov/?term=hmb+muscle+recovery',
        summary: 'HMB may help preserve lean mass in some training contexts.',
      },
    ],
    images: ['https://placehold.co/800x600?text=HMB'],
    goals: ['cutting', 'mass'],
    popularity: 44,
  },
  {
    name: 'L-Carnitine L-Tartrate',
    slug: createSlug('L-Carnitine L-Tartrate'),
    category: 'recovery',
    description:
      'Carnitine form commonly used for recovery support and lipid metabolism in active individuals.',
    benefits: ['Recovery support', 'May support fatty acid transport', 'Training support'],
    dosage: '1-2g daily',
    timing: 'Before training or with meals',
    duration: 'Daily',
    ingredients: ['L-Carnitine L-tartrate'],
    contraindications: ['Consult clinician in thyroid disorders'],
    scientificStudies: [
      {
        title: 'L-carnitine and exercise recovery',
        url: 'https://pubmed.ncbi.nlm.nih.gov/?term=l-carnitine+exercise+recovery',
        summary: 'Some studies indicate reduced markers of muscle damage.',
      },
    ],
    images: ['https://placehold.co/800x600?text=L-Carnitine'],
    goals: ['cutting', 'endurance'],
    popularity: 46,
  },
];

const extraComplements = [
  {
    name: 'Coenzyme Q10',
    slug: createSlug('Coenzyme Q10'),
    category: 'antioxidant',
    description:
      'Mitochondrial antioxidant involved in cellular energy production and oxidative stress balance.',
    biologicalRole: 'Supports ATP production and antioxidant defense in cells.',
    deficiencySymptoms: ['Low energy', 'Exercise fatigue'],
    foodSources: [
      { food: 'Sardines', quantityPer100g: 6.4, unit: 'mg' },
      { food: 'Beef heart', quantityPer100g: 11.3, unit: 'mg' },
    ],
    dailyIntake: {
      men: '100-200 mg',
      women: '100-200 mg',
      pregnant: 'Use only with medical advice',
      athletes: '100-300 mg',
    },
    supplementForms: [
      { form: 'Ubiquinone', bioavailability: 'Moderate' },
      { form: 'Ubiquinol', bioavailability: 'High' },
    ],
    interactions: ['May interact with blood thinners'],
    contraindications: ['Anticoagulant therapy without supervision'],
    images: ['https://placehold.co/800x600?text=CoQ10'],
  },
  {
    name: 'N-Acetyl Cysteine (NAC)',
    slug: createSlug('N-Acetyl Cysteine NAC'),
    category: 'antioxidant',
    description:
      'Precursor of glutathione used to support antioxidant status and respiratory health.',
    biologicalRole: 'Helps replenish glutathione and supports cellular detox pathways.',
    deficiencySymptoms: ['Low antioxidant capacity', 'High oxidative stress'],
    foodSources: [
      { food: 'Turkey', quantityPer100g: 0.22, unit: 'g cysteine' },
      { food: 'Eggs', quantityPer100g: 0.27, unit: 'g cysteine' },
    ],
    dailyIntake: {
      men: '600-1200 mg',
      women: '600-1200 mg',
      pregnant: 'Use only with medical advice',
      athletes: '600-1200 mg',
    },
    supplementForms: [{ form: 'Capsule', bioavailability: 'Moderate' }],
    interactions: ['May interact with nitroglycerin'],
    contraindications: ['Asthma without supervision'],
    images: ['https://placehold.co/800x600?text=NAC'],
  },
  {
    name: 'Alpha Lipoic Acid',
    slug: createSlug('Alpha Lipoic Acid'),
    category: 'antioxidant',
    description:
      'Antioxidant compound involved in mitochondrial energy pathways and redox balance.',
    biologicalRole: 'Supports glucose metabolism and antioxidant recycling.',
    deficiencySymptoms: ['Low energy metabolism support'],
    foodSources: [
      { food: 'Spinach', quantityPer100g: 0.1, unit: 'mg' },
      { food: 'Organ meats', quantityPer100g: 0.5, unit: 'mg' },
    ],
    dailyIntake: {
      men: '300-600 mg',
      women: '300-600 mg',
      pregnant: 'Use only with medical advice',
      athletes: '300-600 mg',
    },
    supplementForms: [
      { form: 'R-ALA', bioavailability: 'High' },
      { form: 'ALA', bioavailability: 'Moderate' },
    ],
    interactions: ['May lower blood glucose'],
    contraindications: ['Diabetes medication without monitoring'],
    images: ['https://placehold.co/800x600?text=Alpha+Lipoic+Acid'],
  },
  {
    name: 'Selenium',
    slug: createSlug('Selenium'),
    category: 'mineral',
    description:
      'Trace mineral with key antioxidant and thyroid-supporting functions.',
    biologicalRole: 'Required for selenoproteins and thyroid hormone metabolism.',
    deficiencySymptoms: ['Low immunity', 'Thyroid support issues'],
    foodSources: [
      { food: 'Brazil nuts', quantityPer100g: 1917, unit: 'mcg' },
      { food: 'Tuna', quantityPer100g: 80, unit: 'mcg' },
    ],
    dailyIntake: {
      men: '55 mcg',
      women: '55 mcg',
      pregnant: '60 mcg',
      athletes: '55-70 mcg',
    },
    supplementForms: [
      { form: 'Selenomethionine', bioavailability: 'High' },
      { form: 'Sodium selenite', bioavailability: 'Moderate' },
    ],
    interactions: ['High dose may interact with thyroid treatment'],
    contraindications: ['Avoid chronic high-dose intake'],
    images: ['https://placehold.co/800x600?text=Selenium'],
  },
  {
    name: 'Vitamin K2 (MK-7)',
    slug: createSlug('Vitamin K2 MK-7'),
    category: 'vitamin',
    description:
      'Fat-soluble vitamin supporting calcium distribution toward bones and away from soft tissues.',
    biologicalRole: 'Activates proteins involved in bone mineralization and vascular health.',
    deficiencySymptoms: ['Bone health support issues'],
    foodSources: [
      { food: 'Natto', quantityPer100g: 939, unit: 'mcg' },
      { food: 'Hard cheese', quantityPer100g: 76, unit: 'mcg' },
    ],
    dailyIntake: {
      men: '90-120 mcg',
      women: '90 mcg',
      pregnant: '90 mcg',
      athletes: '90-120 mcg',
    },
    supplementForms: [
      { form: 'MK-7', bioavailability: 'High' },
      { form: 'MK-4', bioavailability: 'Moderate' },
    ],
    interactions: ['Interacts with vitamin K antagonist anticoagulants'],
    contraindications: ['Warfarin therapy without supervision'],
    images: ['https://placehold.co/800x600?text=Vitamin+K2'],
  },
  {
    name: 'Vegan Algae Omega-3 DHA',
    slug: createSlug('Vegan Algae Omega-3 DHA'),
    category: 'omega',
    description:
      'Plant-based DHA supplement sourced from microalgae for brain and eye support.',
    biologicalRole: 'Provides DHA for neuronal membranes and visual function.',
    deficiencySymptoms: ['Low omega-3 intake', 'Dry skin', 'Low focus'],
    foodSources: [
      { food: 'Algae oil', quantityPer100g: 40, unit: 'g DHA' },
      { food: 'Fortified foods', quantityPer100g: 0.2, unit: 'g DHA' },
    ],
    dailyIntake: {
      men: '250-500 mg DHA',
      women: '250-500 mg DHA',
      pregnant: '300-500 mg DHA',
      athletes: '500 mg DHA',
    },
    supplementForms: [{ form: 'Algal oil softgel', bioavailability: 'High' }],
    interactions: ['High doses may affect clotting time'],
    contraindications: ['Bleeding disorders without supervision'],
    images: ['https://placehold.co/800x600?text=Algae+Omega-3'],
  },
];

const extraFoods = [
  {
    name: 'Shrimp',
    slug: createSlug('Shrimp'),
    category: 'fish',
    type: 'animal',
    per100g: {
      calories: 99,
      proteins: 24,
      carbs: 0.2,
      fats: 0.3,
      fiber: 0,
      vitamins: [{ name: 'Vitamin B12', amount: 1.1, unit: 'mcg' }],
      minerals: [{ name: 'Iodine', amount: 35, unit: 'mcg' }],
    },
    benefits: ['Very high protein', 'Low fat'],
    mealIdeas: ['Garlic shrimp bowl', 'Shrimp salad'],
    dietaryTags: ['gluten-free'],
    image: 'https://placehold.co/800x600?text=Shrimp',
  },
  {
    name: 'Cod',
    slug: createSlug('Cod'),
    category: 'fish',
    type: 'animal',
    per100g: {
      calories: 105,
      proteins: 23,
      carbs: 0,
      fats: 0.9,
      fiber: 0,
      vitamins: [{ name: 'Vitamin B6', amount: 0.2, unit: 'mg' }],
      minerals: [{ name: 'Phosphorus', amount: 203, unit: 'mg' }],
    },
    benefits: ['Lean protein source', 'Easy digestion'],
    mealIdeas: ['Baked cod with herbs', 'Cod and rice plate'],
    dietaryTags: ['gluten-free'],
    image: 'https://placehold.co/800x600?text=Cod',
  },
  {
    name: 'Tofu (firm)',
    slug: createSlug('Tofu firm'),
    category: 'soy',
    type: 'vegetal',
    per100g: {
      calories: 144,
      proteins: 17,
      carbs: 3,
      fats: 9,
      fiber: 2,
      vitamins: [{ name: 'Folate', amount: 27, unit: 'mcg' }],
      minerals: [{ name: 'Calcium', amount: 350, unit: 'mg' }],
    },
    benefits: ['Complete plant protein', 'Calcium rich'],
    mealIdeas: ['Tofu stir-fry', 'Tofu salad'],
    dietaryTags: ['vegan', 'gluten-free'],
    image: 'https://placehold.co/800x600?text=Tofu',
  },
  {
    name: 'Tempeh',
    slug: createSlug('Tempeh'),
    category: 'soy',
    type: 'vegetal',
    per100g: {
      calories: 192,
      proteins: 20,
      carbs: 7.6,
      fats: 10.8,
      fiber: 5,
      vitamins: [{ name: 'Riboflavin', amount: 0.3, unit: 'mg' }],
      minerals: [{ name: 'Iron', amount: 2.7, unit: 'mg' }],
    },
    benefits: ['Fermented plant protein', 'Gut-friendly food matrix'],
    mealIdeas: ['Tempeh tacos', 'Tempeh buddha bowl'],
    dietaryTags: ['vegan'],
    image: 'https://placehold.co/800x600?text=Tempeh',
  },
  {
    name: 'Sweet potato',
    slug: createSlug('Sweet potato'),
    category: 'grains',
    type: 'vegetal',
    per100g: {
      calories: 86,
      proteins: 1.6,
      carbs: 20.1,
      fats: 0.1,
      fiber: 3,
      vitamins: [{ name: 'Vitamin A', amount: 709, unit: 'mcg' }],
      minerals: [{ name: 'Potassium', amount: 337, unit: 'mg' }],
    },
    benefits: ['Complex carbs', 'Vitamin A rich'],
    mealIdeas: ['Roasted sweet potato', 'Sweet potato mash'],
    dietaryTags: ['vegan', 'gluten-free'],
    image: 'https://placehold.co/800x600?text=Sweet+Potato',
  },
  {
    name: 'Whole wheat pasta (cooked)',
    slug: createSlug('Whole wheat pasta cooked'),
    category: 'grains',
    type: 'vegetal',
    per100g: {
      calories: 124,
      proteins: 5,
      carbs: 26,
      fats: 0.8,
      fiber: 3.5,
      vitamins: [{ name: 'Thiamin', amount: 0.2, unit: 'mg' }],
      minerals: [{ name: 'Magnesium', amount: 43, unit: 'mg' }],
    },
    benefits: ['Steady carb source', 'Higher fiber than refined pasta'],
    mealIdeas: ['Pasta with tuna', 'Pasta with vegetables'],
    dietaryTags: ['vegan'],
    image: 'https://placehold.co/800x600?text=Whole+Wheat+Pasta',
  },
  {
    name: 'Skyr',
    slug: createSlug('Skyr'),
    category: 'dairy',
    type: 'animal',
    per100g: {
      calories: 63,
      proteins: 11,
      carbs: 4,
      fats: 0.2,
      fiber: 0,
      vitamins: [{ name: 'Vitamin B12', amount: 0.7, unit: 'mcg' }],
      minerals: [{ name: 'Calcium', amount: 150, unit: 'mg' }],
    },
    benefits: ['High protein dairy', 'Low fat'],
    mealIdeas: ['Skyr fruit bowl', 'Skyr smoothie'],
    dietaryTags: ['vegetarian', 'gluten-free'],
    image: 'https://placehold.co/800x600?text=Skyr',
  },
  {
    name: 'Chia seeds',
    slug: createSlug('Chia seeds'),
    category: 'nuts',
    type: 'vegetal',
    per100g: {
      calories: 486,
      proteins: 16.5,
      carbs: 42.1,
      fats: 30.7,
      fiber: 34.4,
      vitamins: [{ name: 'Vitamin B1', amount: 0.6, unit: 'mg' }],
      minerals: [{ name: 'Calcium', amount: 631, unit: 'mg' }],
    },
    benefits: ['High fiber', 'Plant omega-3 source'],
    mealIdeas: ['Chia pudding', 'Smoothie topping'],
    dietaryTags: ['vegan', 'gluten-free'],
    image: 'https://placehold.co/800x600?text=Chia+Seeds',
  },
  {
    name: 'Peanut butter',
    slug: createSlug('Peanut butter'),
    category: 'nuts',
    type: 'vegetal',
    per100g: {
      calories: 588,
      proteins: 25,
      carbs: 20,
      fats: 50,
      fiber: 6,
      vitamins: [{ name: 'Vitamin E', amount: 9, unit: 'mg' }],
      minerals: [{ name: 'Magnesium', amount: 168, unit: 'mg' }],
    },
    benefits: ['Energy-dense', 'Good protein for snacks'],
    mealIdeas: ['Peanut butter toast', 'Protein smoothie add-in'],
    dietaryTags: ['vegan', 'gluten-free'],
    image: 'https://placehold.co/800x600?text=Peanut+Butter',
  },
];

const upsertManyBySlug = async <T extends { slug: string }>(
  model: Model<any>,
  data: T[],
): Promise<void> => {
  const operations: AnyBulkWriteOperation<any>[] = data.map((doc) => ({
    updateOne: {
      filter: { slug: doc.slug },
      update: { $set: doc },
      upsert: true,
    },
  }));

  await model.bulkWrite(operations);
};

const run = async (): Promise<void> => {
  try {
    await connectDatabase();

    const beforeSupplements = await Supplement.countDocuments({});
    const beforeComplements = await Complement.countDocuments({});
    const beforeFoods = await Food.countDocuments({});

    await upsertManyBySlug(Supplement, extraSupplements);
    await upsertManyBySlug(Complement, extraComplements);
    await upsertManyBySlug(Food, extraFoods);

    const afterSupplements = await Supplement.countDocuments({});
    const afterComplements = await Complement.countDocuments({});
    const afterFoods = await Food.countDocuments({});

    console.log(`Supplements: ${beforeSupplements} -> ${afterSupplements}`);
    console.log(`Complements: ${beforeComplements} -> ${afterComplements}`);
    console.log(`Foods: ${beforeFoods} -> ${afterFoods}`);
    console.log('Data enrichment completed successfully.');

    process.exit(0);
  } catch (error) {
    console.error('Data enrichment failed:', error);
    process.exit(1);
  }
};

void run();
