"use client";

import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import type { Food } from "@/types";

interface FoodTableRowProps {
  food: Food;
  index: number;
  highlightColumn?: "proteins" | "carbs" | "fats";
}

/**
 * WHY: Keep ranking rows clickable for quick detail navigation.
 */
export const FoodTableRow = ({
  food,
  index,
  highlightColumn,
}: FoodTableRowProps) => {
  const router = useRouter();
  const detailPath = `/nutrition/foods/${food.slug || food._id}`;

  const proteinCalRatio =
    food.per100g.calories > 0
      ? (((food.per100g.proteins * 4) / food.per100g.calories) * 100).toFixed(1)
      : "0";

  return (
    <TableRow
      className="cursor-pointer transition-colors hover:bg-gray-50"
      onClick={() => router.push(detailPath)}
    >
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          {food.image && (
            <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
              <img
                src={food.image}
                alt={food.name}
                className="w-full h-full object-contain p-1"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "/images/placeholders/food.svg";
                }}
              />
            </div>
          )}
          {index < 3 && (
            <Badge variant={index === 0 ? "default" : "secondary"}>
              #{index + 1}
            </Badge>
          )}
          {food.name}
        </div>
      </TableCell>
      <TableCell>{food.per100g.calories} kcal</TableCell>
      <TableCell
        className={
          highlightColumn === "proteins" ? "bg-primary/10 font-bold" : ""
        }
      >
        {food.per100g.proteins}g
      </TableCell>
      <TableCell
        className={highlightColumn === "carbs" ? "bg-primary/10 font-bold" : ""}
      >
        {food.per100g.carbs}g
      </TableCell>
      <TableCell
        className={highlightColumn === "fats" ? "bg-primary/10 font-bold" : ""}
      >
        {food.per100g.fats}g
      </TableCell>
      <TableCell>{proteinCalRatio}%</TableCell>
    </TableRow>
  );
};
