"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { useAuth } from "@/app/AuthContext";
import { EmptyState } from "@/components/errors/EmptyState";
import { ErrorMessage } from "@/components/errors/ErrorMessage";
import { Container } from "@/components/layout/Container";
import { CardGridSkeleton } from "@/components/skeletons/CardGridSkeleton";
import { SupplementFilters } from "@/components/supplements/SupplementFilters";
import { SupplementGrid } from "@/components/supplements/SupplementGrid";
import { Button } from "@/components/ui/button";
import { useSupplements, useToggleFavorite } from "@/hooks/useSupplements";
import { fadeIn, staggerContainer } from "@/lib/animations";

interface SupplementFilterValues {
  search: string;
  category: string;
  goal: string;
  sort: string;
}

/**
 * WHY: Deliver a full supplements catalog with filters, pagination, and favorites.
 */
export const SupplementsPageClient = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<SupplementFilterValues>({
    search: "",
    category: "all",
    goal: "all",
    sort: "-popularity",
  });
  const [page, setPage] = useState(1);

  const queryParams = {
    search: filters.search || undefined,
    category: filters.category !== "all" ? filters.category : undefined,
    goal: filters.goal !== "all" ? filters.goal : undefined,
    sort: filters.sort,
    page,
    limit: 12,
  };

  const { data, isLoading, error, refetch } = useSupplements(queryParams);
  const toggleFavorite = useToggleFavorite();

  const handleFavoriteClick = (id: string) => {
    if (!user) {
      alert("Please login to add favorites");
      return;
    }
    toggleFavorite.mutate(id);
  };

  const handleFilterChange = (newFilters: SupplementFilterValues) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        <motion.div
          className="mb-8"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <h1 className="mb-2 text-4xl font-bold text-gray-900">
            Supplements Catalog
          </h1>
          <p className="text-lg text-gray-600">
            Discover sports supplements and performance enhancers tailored to
            your goals.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-8 lg:grid-cols-4"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div className="lg:col-span-1" variants={fadeIn}>
            <SupplementFilters onFilterChange={handleFilterChange} />
          </motion.div>

          <motion.div className="lg:col-span-3" variants={fadeIn}>
            {isLoading && <CardGridSkeleton />}

            {error && (
              <ErrorMessage
                message="Error loading supplements. Please try again."
                onRetry={() => void refetch()}
              />
            )}

            {data && !isLoading && data.data.length === 0 && (
              <EmptyState
                icon="package"
                title="No supplements found"
                description="Try adjusting your filters or search term to find supplements."
              />
            )}

            {data && !isLoading && data.data.length > 0 && (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  {data.pagination &&
                    `Showing ${data.data.length} of ${data.pagination.total} supplements`}
                </div>
                <SupplementGrid
                  supplements={data.data}
                  onFavoriteClick={handleFavoriteClick}
                  favoritedIds={user?.favorites?.supplements || []}
                />

                {data.pagination && data.pagination.pages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      disabled={page === 1}
                      onClick={() => setPage((current) => current - 1)}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                      Page {page} of {data.pagination.pages}
                    </span>
                    <Button
                      variant="outline"
                      disabled={page === data.pagination.pages}
                      onClick={() => setPage((current) => current + 1)}
                    >
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
};
