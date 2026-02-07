"use client";

import { AlertTriangle, ExternalLink, Heart, Leaf, Shield } from "lucide-react";
import { useParams } from "next/navigation";

import { useAuth } from "@/app/AuthContext";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useComplement,
  useToggleComplementFavorite,
} from "@/hooks/useComplements";
import { openChatWithQuestion } from "@/lib/chatUtils";

/**
 * WHY: Provide detailed complement information for informed supplementation.
 */
export default function ComplementDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  const { data: complement, isLoading, error } = useComplement(id);
  const toggleFavorite = useToggleComplementFavorite();

  const isFavorited = user?.favorites?.complements?.includes(id);

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

  if (error || !complement) {
    return (
      <Container className="py-8">
        <div className="text-center">
          <p className="text-red-500">Complement not found</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        <div className="mb-6 rounded-lg bg-white p-8 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <Badge className="mb-2">{complement.category}</Badge>
              <h1 className="mb-2 text-4xl font-bold text-gray-900">
                {complement.name}
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
          <p className="text-lg text-gray-600">{complement.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-primary" />
                Biological Role
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{complement.biologicalRole}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
                Deficiency Symptoms
              </CardTitle>
            </CardHeader>
            <CardContent>
              {complement.deficiencySymptoms?.length ? (
                <ul className="space-y-2">
                  {complement.deficiencySymptoms.map((symptom, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 text-orange-500">•</span>
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No deficiency symptoms listed.</p>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Leaf className="mr-2 h-5 w-5 text-emerald-500" />
                Natural Food Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              {complement.foodSources?.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Food</TableHead>
                      <TableHead>Quantity per 100g</TableHead>
                      <TableHead>Unit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complement.foodSources.map((source, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {source.food}
                        </TableCell>
                        <TableCell>{source.quantityPer100g}</TableCell>
                        <TableCell>{source.unit}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500">No food sources listed.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daily Intake Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Men</span>
                  <span className="font-semibold">
                    {complement.dailyIntake?.men}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Women</span>
                  <span className="font-semibold">
                    {complement.dailyIntake?.women}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Pregnant</span>
                  <span className="font-semibold">
                    {complement.dailyIntake?.pregnant}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Athletes</span>
                  <span className="font-semibold">
                    {complement.dailyIntake?.athletes}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Supplement Forms</CardTitle>
            </CardHeader>
            <CardContent>
              {complement.supplementForms?.length ? (
                <div className="space-y-3">
                  {complement.supplementForms.map((form, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-gray-200 p-3"
                    >
                      <p className="font-semibold">{form.form}</p>
                      <p className="text-sm text-gray-600">
                        Bioavailability: {form.bioavailability}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No supplement forms listed.</p>
              )}
            </CardContent>
          </Card>

          {complement.interactions?.length > 0 && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Interactions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {complement.interactions.map((interaction, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      <span>{interaction}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {complement.contraindications?.length > 0 && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-600">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Contraindications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {complement.contraindications.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 text-orange-600">⚠</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="mt-6 bg-primary text-white">
          <CardContent className="p-6">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h3 className="mb-2 text-xl font-bold">
                  Have questions about {complement.name}?
                </h3>
                <p>Ask our AI assistant for personalized guidance and tips.</p>
              </div>
              <Button
                variant="secondary"
                size="lg"
                onClick={() =>
                  openChatWithQuestion(
                    `Tell me more about ${complement.name}`,
                  )
                }
              >
                Ask AI <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
