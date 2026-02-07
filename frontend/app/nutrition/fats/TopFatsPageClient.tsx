"use client";

import { motion } from "framer-motion";
import { Droplet } from "lucide-react";

import { EmptyState } from "@/components/errors/EmptyState";
import { ErrorMessage } from "@/components/errors/ErrorMessage";
import { FoodTable } from "@/components/foods/FoodTable";
import { Container } from "@/components/layout/Container";
import { PageHeaderSkeleton } from "@/components/skeletons/PageHeaderSkeleton";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { useTopFats } from "@/hooks/useFoods";
import { fadeIn } from "@/lib/animations";

/**
 * WHY: Highlight the top healthy fat sources in a sortable table.
 */
export const TopFatsPageClient = () => {
  const { data: foods, isLoading, error } = useTopFats();

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
            description="There are no fat entries available right now."
          />
        )}
        {foods && foods.length > 0 && (
          <motion.div variants={fadeIn} initial="initial" animate="animate">
            <FoodTable foods={foods} highlightColumn="fats" />
          </motion.div>
        )}
      </Container>
    </div>
  );
};
