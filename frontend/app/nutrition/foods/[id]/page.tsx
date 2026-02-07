"use client";

import { ExternalLink, Heart } from "lucide-react";
import { useParams } from "next/navigation";

import { useAuth } from "@/app/AuthContext";
import { FoodCard } from "@/components/foods/FoodCard";
import { MacroChart } from "@/components/foods/MacroChart";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFood, useToggleFoodFavorite } from "@/hooks/useFoods";

/**
 * WHY: Provide a comprehensive nutritional breakdown for a single food.
 */
export default function FoodDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  const { data: food, isLoading, error } = useFood(id);
  const toggleFavorite = useToggleFoodFavorite();

  const isFavorited = user?.favorites?.foods?.includes(id);

  const handleFavoriteClick = () => {
    if (!user) {
      alert("Please login to add favorites");
      return;
    }
    toggleFavorite.mutate(id);
  };

  if (isLoading) {
    return (
      <Container className="py-8">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 w-3/4 rounded bg-gray-200" />
          <div className="h-4 w-1/3 rounded bg-gray-200" />
          <div className="h-64 rounded bg-gray-200" />
        </div>
      </Container>
    );
  }

  if (error || !food) {
    return (
      <Container className="py-8">
        <div className="text-center">
          <p className="text-red-500">Food not found</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="mb-3 text-4xl font-bold text-gray-900">{food.name}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary">{food.category}</Badge>
              {food.dietaryTags?.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <Button
            variant={isFavorited ? "default" : "outline"}
            size="lg"
            onClick={handleFavoriteClick}
          >
            <Heart className={`mr-2 h-5 w-5 ${isFavorited ? "fill-white" : ""}`} />
            {isFavorited ? "Favorited" : "Add to Favorites"}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <FoodCard food={food} />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Macro Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <MacroChart food={food} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nutritional Breakdown (per 100g)</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
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
                <div>
                  <p className="text-gray-500">Fiber</p>
                  <p className="font-semibold">{food.per100g.fiber} g</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              {food.benefits?.length ? (
                <ul className="space-y-2">
                  {food.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No benefits listed.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Meal Ideas</CardTitle>
            </CardHeader>
            <CardContent>
              {food.mealIdeas?.length ? (
                <ul className="space-y-2">
                  {food.mealIdeas.map((idea, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      <span>{idea}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No meal ideas listed.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vitamins</CardTitle>
            </CardHeader>
            <CardContent>
              {food.per100g.vitamins?.length ? (
                <ul className="space-y-2 text-sm">
                  {food.per100g.vitamins.map((vitamin, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{vitamin.name}</span>
                      <span className="font-semibold">
                        {vitamin.amount} {vitamin.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No vitamin data available.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Minerals</CardTitle>
            </CardHeader>
            <CardContent>
              {food.per100g.minerals?.length ? (
                <ul className="space-y-2 text-sm">
                  {food.per100g.minerals.map((mineral, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{mineral.name}</span>
                      <span className="font-semibold">
                        {mineral.amount} {mineral.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No mineral data available.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 bg-primary text-white">
          <CardContent className="p-6">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h3 className="mb-2 text-xl font-bold">
                  Need meal ideas with {food.name}?
                </h3>
                <p>Ask our AI assistant for personalized suggestions.</p>
              </div>
              <Button variant="secondary" size="lg">
                Ask AI <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
