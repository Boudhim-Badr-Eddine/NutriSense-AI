import slugify from 'slugify';

import { connectDatabase } from '../config/database';
import { Supplement, SupplementCategory, SupplementGoal } from '../models/Supplement';

interface SupplementSeed {
  name: string;
  slug: string;
  category: SupplementCategory;
  description: string;
  benefits: string[];
  dosage: string;
  timing: string;
  duration: string;
  ingredients: string[];
  contraindications: string[];
  scientificStudies: Array<{ title: string; url: string; summary: string }>;
  images: string[];
  goals: SupplementGoal[];
  popularity: number;
}

const createSlug = (name: string): string =>
  slugify(name, { lower: true, strict: true, trim: true });

// NOTE: The Supplement schema currently allows goals: mass | cutting | endurance.
// Requested "recovery" goals are mapped to "endurance" to stay schema-valid.
const supplementsData: SupplementSeed[] = [
  {
    name: 'Whey Protein Isolate',
    slug: createSlug('Whey Protein Isolate'),
    category: 'proteins',
    goals: ['mass', 'endurance'],
    dosage: '25-30g per serving',
    timing: 'Post-workout or morning',
    duration: 'Daily',
    benefits: [
      'Rapid muscle recovery',
      'High protein bioavailability',
      'Low lactose',
      'Supports lean muscle growth',
    ],
    description:
      'Premium whey protein isolate with 90%+ protein content per serving. Fast-digesting formula ideal for post-workout recovery and muscle protein synthesis.',
    ingredients: ['Whey protein isolate', 'Sunflower lecithin', 'Natural flavors'],
    contraindications: ['Milk allergy', 'Lactose intolerance (severe cases)'],
    scientificStudies: [
      {
        title: 'Whey protein supplementation and skeletal muscle adaptation',
        url: 'https://pubmed.ncbi.nlm.nih.gov/24276305/',
        summary:
          'Systematic evidence supports whey protein for improving recovery and lean mass with resistance training.',
      },
    ],
    images: ['/images/supplements/whey-protein-isolate.jpg'],
    popularity: 95,
  },
  {
    name: 'Creatine Monohydrate',
    slug: createSlug('Creatine Monohydrate'),
    category: 'creatine',
    goals: ['mass', 'endurance'],
    dosage: '5g per day',
    timing: 'Any time, consistent daily use',
    duration: 'Daily',
    benefits: [
      'Increased strength',
      'Improved power output',
      'Enhanced muscle cell hydration',
      'Better high-intensity performance',
    ],
    description:
      'Gold-standard creatine monohydrate backed by 200+ studies. Increases phosphocreatine stores in muscles for improved ATP production.',
    ingredients: ['Creatine monohydrate'],
    contraindications: [
      'Kidney disease without medical supervision',
      'Consult doctor if on medication',
    ],
    scientificStudies: [
      {
        title: 'International Society of Sports Nutrition position stand: creatine',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28615996/',
        summary:
          'Creatine monohydrate is one of the most effective ergogenic supplements for strength and high-intensity exercise.',
      },
    ],
    images: ['/images/supplements/creatine-monohydrate.jpg'],
    popularity: 100,
  },
  {
    name: 'BCAA 2:1:1',
    slug: createSlug('BCAA 2:1:1'),
    category: 'bcaa',
    goals: ['endurance'],
    dosage: '5-10g during or after workout',
    timing: 'During or post-workout',
    duration: 'Training days',
    benefits: [
      'Reduces muscle soreness',
      'Prevents muscle breakdown',
      'Supports endurance',
      'Improves recovery speed',
    ],
    description:
      'Essential branched-chain amino acids in the optimal 2:1:1 ratio (Leucine:Isoleucine:Valine). Supports muscle protein synthesis and reduces exercise-induced fatigue.',
    ingredients: ['L-Leucine', 'L-Isoleucine', 'L-Valine'],
    contraindications: ['ALS patients should avoid', 'Consult doctor if diabetic'],
    scientificStudies: [
      {
        title: 'BCAA supplementation and delayed onset muscle soreness',
        url: 'https://pubmed.ncbi.nlm.nih.gov/26170526/',
        summary:
          'Evidence indicates BCAA supplementation may reduce muscle soreness and markers of muscle damage.',
      },
    ],
    images: ['/images/supplements/bcaa-2-1-1.jpg'],
    popularity: 78,
  },
  {
    name: 'Pre-Workout Caffeine + Beta-Alanine',
    slug: createSlug('Pre-Workout Caffeine + Beta-Alanine'),
    category: 'pre-workout',
    goals: ['endurance', 'mass'],
    dosage: '1 scoop (per label)',
    timing: '20-30 minutes before workout',
    duration: 'Training days',
    benefits: [
      'Increased focus and energy',
      'Enhanced muscular endurance',
      'Reduced perceived fatigue',
      'Improved training performance',
    ],
    description:
      'Powerful pre-workout formula combining caffeine for focus and beta-alanine for endurance. Designed for high-intensity training sessions.',
    ingredients: [
      'Caffeine anhydrous (200mg)',
      'Beta-Alanine (3.2g)',
      'L-Citrulline',
      'B vitamins',
    ],
    contraindications: [
      'Heart conditions',
      'High blood pressure',
      'Pregnancy',
      'Caffeine sensitivity',
    ],
    scientificStudies: [
      {
        title: 'Caffeine and exercise performance meta-analysis',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28829865/',
        summary:
          'Caffeine consistently improves endurance, power output, and perceived exertion during exercise.',
      },
    ],
    images: ['/images/supplements/pre-workout-caffeine-beta-alanine.jpg'],
    popularity: 89,
  },
  {
    name: 'Glutamine',
    slug: createSlug('Glutamine'),
    category: 'recovery',
    goals: ['endurance', 'mass'],
    dosage: '5g post-workout',
    timing: 'Post-workout and before bed',
    duration: 'Daily',
    benefits: [
      'Accelerates muscle recovery',
      'Supports immune function',
      'Reduces muscle soreness',
      'Gut health support',
    ],
    description:
      'L-Glutamine is the most abundant amino acid in muscle tissue. Essential for recovery, immune function, and gut integrity during intense training.',
    ingredients: ['L-Glutamine'],
    contraindications: [
      'Liver or kidney disease',
      'Epilepsy without medical supervision',
    ],
    scientificStudies: [
      {
        title: 'Glutamine supplementation in athletic recovery',
        url: 'https://pubmed.ncbi.nlm.nih.gov/26840435/',
        summary:
          'Research suggests glutamine may support immune function and recovery during intensive training periods.',
      },
    ],
    images: ['/images/supplements/glutamine.jpg'],
    popularity: 73,
  },
  {
    name: 'Omega-3 Fish Oil',
    slug: createSlug('Omega-3 Fish Oil'),
    category: 'recovery',
    goals: ['endurance'],
    dosage: '2-3g EPA+DHA daily',
    timing: 'With meals',
    duration: 'Daily',
    benefits: [
      'Reduces inflammation',
      'Supports heart health',
      'Improves joint mobility',
      'Enhances brain function',
    ],
    description:
      'High-potency fish oil concentrate providing EPA and DHA omega-3 fatty acids. Supports cardiovascular health, reduces exercise-induced inflammation.',
    ingredients: [
      'Fish oil concentrate',
      'EPA',
      'DHA',
      'Vitamin E (antioxidant)',
    ],
    contraindications: [
      'Fish allergy',
      'Blood thinners medication',
      'Consult doctor before surgery',
    ],
    scientificStudies: [
      {
        title: 'Omega-3 fatty acids and exercise-induced inflammation',
        url: 'https://pubmed.ncbi.nlm.nih.gov/24063641/',
        summary:
          'Omega-3 supplementation may reduce inflammation markers and improve recovery after exercise.',
      },
    ],
    images: ['/images/supplements/omega-3-fish-oil.jpg'],
    popularity: 82,
  },
  {
    name: 'ZMA (Zinc Magnesium Aspartate)',
    slug: createSlug('ZMA (Zinc Magnesium Aspartate)'),
    category: 'recovery',
    goals: ['endurance', 'mass'],
    dosage: '3 capsules before bed',
    timing: '30-60 minutes before sleep',
    duration: 'Daily',
    benefits: [
      'Improves sleep quality',
      'Supports testosterone levels',
      'Enhances recovery during sleep',
      'Boosts immune system',
    ],
    description:
      'Classic recovery formula combining Zinc, Magnesium, and Vitamin B6. Optimizes sleep quality and overnight hormonal recovery.',
    ingredients: [
      'Zinc aspartate (30mg)',
      'Magnesium aspartate (450mg)',
      'Vitamin B6 (10.5mg)',
    ],
    contraindications: [
      'Avoid with calcium supplements (interferes with absorption)',
      'Kidney disease',
    ],
    scientificStudies: [
      {
        title: 'Magnesium and zinc status in physically active individuals',
        url: 'https://pubmed.ncbi.nlm.nih.gov/20026378/',
        summary:
          'Adequate zinc and magnesium intake supports recovery, sleep quality, and neuromuscular function.',
      },
    ],
    images: ['/images/supplements/zma-zinc-magnesium-aspartate.jpg'],
    popularity: 69,
  },
  {
    name: 'L-Citrulline Malate',
    slug: createSlug('L-Citrulline Malate'),
    category: 'pre-workout',
    goals: ['endurance'],
    dosage: '6-8g pre-workout',
    timing: '30-60 minutes before workout',
    duration: 'Training days',
    benefits: [
      'Improved blood flow and pump',
      'Reduced muscle soreness',
      'Enhanced endurance',
      'Better nutrient delivery to muscles',
    ],
    description:
      'Citrulline malate is a powerful nitric oxide booster that improves blood flow, enhances endurance, and accelerates recovery between sets.',
    ingredients: ['L-Citrulline malate 2:1'],
    contraindications: ['Low blood pressure', 'Consult doctor if on nitrate medication'],
    scientificStudies: [
      {
        title: 'Citrulline malate supplementation and muscular endurance',
        url: 'https://pubmed.ncbi.nlm.nih.gov/20386132/',
        summary:
          'Citrulline malate may improve repetition performance and reduce post-exercise muscle soreness.',
      },
    ],
    images: ['/images/supplements/l-citrulline-malate.jpg'],
    popularity: 84,
  },
  {
    name: 'Casein Protein',
    slug: createSlug('Casein Protein'),
    category: 'proteins',
    goals: ['mass', 'endurance'],
    dosage: '30-40g before bed',
    timing: 'Before sleep or between meals',
    duration: 'Daily',
    benefits: [
      'Slow-release protein for overnight recovery',
      'Sustained amino acid delivery',
      'Reduces muscle breakdown',
      'Promotes satiety',
    ],
    description:
      'Slow-digesting micellar casein provides a steady stream of amino acids for up to 7 hours. Perfect for overnight muscle repair and recovery.',
    ingredients: ['Micellar casein', 'Sunflower lecithin', 'Natural flavors'],
    contraindications: ['Milk allergy', 'Severe lactose intolerance'],
    scientificStudies: [
      {
        title: 'Pre-sleep protein ingestion and overnight recovery',
        url: 'https://pubmed.ncbi.nlm.nih.gov/22330017/',
        summary:
          'Casein before sleep increases overnight muscle protein synthesis and supports recovery.',
      },
    ],
    images: ['/images/supplements/casein-protein.jpg'],
    popularity: 80,
  },
  {
    name: 'Vitamin D3 + K2',
    slug: createSlug('Vitamin D3 + K2'),
    category: 'recovery',
    goals: ['endurance'],
    dosage: '2000-5000 IU D3 daily',
    timing: 'With a fatty meal',
    duration: 'Daily',
    benefits: [
      'Bone strength and density',
      'Immune system support',
      'Testosterone optimization',
      'Calcium absorption regulation',
    ],
    description:
      'Synergistic combination of Vitamin D3 for absorption and K2 to direct calcium to bones rather than arteries. Essential for athletes.',
    ingredients: ['Cholecalciferol (D3)', 'Menaquinone-7 (K2)'],
    contraindications: ['Hypercalcemia', 'Consult doctor if on blood thinners'],
    scientificStudies: [
      {
        title: 'Vitamin D status, immunity, and performance in athletes',
        url: 'https://pubmed.ncbi.nlm.nih.gov/25098431/',
        summary:
          'Sufficient vitamin D levels are associated with improved immune and musculoskeletal health in active populations.',
      },
    ],
    images: ['/images/supplements/vitamin-d3-k2.jpg'],
    popularity: 76,
  },
  {
    name: 'Mass Gainer',
    slug: createSlug('Mass Gainer'),
    category: 'proteins',
    goals: ['mass'],
    dosage: '1-2 scoops (50-100g)',
    timing: 'Post-workout or between meals',
    duration: 'Daily',
    benefits: [
      'High calorie intake for bulking',
      'Blend of fast and slow proteins',
      'Added carbohydrates for glycogen replenishment',
      'Supports maximum muscle growth',
    ],
    description:
      'High-calorie mass gainer with a blend of whey, casein, and complex carbohydrates. Designed for hardgainers who struggle to meet caloric needs through food alone.',
    ingredients: [
      'Whey protein concentrate',
      'Maltodextrin',
      'Oat flour',
      'Micellar casein',
      'MCT oil',
    ],
    contraindications: [
      'Not recommended for weight loss goals',
      'Monitor sugar intake if diabetic',
    ],
    scientificStudies: [
      {
        title: 'Energy surplus and resistance training adaptations',
        url: 'https://pubmed.ncbi.nlm.nih.gov/32248472/',
        summary:
          'Caloric surplus and adequate protein intake improve body mass and resistance training outcomes.',
      },
    ],
    images: ['/images/supplements/mass-gainer.jpg'],
    popularity: 77,
  },
  {
    name: 'Beta-Alanine',
    slug: createSlug('Beta-Alanine'),
    category: 'pre-workout',
    goals: ['endurance'],
    dosage: '3.2-6.4g daily',
    timing: 'Pre-workout or split throughout the day',
    duration: 'Daily',
    benefits: [
      'Increases carnosine levels in muscles',
      'Delays muscular fatigue',
      'Improves high-intensity performance',
      'Enhances endurance capacity',
    ],
    description:
      'Beta-Alanine increases muscle carnosine concentration which buffers acid buildup during intense exercise, delaying fatigue and improving performance.',
    ingredients: ['Beta-Alanine'],
    contraindications: [
      'May cause harmless tingling (paresthesia)',
      'Reduce dose if tingling is uncomfortable',
    ],
    scientificStudies: [
      {
        title: 'Beta-alanine supplementation and exercise capacity',
        url: 'https://pubmed.ncbi.nlm.nih.gov/20479615/',
        summary:
          'Meta-analytic data indicates beta-alanine can improve exercise performance in high-intensity efforts.',
      },
    ],
    images: ['/images/supplements/beta-alanine.jpg'],
    popularity: 83,
  },
  {
    name: 'Creatine HCL',
    slug: createSlug('Creatine HCL'),
    category: 'creatine',
    goals: ['mass', 'endurance'],
    dosage: '1-2g pre-workout',
    timing: 'Before workout',
    duration: 'Daily',
    benefits: [
      'Better solubility than monohydrate',
      'Less water retention',
      'No loading phase needed',
      'Rapid absorption',
    ],
    description:
      'Creatine Hydrochloride offers superior solubility and absorption at lower doses compared to monohydrate. Less bloating and no loading phase required.',
    ingredients: ['Creatine hydrochloride'],
    contraindications: ['Kidney disease', 'Consult doctor if on medication'],
    scientificStudies: [
      {
        title: 'Creatine hydrochloride bioavailability comparison',
        url: 'https://pubmed.ncbi.nlm.nih.gov/?term=creatine+hydrochloride+bioavailability',
        summary:
          'Preliminary evidence suggests enhanced solubility characteristics with creatine hydrochloride formulations.',
      },
    ],
    images: ['/images/supplements/creatine-hcl.jpg'],
    popularity: 71,
  },
  {
    name: 'EAA (Essential Amino Acids)',
    slug: createSlug('EAA (Essential Amino Acids)'),
    category: 'bcaa',
    goals: ['endurance', 'mass'],
    dosage: '10g during workout',
    timing: 'During training',
    duration: 'Training days',
    benefits: [
      'Complete amino acid profile',
      'Prevents muscle catabolism',
      'Supports muscle protein synthesis',
      'Better than BCAA alone',
    ],
    description:
      'Complete essential amino acid formula containing all 9 EAAs including the 3 BCAAs. Superior to BCAA alone for muscle building and recovery.',
    ingredients: [
      'L-Leucine',
      'L-Isoleucine',
      'L-Valine',
      'L-Lysine',
      'L-Threonine',
      'L-Phenylalanine',
      'L-Methionine',
      'L-Histidine',
      'L-Tryptophan',
    ],
    contraindications: ['Phenylketonuria (PKU) - contains phenylalanine'],
    scientificStudies: [
      {
        title: 'Essential amino acids and muscle protein synthesis',
        url: 'https://pubmed.ncbi.nlm.nih.gov/24284442/',
        summary:
          'EAA ingestion robustly stimulates muscle protein synthesis compared with non-essential amino acids alone.',
      },
    ],
    images: ['/images/supplements/eaa-essential-amino-acids.jpg'],
    popularity: 86,
  },
  {
    name: 'Ashwagandha KSM-66',
    slug: createSlug('Ashwagandha KSM-66'),
    category: 'recovery',
    goals: ['endurance'],
    dosage: '300-600mg daily',
    timing: 'With meals, morning or evening',
    duration: 'Daily',
    benefits: [
      'Reduces cortisol and stress',
      'Improves testosterone levels',
      'Enhances strength and recovery',
      'Better sleep quality',
    ],
    description:
      'Premium KSM-66 ashwagandha extract standardized to 5% withanolides. Clinically proven to reduce cortisol, improve testosterone, and enhance physical performance.',
    ingredients: ['Ashwagandha root extract KSM-66 (5% withanolides)'],
    contraindications: [
      'Pregnancy',
      'Autoimmune conditions',
      'Thyroid medication interaction',
    ],
    scientificStudies: [
      {
        title: 'Ashwagandha supplementation and strength/recovery outcomes',
        url: 'https://pubmed.ncbi.nlm.nih.gov/26609282/',
        summary:
          'Clinical data shows ashwagandha may improve strength, recovery markers, and stress resilience.',
      },
    ],
    images: ['/images/supplements/ashwagandha-ksm-66.jpg'],
    popularity: 88,
  },
];

const run = async (): Promise<void> => {
  try {
    await connectDatabase();

    const existing = await Supplement.find(
      { slug: { $in: supplementsData.map((item) => item.slug) } },
      { slug: 1 },
    )
      .lean()
      .exec();

    const existingSlugs = new Set(existing.map((item) => item.slug));
    const toInsert = supplementsData.filter((item) => !existingSlugs.has(item.slug));

    if (toInsert.length > 0) {
      await Supplement.insertMany(toInsert, { ordered: true });
    }

    const insertedCount = toInsert.length;
    const alreadyExistedCount = supplementsData.length - insertedCount;

    console.log(`Supplements inserted: ${insertedCount}`);
    console.log(`Supplements already existed: ${alreadyExistedCount}`);

    process.exit(0);
  } catch (error) {
    console.error('Supplement seed failed:', error);
    process.exit(1);
  }
};

void run();