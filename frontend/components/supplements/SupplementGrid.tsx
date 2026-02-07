"use client";

import { motion } from "framer-motion";

import { staggerContainer } from "@/lib/animations";
import type { Supplement } from "@/types";
import { SupplementCard } from "./SupplementCard";

interface SupplementGridProps {
  supplements: Supplement[];
  onFavoriteClick?: (id: string) => void;
  favoritedIds?: string[];
}

export const SupplementGrid = ({
  supplements,
  onFavoriteClick,
  favoritedIds = [],
}: SupplementGridProps) => {
  if (supplements.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          No supplements found. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {supplements.map((supplement) => (
        <SupplementCard
          key={supplement._id}
          supplement={supplement}
          onFavoriteClick={onFavoriteClick}
          isFavorited={favoritedIds.includes(supplement._id)}
        />
      ))}
    </motion.div>
  );
};
