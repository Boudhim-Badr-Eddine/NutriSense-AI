"use client";

import { motion } from "framer-motion";
import { ExternalLink, Heart, ImageIcon } from "lucide-react";

import { useAuth } from "@/app/AuthContext";
import { ErrorMessage } from "@/components/errors/ErrorMessage";
import { NotFound } from "@/components/errors/NotFound";
import { MacroChart } from "@/components/foods/MacroChart";
import { Container } from "@/components/layout/Container";
import { DetailPageSkeleton } from "@/components/skeletons/DetailPageSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFood, useToggleFoodFavorite } from "@/hooks/useFoods";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { openChatWithQuestion } from "@/lib/chatUtils";

interface FoodDetailPageClientProps {
  id: string;
}

/**
 * WHY: Provide an animated nutritional breakdown for a single food.
 */
export const FoodDetailPageClient = ({ id }: FoodDetailPageClientProps) => {
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
        <DetailPageSkeleton />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-8">
        <ErrorMessage
          title="Unable to load food"
          message="We couldn't fetch this food right now. Please try again."
        />
      </Container>
    );
  }

  if (!food) {
    return <NotFound resource="Food" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        <motion.div variants={staggerContainer} initial="initial" animate="animate">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="w-full lg:w-[380px] shrink-0">
              <div className="sticky top-24 rounded-2xl bg-gray-50 border border-gray-100 p-8 aspect-square flex items-center justify-center overflow-hidden">
                {food.image ? (
                  <img
                    src={food.image}
                    alt={food.name}
                    className="max-w-full max-h-full object-contain drop-shadow-lg"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ImageIcon className="w-24 h-24" />
                  </div>
                )}
              </div>
            </div>

            <motion.div variants={fadeIn} className="flex-1 min-w-0 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="mb-3 text-4xl font-bold text-gray-900">
                    {food.name}
                  </h1>
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
                  <Heart
                    className={`mr-2 h-5 w-5 ${isFavorited ? "fill-white" : ""}`}
                  />
                  {isFavorited ? "Favorited" : "Add to Favorites"}
                </Button>
              </div>

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
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={fadeIn}>
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
          </motion.div>

          <motion.div variants={fadeIn}>
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
          </motion.div>

          <motion.div variants={fadeIn}>
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
          </motion.div>

          <motion.div variants={fadeIn}>
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
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-6"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <Card className="bg-primary text-white">
            <CardContent className="p-6">
              <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h3 className="mb-2 text-xl font-bold">
                    Need meal ideas with {food.name}?
                  </h3>
                  <p>Ask our AI assistant for personalized suggestions.</p>
                </div>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() =>
                    openChatWithQuestion(`Give me meal ideas with ${food.name}`)
                  }
                >
                  Ask AI <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
};
