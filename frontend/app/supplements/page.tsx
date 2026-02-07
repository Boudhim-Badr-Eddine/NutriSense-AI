import Link from 'next/link';

import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/button';

/**
 * WHY: Provide a landing scaffold until the supplements catalog is wired.
 */
export default function SupplementsPage() {
  return (
    <div className='bg-slate-50 py-16'>
      <Container>
        <div className='rounded-3xl border border-slate-200 bg-white p-10 shadow-sm'>
          <p className='text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600'>
            Supplements
          </p>
          <h1 className='mt-4 text-3xl font-semibold text-slate-900'>
            Explore performance supplements
          </h1>
          <p className='mt-3 max-w-2xl text-slate-600'>
            Browse curated supplements by category, goals, and popularity.
            Real-time search and filters will appear here once the data hooks
            are connected.
          </p>
          <div className='mt-6 flex flex-wrap gap-3'>
            <Button asChild>
              <Link href='/login'>Sign in to save favorites</Link>
            </Button>
            <Button variant='outline' asChild>
              <Link href='/'>Back to home</Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
