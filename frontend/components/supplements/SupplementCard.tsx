import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Supplement } from "@/types";
import { ArrowRight, Heart } from "lucide-react";
import Link from "next/link";

interface SupplementCardProps {
  supplement: Supplement;
  onFavoriteClick?: (id: string) => void;
  isFavorited?: boolean;
}

export const SupplementCard = ({
  supplement,
  onFavoriteClick,
  isFavorited,
}: SupplementCardProps) => {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Badge variant="secondary" className="mb-2">
            {supplement.category}
          </Badge>
          {onFavoriteClick && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                onFavoriteClick(supplement._id);
              }}
            >
              <Heart
                className={`h-5 w-5 ${isFavorited ? "fill-red-500 text-red-500" : ""}`}
              />
            </Button>
          )}
        </div>
        <CardTitle className="line-clamp-2">{supplement.name}</CardTitle>
        <CardDescription className="line-clamp-3">
          {supplement.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-semibold">Dosage:</span> {supplement.dosage}
          </div>
          <div>
            <span className="font-semibold">Timing:</span> {supplement.timing}
          </div>
          {supplement.benefits && supplement.benefits.length > 0 && (
            <div>
              <span className="font-semibold">Benefits:</span>
              <ul className="list-disc list-inside mt-1">
                {supplement.benefits.slice(0, 3).map((benefit, idx) => (
                  <li key={idx} className="line-clamp-1">
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/supplements/${supplement._id}`} className="w-full">
          <Button className="w-full" variant="default">
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
