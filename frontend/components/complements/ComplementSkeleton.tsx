import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

/**
 * WHY: Provide a polished loading placeholder for complement cards.
 */
export const ComplementSkeleton = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="mb-2 h-6 w-20 animate-pulse rounded bg-gray-200" />
        <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
        </div>
      </CardContent>
      <CardFooter>
        <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
      </CardFooter>
    </Card>
  );
};
