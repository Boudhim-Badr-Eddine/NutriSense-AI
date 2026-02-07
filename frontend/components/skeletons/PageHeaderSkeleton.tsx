/**
 * WHY: Simulate page headers while data loads.
 */
export const PageHeaderSkeleton = () => {
  return (
    <div className="mb-8 animate-pulse">
      <div className="mb-2 h-10 w-3/4 rounded bg-gray-200" />
      <div className="h-6 w-1/2 rounded bg-gray-200" />
    </div>
  );
};
