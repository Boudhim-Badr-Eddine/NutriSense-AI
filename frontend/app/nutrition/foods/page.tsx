"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { FoodFilters, FoodFilterValues } from "@/components/foods/FoodFilters";
import { FoodTable } from "@/components/foods/FoodTable";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { useFoods } from "@/hooks/useFoods";

/**
 * WHY: Provide a searchable, filterable food catalog for nutrition exploration.
 */
export default function FoodsPage() {
  const [filters, setFilters] = useState<FoodFilterValues>({
    search: "",
    type: "all",
    diet: "all",
  });
  const [page, setPage] = useState(1);

  const queryParams = {
    search: filters.search || undefined,
    type: filters.type !== "all" ? filters.type : undefined,
    diet: filters.diet !== "all" ? filters.diet : undefined,
    page,
    limit: 20,
  };

  const { data, isLoading, error } = useFoods(queryParams);

  const handleFilterChange = (nextFilters: FoodFilterValues) => {
    setFilters(nextFilters);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">
            Foods Catalog
          </h1>
          <p className="text-lg text-gray-600">
            Search foods by diet or type and compare macro values per 100g.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <FoodFilters onFilterChange={handleFilterChange} />
          </div>

          <div className="lg:col-span-3">
            {isLoading && <div className="text-gray-500">Loading foods...</div>}
            {error && (
              <div className="py-12 text-center">
                <p className="text-red-500">
                  Error loading foods. Please try again.
                </p>
              </div>
            )}
            {data && !isLoading && (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  {data.pagination &&
                    `Showing ${data.data.length} of ${data.pagination.total} foods`}
                </div>
                <FoodTable foods={data.data} />

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
          </div>
        </div>
      </Container>
    </div>
  );
}
