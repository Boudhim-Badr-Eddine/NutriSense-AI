/**
 * WHY: Mirror detail page layouts while content loads.
 */
export const DetailPageSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6">
      <div className="rounded-lg bg-white p-8">
        <div className="mb-2 h-8 w-1/4 rounded bg-gray-200" />
        <div className="mb-4 h-12 w-3/4 rounded bg-gray-200" />
        <div className="mb-2 h-6 w-full rounded bg-gray-200" />
        <div className="h-6 w-5/6 rounded bg-gray-200" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="rounded-lg bg-white p-6">
            <div className="mb-4 h-6 w-1/2 rounded bg-gray-200" />
            <div className="h-10 w-3/4 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
};
