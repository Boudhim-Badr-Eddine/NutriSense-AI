"use client";

import { motion } from "framer-motion";
import { Wheat } from "lucide-react";

import { EmptyState } from "@/components/errors/EmptyState";
import { ErrorMessage } from "@/components/errors/ErrorMessage";
import { FoodTable } from "@/components/foods/FoodTable";
import { Container } from "@/components/layout/Container";
import { PageHeaderSkeleton } from "@/components/skeletons/PageHeaderSkeleton";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { useTopCarbs } from "@/hooks/useFoods";
import { fadeIn } from "@/lib/animations";

/**
 * WHY: Highlight the top carbohydrate-rich foods in a sortable table.
 */
export const TopCarbsPageClient = () => {
  const { data: foods, isLoading, error } = useTopCarbs();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        {isLoading ? (
          <PageHeaderSkeleton />
        ) : (
          <motion.div
            className="mb-8"
            variants={fadeIn}
            initial="initial"
            animate="animate"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                <Wheat className="h-6 w-6 text-yellow-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">
                Top Carbohydrate Sources
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              Foods ranked by carbohydrate content per 100g. Click any food for
              detailed nutritional information.
            </p>
          </motion.div>
        )}

        {isLoading && <TableSkeleton />}
        {error && (
          <ErrorMessage message="Error loading foods. Please try again." />
        )}
        {foods && foods.length === 0 && (
          <EmptyState
            icon="food"
            title="No foods found"
            description="There are no carbohydrate entries available right now."
          />
        )}
        {foods && foods.length > 0 && (
          <motion.div variants={fadeIn} initial="initial" animate="animate">
            <FoodTable foods={foods} highlightColumn="carbs" />
          </motion.div>
        )}
      </Container>
    </div>
  );
};
