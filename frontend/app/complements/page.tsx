"use client";

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { useAuth } from '@/app/AuthContext';
import { ComplementFilters, ComplementFilterValues } from '@/components/complements/ComplementFilters';
import { ComplementGrid } from '@/components/complements/ComplementGrid';
import { ComplementSkeleton } from '@/components/complements/ComplementSkeleton';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { useComplements, useToggleComplementFavorite } from '@/hooks/useComplements';

/**
 * WHY: Deliver a full complements catalog with filters, pagination, and favorites.
 */
export default function ComplementsPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<ComplementFilterValues>({
    search: '',
    category: 'all',
    sort: '-createdAt',
  });
  const [page, setPage] = useState(1);

  const queryParams = {
    search: filters.search || undefined,
    category: filters.category !== 'all' ? filters.category : undefined,
    sort: filters.sort,
    page,
    limit: 12,
  };

  const { data, isLoading, error } = useComplements(queryParams);
  const toggleFavorite = useToggleComplementFavorite();

  const handleFavoriteClick = (id: string) => {
    if (!user) {
      alert('Please login to add favorites');
      return;
    }
    toggleFavorite.mutate(id);
  };

  const handleFilterChange = (newFilters: ComplementFilterValues) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <Container>
        <div className='mb-8'>
          <h1 className='mb-2 text-4xl font-bold text-gray-900'>
            Complements Catalog
          </h1>
          <p className='text-lg text-gray-600'>
            Explore vitamins, minerals, and essential nutrients with science-backed guidance.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-4'>
          <div className='lg:col-span-1'>
            <ComplementFilters onFilterChange={handleFilterChange} />
          </div>

          <div className='lg:col-span-3'>
            {isLoading && (
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {[...Array(6)].map((_, index) => (
                  <ComplementSkeleton key={index} />
                ))}
              </div>
            )}

            {error && (
              <div className='py-12 text-center'>
                <p className='text-red-500'>Error loading complements. Please try again.</p>
              </div>
            )}

            {data && !isLoading && (
              <>
                <div className='mb-4 text-sm text-gray-600'>
                  {data.pagination &&
                    `Showing ${data.data.length} of ${data.pagination.total} complements`}
                </div>
                <ComplementGrid
                  complements={data.data}
                  onFavoriteClick={handleFavoriteClick}
                  favoritedIds={user?.favorites?.complements || []}
                />

                {data.pagination && data.pagination.pages > 1 && (
                  <div className='mt-8 flex items-center justify-center gap-4'>
                    <Button
                      variant='outline'
                      disabled={page === 1}
                      onClick={() => setPage((current) => current - 1)}
                    >
                      <ChevronLeft className='mr-2 h-4 w-4' />
                      Previous
                    </Button>
                    <span className='text-sm text-gray-600'>
                      Page {page} of {data.pagination.pages}
                    </span>
                    <Button
                      variant='outline'
                      disabled={page === data.pagination.pages}
                      onClick={() => setPage((current) => current + 1)}
                    >
                      Next
                      <ChevronRight className='ml-2 h-4 w-4' />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
