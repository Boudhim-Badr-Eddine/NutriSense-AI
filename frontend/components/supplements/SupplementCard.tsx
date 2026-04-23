"use client";

import { motion } from "framer-motion";
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
import { fadeIn } from "@/lib/animations";
import { formatPrice, getSupplementPrice } from "@/lib/productPricing";
import type { Supplement } from "@/types";

interface SupplementCardProps {
  supplement: Supplement;
  onFavoriteClick?: (id: string) => void;
  isFavorited?: boolean;
}

const supplementAvisPool = [
  { text: "Great energy and recovery after workouts.", rating: 4.5 },
  { text: "Easy to use and the results feel consistent.", rating: 4.0 },
  { text: "Good quality, no stomach discomfort for me.", rating: 3.5 },
  { text: "Works, but taste can be improved.", rating: 2.5 },
  { text: "Noticeable support for training performance.", rating: 4.0 },
  { text: "Decent option for beginners on a budget.", rating: 3.0 },
];

const getSupplementAvis = (key: string) => {
  const seed = key
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);
  const firstIndex = seed % supplementAvisPool.length;
  let secondIndex = (seed * 3 + 2) % supplementAvisPool.length;

  if (secondIndex === firstIndex) {
    secondIndex = (secondIndex + 1) % supplementAvisPool.length;
  }

  return [supplementAvisPool[firstIndex], supplementAvisPool[secondIndex]];
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

export const SupplementCard = ({
  supplement,
  onFavoriteClick,
  isFavorited,
}: SupplementCardProps) => {
  const detailPath = `/supplements/${supplement.slug || supplement._id}`;
  const priceLabel = formatPrice(getSupplementPrice(supplement));
  const avis = getSupplementAvis(supplement.slug || supplement._id);

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="group flex h-full flex-col overflow-hidden border-slate-200 transition-shadow hover:shadow-xl">
        {supplement.images?.[0] && (
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50 p-3">
            <img
              src={supplement.images[0]}
              alt={supplement.name}
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
              {supplement.category}
            </Badge>
            {onFavoriteClick && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(event) => {
                  event.preventDefault();
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
          <div className="text-base font-semibold text-emerald-700">
            {priceLabel}
          </div>
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
                <ul className="mt-1 list-inside list-disc">
                  {supplement.benefits.slice(0, 3).map((benefit, idx) => (
                    <li key={idx} className="line-clamp-1">
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
              <ul className="space-y-1 text-xs text-slate-600">
                {avis.map((review, index) => (
                  <li key={`${supplement._id}-avis-${index}`}>
                    <div className="mb-1 flex items-center gap-1 text-amber-500">
                      {renderRatingStars(
                        review.rating,
                        `${supplement._id}-${index}`,
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
          </div>
        </CardContent>
        <CardFooter>
          <Link href={detailPath} className="w-full">
            <Button className="w-full" variant="default">
              How to Use & Details <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
