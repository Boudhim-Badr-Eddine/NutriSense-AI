"use client";

import { Droplet } from "lucide-react";

import { FoodTable } from "@/components/foods/FoodTable";
import { Container } from "@/components/layout/Container";
import { useTopFats } from "@/hooks/useFoods";

/**
 * WHY: Highlight the top healthy fat sources in a sortable table.
 */
export default function TopFatsPage() {
  const { data: foods, isLoading, error } = useTopFats();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Droplet className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Top Healthy Fats
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Foods ranked by fat content per 100g. Click any food for detailed
            nutritional information.
          </p>
        </div>

        {isLoading && <div className="text-gray-500">Loading...</div>}
        {error && <div className="text-red-500">Error loading foods</div>}
        {foods && <FoodTable foods={foods} highlightColumn="fats" />}
      </Container>
    </div>
  );
}
