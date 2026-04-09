import type { Metadata } from "next";

import { NutritionCard } from '@/components/foods/NutritionCard';
import { Container } from '@/components/layout/Container';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: "Nutrition Guide",
  description:
    "Discover top protein, carb, and healthy fat sources with clear nutrition rankings.",
  keywords: [
    "nutrition guide",
    "proteins",
    "carbohydrates",
    "healthy fats",
    "foods",
    "macros",
    "diet",
  ],
  openGraph: {
    title: "Nutrition Guide | NutriSense AI",
    description:
      "Discover top protein, carb, and healthy fat sources with clear nutrition rankings.",
    type: "website",
    url: "https://nutrisense-ai.com/nutrition",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nutrition Guide | NutriSense AI",
    description:
      "Discover top protein, carb, and healthy fat sources with clear nutrition rankings.",
  },
};

/**
 * WHY: Introduce the nutrition guide and route users to ranking pages.
 */
export default function NutritionGuidePage() {
  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <Container>
        <div className='mb-12 text-center'>
          <h1 className='mb-4 text-5xl font-bold text-gray-900'>
            Nutrition Guide
          </h1>
          <p className='mx-auto max-w-2xl text-xl text-gray-600'>
            Discover the best food sources for your macronutrient needs.
            Compare nutritional values and make informed dietary choices.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          <NutritionCard
            title='Top Protein Sources'
            description='Discover foods with the highest protein content per 100g.'
            href='/nutrition/proteins'
            icon='protein'
            toneClass='bg-red-100 text-red-600'
          />
          <NutritionCard
            title='Top Carbohydrate Sources'
            description='Find the best energy sources for your active lifestyle.'
            href='/nutrition/carbs'
            icon='carbs'
            toneClass='bg-yellow-100 text-yellow-600'
          />
          <NutritionCard
            title='Top Healthy Fats'
            description='Explore sources of essential fatty acids and healthy fats.'
            href='/nutrition/fats'
            icon='fats'
            toneClass='bg-blue-100 text-blue-600'
          />
        </div>

        <Card className='mt-12'>
          <CardContent className='p-8'>
            <h2 className='mb-4 text-2xl font-bold'>Understanding Macronutrients</h2>
            <div className='grid gap-6 md:grid-cols-3'>
              <div>
                <h3 className='mb-2 font-bold text-red-600'>Proteins</h3>
                <p className='text-sm text-gray-600'>
                  Essential for muscle growth, repair, and maintenance. Provides 4 calories per gram.
                </p>
              </div>
              <div>
                <h3 className='mb-2 font-bold text-yellow-600'>Carbohydrates</h3>
                <p className='text-sm text-gray-600'>
                  Primary energy source for your body and brain. Provides 4 calories per gram.
                </p>
              </div>
              <div>
                <h3 className='mb-2 font-bold text-blue-600'>Fats</h3>
                <p className='text-sm text-gray-600'>
                  Vital for hormone production and nutrient absorption. Provides 9 calories per gram.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
