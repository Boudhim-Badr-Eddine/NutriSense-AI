import type { Complement } from "@/types";

import { ComplementCard } from "./ComplementCard";

interface ComplementGridProps {
  complements: Complement[];
  onFavoriteClick?: (id: string) => void;
  favoritedIds?: string[];
}

/**
 * WHY: Maintain a consistent responsive grid layout for complements.
 */
export const ComplementGrid = ({
  complements,
  onFavoriteClick,
  favoritedIds = [],
}: ComplementGridProps) => {
  if (complements.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-gray-500">
          No complements found. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid items-stretch grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {complements.map((complement) => (
        <ComplementCard
          key={complement._id}
          complement={complement}
          onFavoriteClick={onFavoriteClick}
          isFavorited={favoritedIds.includes(complement._id)}
        />
      ))}
    </div>
  );
};
