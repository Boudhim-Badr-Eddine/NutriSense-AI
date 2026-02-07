"use client";

import { motion } from "framer-motion";
import { Beef } from "lucide-react";

import { EmptyState } from "@/components/errors/EmptyState";
import { ErrorMessage } from "@/components/errors/ErrorMessage";
import { FoodTable } from "@/components/foods/FoodTable";
import { Container } from "@/components/layout/Container";
import { PageHeaderSkeleton } from "@/components/skeletons/PageHeaderSkeleton";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { useTopProteins } from "@/hooks/useFoods";
import { fadeIn } from "@/lib/animations";

/**
 * WHY: Highlight the top protein-rich foods in a sortable table.
 */
export const TopProteinsPageClient = () => {
  const { data: foods, isLoading, error } = useTopProteins();

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
            description="There are no protein entries available right now."
          />
        )}
        {foods && foods.length > 0 && (
          <motion.div variants={fadeIn} initial="initial" animate="animate">
            <FoodTable foods={foods} highlightColumn="proteins" />
          </motion.div>
        )}
      </Container>
    </div>
  );
};
