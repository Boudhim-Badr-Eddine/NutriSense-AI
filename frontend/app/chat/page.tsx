import Link from 'next/link';

import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/button';

/**
 * WHY: Reserve a dedicated chat page while the widget UI is integrated.
 */
export default function ChatPage() {
  return (
    <div className='bg-gradient-to-br from-slate-900 via-slate-950 to-black py-20 text-white'>
      <Container>
        <div className='rounded-3xl border border-white/10 bg-white/5 p-10 shadow-xl'>
          <p className='text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300'>
            AI Assistant
          </p>
          <h1 className='mt-4 text-3xl font-semibold'>
            Chat with NutriSense AI
          </h1>
          <p className='mt-3 max-w-2xl text-slate-200'>
            The chat widget UI will be integrated here. For now, you can
            access the assistant via the API and see responses in the backend.
          </p>
          <div className='mt-6 flex flex-wrap gap-3'>
            <Button className='bg-emerald-500 text-slate-900 hover:bg-emerald-400' asChild>
              <Link href='/login'>Sign in to start</Link>
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
