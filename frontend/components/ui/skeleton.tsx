import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

/**
 * WHY: Provide a reusable loading shimmer block for layouts.
 */
export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div className={cn("animate-pulse rounded-md bg-gray-200", className)} />
  );
};
