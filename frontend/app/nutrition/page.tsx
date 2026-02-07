import Link from 'next/link';

import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/button';

/**
 * WHY: Provide a landing scaffold until nutrition ranking views are wired.
 */
export default function NutritionPage() {
  return (
    <div className='bg-slate-900 py-16 text-white'>
      <Container>
        <div className='rounded-3xl border border-white/10 bg-slate-800/70 p-10 shadow-lg'>
          <p className='text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300'>
            Nutrition Guide
          </p>
          <h1 className='mt-4 text-3xl font-semibold'>
            Macro-rich foods, ranked
          </h1>
          <p className='mt-3 max-w-2xl text-slate-200'>
            Compare the best protein, carbohydrate, and fat sources with
            efficiency scores. The ranking tables and filters will be
            available soon.
          </p>
          <div className='mt-6 flex flex-wrap gap-3'>
            <Button className='bg-emerald-500 text-slate-900 hover:bg-emerald-400' asChild>
              <Link href='/chat'>Ask the AI assistant</Link>
            </Button>
            <Button variant='outline' className='border-white/30 text-white' asChild>
              <Link href='/'>Back to home</Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
