"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Calendar,
  Clock,
  ExternalLink,
  Heart,
  Pill,
} from "lucide-react";

import { useAuth } from "@/app/AuthContext";
import { ErrorMessage } from "@/components/errors/ErrorMessage";
import { NotFound } from "@/components/errors/NotFound";
import { Container } from "@/components/layout/Container";
import { DetailPageSkeleton } from "@/components/skeletons/DetailPageSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupplement, useToggleFavorite } from "@/hooks/useSupplements";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { openChatWithQuestion } from "@/lib/chatUtils";

interface SupplementDetailPageClientProps {
  id: string;
}

/**
 * WHY: Provide an animated supplement detail experience with favorites and AI help.
 */
export const SupplementDetailPageClient = ({
  id,
}: SupplementDetailPageClientProps) => {
  const { user } = useAuth();
  const { data: supplement, isLoading, error } = useSupplement(id);
  const toggleFavorite = useToggleFavorite();

  const isFavorited = user?.favorites?.supplements?.includes(id);

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
          title="Unable to load supplement"
          message="We couldn't fetch this supplement right now. Please try again."
        />
      </Container>
    );
  }

  if (!supplement) {
    return <NotFound resource="Supplement" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        <motion.div
          className="mb-6 rounded-lg bg-white p-8 shadow-sm"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {supplement.images?.[0] && (
              <div className="w-full lg:w-[420px] sticky top-24">
                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-6 aspect-square flex items-center justify-center">
                  <img
                    src={supplement.images[0]}
                    alt={supplement.name}
                    className="object-contain max-w-full max-h-full drop-shadow-xl"
                  />
                </div>
              </div>
            )}

            <div className="flex-1">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <Badge className="mb-2">{supplement.category}</Badge>
                  <h1 className="mb-2 text-4xl font-bold text-gray-900">
                    {supplement.name}
                  </h1>
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
              <p className="text-lg text-gray-600">{supplement.description}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {[
            {
              title: "Dosage",
              value: supplement.dosage,
              icon: <Pill className="mr-2 h-5 w-5 text-primary" />,
            },
            {
              title: "Best Timing",
              value: supplement.timing,
              icon: <Clock className="mr-2 h-5 w-5 text-primary" />,
            },
            {
              title: "Duration",
              value: supplement.duration,
              icon: <Calendar className="mr-2 h-5 w-5 text-primary" />,
            },
          ].map((item) => (
            <motion.div key={item.title} variants={fadeIn}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {item.icon}
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary">
                    {item.value}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-6 lg:grid-cols-2"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {supplement.benefits && supplement.benefits.length > 0 && (
            <motion.div variants={fadeIn}>
              <Card>
                <CardHeader>
                  <CardTitle>Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {supplement.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="mr-2 text-primary">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}
          {supplement.ingredients && supplement.ingredients.length > 0 && (
            <motion.div variants={fadeIn}>
              <Card>
                <CardHeader>
                  <CardTitle>Ingredients</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {supplement.ingredients.map((ingredient, idx) => (
                      <li key={idx} className="text-gray-700">
                        • {ingredient}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}
          {supplement.contraindications &&
            supplement.contraindications.length > 0 && (
              <motion.div variants={fadeIn} className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-orange-600">
                      <AlertTriangle className="mr-2 h-5 w-5" />
                      Precautions & Contraindications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {supplement.contraindications.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="mr-2 text-orange-600">⚠</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          {supplement.scientificStudies &&
            supplement.scientificStudies.length > 0 && (
              <motion.div variants={fadeIn} className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Scientific Research</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {supplement.scientificStudies.map((study, idx) => (
                        <div
                          key={idx}
                          className="border-l-4 border-primary pl-4"
                        >
                          <h4 className="mb-1 font-semibold">{study.title}</h4>
                          {study.summary && (
                            <p className="mb-2 text-sm text-gray-600">
                              {study.summary}
                            </p>
                          )}
                          {study.url && (
                            <a
                              href={study.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-sm text-primary hover:underline"
                            >
                              Read Study{" "}
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
        </motion.div>

        <motion.div
          className="mt-6"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <Card className="bg-primary text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="mb-2 text-xl font-bold">
                    Have questions about {supplement.name}?
                  </h3>
                  <p>
                    Ask our AI assistant for personalized advice and
                    recommendations.
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() =>
                    openChatWithQuestion(
                      `Tell me more about ${supplement.name}`,
                    )
                  }
                >
                  Ask AI
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
};
