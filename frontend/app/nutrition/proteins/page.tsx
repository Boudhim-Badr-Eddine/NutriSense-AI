"use client";

import { Beef } from "lucide-react";

import { FoodTable } from "@/components/foods/FoodTable";
import { Container } from "@/components/layout/Container";
import { useTopProteins } from "@/hooks/useFoods";

/**
 * WHY: Highlight the top protein-rich foods in a sortable table.
 */
export default function TopProteinsPage() {
  const { data: foods, isLoading, error } = useTopProteins();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Beef className="h-6 w-6 text-red-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Top Protein Sources
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Foods ranked by protein content per 100g. Click any food for
            detailed nutritional information.
          </p>
        </div>

        {isLoading && <div className="text-gray-500">Loading...</div>}
        {error && <div className="text-red-500">Error loading foods</div>}
        {foods && <FoodTable foods={foods} highlightColumn="proteins" />}
      </Container>
    </div>
  );
}
