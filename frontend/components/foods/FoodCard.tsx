import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Food } from "@/types";

interface FoodCardProps {
  food: Food;
}

/**
 * WHY: Provide a compact nutrition summary block for food detail pages.
 */
export const FoodCard = ({ food }: FoodCardProps) => {
  return (
    <Card className="overflow-hidden">
      {food.image && (
        <div className="relative h-48 w-full">
          <Image
            src={food.image}
            alt={food.name}
            fill
            className="object-cover"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{food.category}</Badge>
          <Badge>{food.type}</Badge>
        </div>
        <CardTitle className="mt-2">{food.name}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Calories</p>
          <p className="font-semibold">{food.per100g.calories} kcal</p>
        </div>
        <div>
          <p className="text-gray-500">Proteins</p>
          <p className="font-semibold">{food.per100g.proteins} g</p>
        </div>
        <div>
          <p className="text-gray-500">Carbs</p>
          <p className="font-semibold">{food.per100g.carbs} g</p>
        </div>
        <div>
          <p className="text-gray-500">Fats</p>
          <p className="font-semibold">{food.per100g.fats} g</p>
        </div>
      </CardContent>
    </Card>
  );
};
