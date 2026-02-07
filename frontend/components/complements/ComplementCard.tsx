import { ArrowRight, Heart } from "lucide-react";
import Link from "next/link";

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
import type { Complement } from "@/types";

interface ComplementCardProps {
  complement: Complement;
  onFavoriteClick?: (id: string) => void;
  isFavorited?: boolean;
}

/**
 * WHY: Present a quick overview of a complement with primary actions.
 */
export const ComplementCard = ({
  complement,
  onFavoriteClick,
  isFavorited,
}: ComplementCardProps) => {
  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <Badge variant="secondary" className="mb-2">
            {complement.category}
          </Badge>
          {onFavoriteClick && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(event) => {
                event.preventDefault();
                onFavoriteClick(complement._id);
              }}
            >
              <Heart
                className={`h-5 w-5 ${isFavorited ? "fill-red-500 text-red-500" : ""}`}
              />
            </Button>
          )}
        </div>
        <CardTitle className="line-clamp-2">{complement.name}</CardTitle>
        <CardDescription className="line-clamp-3">
          {complement.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3 text-sm">
        <div>
          <span className="font-semibold">Role:</span>{" "}
          <span className="line-clamp-2">{complement.biologicalRole}</span>
        </div>
        {complement.deficiencySymptoms?.length > 0 && (
          <div>
            <span className="font-semibold">Deficiency signs:</span>
            <ul className="mt-1 list-disc list-inside">
              {complement.deficiencySymptoms
                .slice(0, 2)
                .map((symptom, index) => (
                  <li key={index} className="line-clamp-1">
                    {symptom}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link href={`/complements/${complement._id}`} className="w-full">
          <Button className="w-full">
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
