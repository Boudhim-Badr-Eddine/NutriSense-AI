"use client";

import { useAuth } from "@/app/AuthContext";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupplement, useToggleFavorite } from "@/hooks/useSupplements";
import { openChatWithQuestion } from "@/lib/chatUtils";
import {
  AlertTriangle,
  Calendar,
  Clock,
  ExternalLink,
  Heart,
  Pill,
} from "lucide-react";
import { useParams } from "next/navigation";

export default function SupplementDetailPage() {
  const params = useParams();
  const id = params.id as string;
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
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-3/4 bg-gray-200 rounded" />
          <div className="h-4 w-1/4 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </Container>
    );
  }

  if (error || !supplement) {
    return (
      <Container className="py-8">
        <div className="text-center">
          <p className="text-red-500">Supplement not found</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <Container>
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <Badge className="mb-2">{supplement.category}</Badge>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {supplement.name}
              </h1>
            </div>
            <Button
              variant={isFavorited ? "default" : "outline"}
              size="lg"
              onClick={handleFavoriteClick}
            >
              <Heart
                className={`h-5 w-5 mr-2 ${isFavorited ? "fill-white" : ""}`}
              />
              {isFavorited ? "Favorited" : "Add to Favorites"}
            </Button>
          </div>
          <p className="text-lg text-gray-600">{supplement.description}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Pill className="h-5 w-5 mr-2 text-primary" />
                Dosage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">
                {supplement.dosage}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                Best Timing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">
                {supplement.timing}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">
                {supplement.duration}
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {supplement.benefits && supplement.benefits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {supplement.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          {supplement.ingredients && supplement.ingredients.length > 0 && (
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
          )}
          {supplement.contraindications &&
            supplement.contraindications.length > 0 && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-600">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Precautions & Contraindications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {supplement.contraindications.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-orange-600 mr-2">⚠</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          {supplement.scientificStudies &&
            supplement.scientificStudies.length > 0 && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Scientific Research</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {supplement.scientificStudies.map((study, idx) => (
                      <div key={idx} className="border-l-4 border-primary pl-4">
                        <h4 className="font-semibold mb-1">{study.title}</h4>
                        {study.summary && (
                          <p className="text-sm text-gray-600 mb-2">
                            {study.summary}
                          </p>
                        )}
                        {study.url && (
                          <a
                            href={study.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary text-sm flex items-center hover:underline"
                          >
                            Read Study <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
        </div>
        <Card className="mt-6 bg-primary text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">
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
                  openChatWithQuestion(`Tell me more about ${supplement.name}`)
                }
              >
                Ask AI
              </Button>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
