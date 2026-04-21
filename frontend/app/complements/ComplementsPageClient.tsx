"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/app/AuthContext";
import {
  ComplementFilters,
  ComplementFilterValues,
} from "@/components/complements/ComplementFilters";
import { ComplementGrid } from "@/components/complements/ComplementGrid";
import { EmptyState } from "@/components/errors/EmptyState";
import { ErrorMessage } from "@/components/errors/ErrorMessage";
import { Container } from "@/components/layout/Container";
import { CardGridSkeleton } from "@/components/skeletons/CardGridSkeleton";
import { Button } from "@/components/ui/button";
import {
  useComplements,
  useToggleComplementFavorite,
} from "@/hooks/useComplements";
import { fadeIn, staggerContainer } from "@/lib/animations";

/**
 * WHY: Deliver a full complements catalog with filters, pagination, and favorites.
 */
export const ComplementsPageClient = () => {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [favoriteOverrides, setFavoriteOverrides] = useState<
    Record<string, boolean>
  >({});
  const [filters, setFilters] = useState<ComplementFilterValues>({
    search: "",
    category: "all",
    sort: "-createdAt",
  });
  const rawPage = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const page = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  const queryParams = {
    search: filters.search || undefined,
    category: filters.category !== "all" ? filters.category : undefined,
    sort: filters.sort,
    page,
    limit: 12,
  };

  const { data, isLoading, error } = useComplements(queryParams);
  const toggleFavorite = useToggleComplementFavorite();

  const favoritedIds = useMemo(() => {
    const resolvedIds = new Set(user?.favorites?.complements || []);

    Object.entries(favoriteOverrides).forEach(([id, isFavorited]) => {
      if (isFavorited) {
        resolvedIds.add(id);
      } else {
        resolvedIds.delete(id);
      }
    });

    return Array.from(resolvedIds);
  }, [favoriteOverrides, user?.favorites?.complements]);

  const handleFavoriteClick = (id: string) => {
    if (!user) {
      alert("Please login to add favorites");
      return;
    }

    const nextIsFavorited = !favoritedIds.includes(id);
    setFavoriteOverrides((currentOverrides) => ({
      ...currentOverrides,
      [id]: nextIsFavorited,
    }));

    toggleFavorite.mutate(id, {
      onError: () => {
        setFavoriteOverrides((currentOverrides) => ({
          ...currentOverrides,
          [id]: !nextIsFavorited,
        }));
      },
    });
  };

  const handleFilterChange = (newFilters: ComplementFilterValues) => {
    const hasFiltersChanged =
      newFilters.search !== filters.search ||
      newFilters.category !== filters.category ||
      newFilters.sort !== filters.sort;

    if (!hasFiltersChanged) {
      return;
    }

    setFilters(newFilters);

    if (page !== 1) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (!data?.pagination) {
      return;
    }

    if (page > data.pagination.pages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(data.pagination.pages));
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [data?.pagination, page, pathname, router, searchParams]);

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
            Complements Catalog
          </h1>
          <p className="text-lg text-gray-600">
            Explore vitamins, minerals, and essential nutrients with
            science-backed guidance.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-8 lg:grid-cols-4"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div className="lg:col-span-1" variants={fadeIn}>
            <ComplementFilters onFilterChange={handleFilterChange} />
          </motion.div>

          <motion.div className="lg:col-span-3" variants={fadeIn}>
            {isLoading && <CardGridSkeleton />}

            {error && (
              <ErrorMessage message="Error loading complements. Please try again." />
            )}

            {data && !isLoading && data.data.length === 0 && (
              <EmptyState
                icon="package"
                title="No complements found"
                description="Try adjusting your filters or search term to find complements."
              />
            )}

            {data && !isLoading && data.data.length > 0 && (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  {data.pagination &&
                    `Showing ${data.data.length} of ${data.pagination.total} complements`}
                </div>
                <ComplementGrid
                  complements={data.data}
                  onFavoriteClick={handleFavoriteClick}
                  favoritedIds={favoritedIds}
                />

                {data.pagination && data.pagination.pages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      disabled={page === 1}
                      onClick={() => handlePageChange(page - 1)}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-2">
                      {Array.from(
                        { length: data.pagination.pages },
                        (_, idx) => idx + 1,
                      ).map((pageNumber) => (
                        <Button
                          key={pageNumber}
                          variant={pageNumber === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </Button>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      Page {page} of {data.pagination.pages}
                    </span>
                    <Button
                      variant="outline"
                      disabled={page === data.pagination.pages}
                      onClick={() => handlePageChange(page + 1)}
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
