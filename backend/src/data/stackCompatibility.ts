export interface CompatibilityRule {
  supplements: string[];
  type: 'synergy' | 'caution' | 'avoid' | 'neutral';
  title: string;
  reason: string;
  timing?: string;
}

export const COMPATIBILITY_RULES: CompatibilityRule[] = [
  {
    supplements: ['creatine', 'whey'],
    type: 'synergy',
    title: 'Perfect Performance Combo',
    reason:
      'Creatine improves strength and power while whey provides amino acids for muscle repair. Together they maximize muscle growth and recovery.',
    timing: 'Take creatine any time daily, whey immediately post-workout',
  },
  {
    supplements: ['vitamin d', 'magnesium'],
    type: 'synergy',
    title: 'Vitamin D Activation Duo',
    reason:
      'Magnesium is required to activate and convert Vitamin D in the body. Without magnesium, Vitamin D supplementation is far less effective.',
    timing: 'Take both with a meal containing fat',
  },
  {
    supplements: ['vitamin d', 'k2'],
    type: 'synergy',
    title: 'Bone & Calcium Optimization',
    reason:
      'Vitamin D3 increases calcium absorption while K2 directs calcium to bones instead of arteries, preventing calcification.',
    timing: 'Take together with a fatty meal',
  },
  {
    supplements: ['zinc', 'vitamin c'],
    type: 'synergy',
    title: 'Immune Power Stack',
    reason:
      'Zinc and Vitamin C work synergistically to boost immune function. Both are antioxidants that enhance immune cell production.',
    timing: 'Take together in the morning',
  },
  {
    supplements: ['bcaa', 'glutamine'],
    type: 'synergy',
    title: 'Recovery Optimization Stack',
    reason:
      'BCAAs stimulate muscle protein synthesis while Glutamine reduces muscle soreness and supports gut and immune health during recovery.',
    timing: 'Take together post-workout',
  },
  {
    supplements: ['omega-3', 'vitamin d'],
    type: 'synergy',
    title: 'Anti-Inflammatory Duo',
    reason:
      'Both reduce inflammation through different pathways. Omega-3 also improves Vitamin D absorption as it is fat-soluble.',
    timing: 'Take together with largest meal of the day',
  },
  {
    supplements: ['ashwagandha', 'magnesium'],
    type: 'synergy',
    title: 'Stress & Sleep Stack',
    reason:
      'Ashwagandha reduces cortisol while magnesium activates the parasympathetic nervous system. Together they dramatically improve sleep quality and stress resilience.',
    timing: 'Take both 30-60 minutes before bed',
  },
  {
    supplements: ['creatine', 'beta-alanine'],
    type: 'synergy',
    title: 'Performance Endurance Stack',
    reason:
      'Creatine boosts short burst power (ATP) while Beta-Alanine buffers lactic acid for endurance. Together they cover all aspects of athletic performance.',
    timing: 'Take both pre-workout',
  },
  {
    supplements: ['zinc', 'calcium'],
    type: 'caution',
    title: 'Absorption Competition',
    reason:
      'Zinc and Calcium compete for the same absorption receptors in the intestine. Taking together significantly reduces zinc absorption.',
    timing: 'Take zinc in the morning, calcium in the evening',
  },
  {
    supplements: ['iron', 'calcium'],
    type: 'caution',
    title: 'Iron Absorption Blocker',
    reason:
      'Calcium is one of the strongest inhibitors of iron absorption. Even small amounts of calcium can reduce iron absorption by up to 60%.',
    timing: 'Separate by at least 2 hours. Take iron with Vitamin C instead',
  },
  {
    supplements: ['zinc', 'iron'],
    type: 'caution',
    title: 'Mineral Competition',
    reason:
      'Zinc and Iron share the same transport proteins. High doses of either can block the other. Keep doses moderate if taking both.',
    timing: 'Take at different meals',
  },
  {
    supplements: ['magnesium', 'calcium'],
    type: 'caution',
    title: 'Balance Required',
    reason:
      'Magnesium and calcium work together but compete at high doses. Ideal ratio is 1:2 (magnesium:calcium). Too much calcium can cause magnesium deficiency.',
    timing: 'Take calcium with morning meal, magnesium at night',
  },
  {
    supplements: ['pre-workout', 'caffeine'],
    type: 'caution',
    title: 'Stimulant Overload Risk',
    reason:
      'Pre-workouts already contain caffeine. Adding extra caffeine (coffee, caffeine pills) can cause anxiety, heart palpitations, and insomnia.',
    timing: 'Do not add extra caffeine when using pre-workout',
  },
  {
    supplements: ['iron', 'vitamin e'],
    type: 'avoid',
    title: 'Antioxidant Interference',
    reason:
      'Vitamin E (a fat-soluble antioxidant) can interfere with iron absorption and metabolism when taken together in high doses.',
    timing: 'Separate by at least 4 hours',
  },
  {
    supplements: ['whey', 'casein'],
    type: 'neutral',
    title: 'Protein Source Overlap',
    reason:
      'Both are dairy proteins. Safe to use but redundant - whey is better post-workout (fast) and casein before bed (slow). No interaction issues.',
    timing: 'Whey post-workout, casein before bed',
  },
];

export default COMPATIBILITY_RULES;
