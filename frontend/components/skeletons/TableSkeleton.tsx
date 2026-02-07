/**
 * WHY: Provide a table-like skeleton for nutrition lists.
 */
export const TableSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <div className="border-b p-4">
        <div className="h-10 animate-pulse rounded bg-gray-200" />
      </div>
      {[...Array(10)].map((_, index) => (
        <div key={index} className="flex gap-4 border-b p-4">
          <div className="h-6 w-1/4 animate-pulse rounded bg-gray-200" />
          <div className="h-6 w-1/6 animate-pulse rounded bg-gray-200" />
          <div className="h-6 w-1/6 animate-pulse rounded bg-gray-200" />
          <div className="h-6 w-1/6 animate-pulse rounded bg-gray-200" />
          <div className="h-6 w-1/6 animate-pulse rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
};
