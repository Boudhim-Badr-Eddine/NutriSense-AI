import { ArrowRight, Heart, Star, StarHalf } from "lucide-react";
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
import { formatPrice, getComplementPrice } from "@/lib/productPricing";
import type { Complement } from "@/types";

interface ComplementCardProps {
  complement: Complement;
  onFavoriteClick?: (id: string) => void;
  isFavorited?: boolean;
}

const complementAvisPool = [
  { text: "Very helpful for daily balance and focus.", rating: 4.0 },
  { text: "Simple to add to my routine, good quality.", rating: 3.5 },
  { text: "I noticed better consistency after two weeks.", rating: 4.5 },
  { text: "Clean formula and easy to tolerate.", rating: 4.0 },
  { text: "Good overall, but effect was moderate for me.", rating: 2.5 },
  { text: "Feels effective and well-dosed.", rating: 3.0 },
];

const getComplementAvis = (key: string) => {
  const seed = key
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);
  const firstIndex = seed % complementAvisPool.length;
  let secondIndex = (seed * 5 + 1) % complementAvisPool.length;

  if (secondIndex === firstIndex) {
    secondIndex = (secondIndex + 2) % complementAvisPool.length;
  }

  return [complementAvisPool[firstIndex], complementAvisPool[secondIndex]];
};

const renderRatingStars = (rating: number, keyBase: string) => {
  return Array.from({ length: 5 }, (_, index) => {
    const starNumber = index + 1;
    const isFull = rating >= starNumber;
    const isHalf = !isFull && rating >= starNumber - 0.5;

    if (isFull) {
      return (
        <Star
          key={`${keyBase}-full-${starNumber}`}
          className="h-3.5 w-3.5 fill-current"
        />
      );
    }

    if (isHalf) {
      return (
        <StarHalf
          key={`${keyBase}-half-${starNumber}`}
          className="h-3.5 w-3.5 fill-current"
        />
      );
    }

    return (
      <Star
        key={`${keyBase}-empty-${starNumber}`}
        className="h-3.5 w-3.5 text-amber-200"
      />
    );
  });
};

/**
 * WHY: Present a quick overview of a complement with primary actions.
 */
export const ComplementCard = ({
  complement,
  onFavoriteClick,
  isFavorited,
}: ComplementCardProps) => {
  const detailPath = `/complements/${complement.slug || complement._id}`;
  const priceLabel = formatPrice(getComplementPrice(complement));
  const avis = getComplementAvis(complement.slug || complement._id);

  return (
    <Card className="group flex h-full flex-col overflow-hidden border-slate-200 transition-shadow hover:shadow-xl">
      {complement.images?.[0] && (
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50 p-3">
          <img
            src={complement.images[0]}
            alt={complement.name}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = "/images/placeholders/product.svg";
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
        </div>
      )}
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
        <div className="text-base font-semibold text-emerald-700">
          {priceLabel}
        </div>
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

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
          <ul className="space-y-1 text-xs text-slate-600">
            {avis.map((review, index) => (
              <li key={`${complement._id}-avis-${index}`}>
                <div className="mb-1 flex items-center gap-1 text-amber-500">
                  {renderRatingStars(
                    review.rating,
                    `${complement._id}-${index}`,
                  )}
                  <span className="ml-1 text-[11px] font-semibold text-slate-500">
                    {review.rating.toFixed(1)}/5
                  </span>
                </div>
                <p className="line-clamp-1">&ldquo;{review.text}&rdquo;</p>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={detailPath} className="w-full">
          <Button className="w-full">
            How to Use & Details <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
