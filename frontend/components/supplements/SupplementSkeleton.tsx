import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export const SupplementSkeleton = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="h-6 w-20 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
        </div>
      </CardContent>
      <CardFooter>
        <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
      </CardFooter>
    </Card>
  );
};
