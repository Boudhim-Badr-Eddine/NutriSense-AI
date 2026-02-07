import type { Food } from "@/types";

interface MacroChartProps {
  food: Food;
}

/**
 * WHY: Visualize macro calorie contributions at a glance.
 */
export const MacroChart = ({ food }: MacroChartProps) => {
  const proteinCalories = food.per100g.proteins * 4;
  const carbCalories = food.per100g.carbs * 4;
  const fatCalories = food.per100g.fats * 9;
  const totalCalories = proteinCalories + carbCalories + fatCalories;

  const proteinPercent =
    totalCalories > 0 ? (proteinCalories / totalCalories) * 100 : 0;
  const carbPercent =
    totalCalories > 0 ? (carbCalories / totalCalories) * 100 : 0;
  const fatPercent =
    totalCalories > 0 ? (fatCalories / totalCalories) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-gray-100">
        <div className="bg-red-500" style={{ width: `${proteinPercent}%` }} />
        <div className="bg-yellow-500" style={{ width: `${carbPercent}%` }} />
        <div className="bg-blue-500" style={{ width: `${fatPercent}%` }} />
      </div>
      <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          <span className="text-gray-600">Protein</span>
          <span className="font-semibold">{proteinPercent.toFixed(1)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-yellow-500" />
          <span className="text-gray-600">Carbs</span>
          <span className="font-semibold">{carbPercent.toFixed(1)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          <span className="text-gray-600">Fats</span>
          <span className="font-semibold">{fatPercent.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};
