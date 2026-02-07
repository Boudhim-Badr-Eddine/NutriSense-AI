import { SupplementSkeleton } from "@/components/supplements/SupplementSkeleton";

interface CardGridSkeletonProps {
  count?: number;
}

/**
 * WHY: Display a grid of placeholder cards while catalog data loads.
 */
export const CardGridSkeleton = ({ count = 6 }: CardGridSkeletonProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(count)].map((_, index) => (
        <SupplementSkeleton key={index} />
      ))}
    </div>
  );
};
