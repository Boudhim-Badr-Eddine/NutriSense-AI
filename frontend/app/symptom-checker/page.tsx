"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  FlaskConical,
  Loader2,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MAX_SYMPTOMS, SYMPTOM_CATEGORIES } from "@/data/symptoms";
import { useSymptomChecker } from "@/hooks/useSymptomChecker";
import { useSymptomSelection } from "@/hooks/useSymptomSelection";
import type { SymptomResult } from "@/types/symptom";

const getConfidenceLabel = (
  confidence: SymptomResult["confidence"],
): string => {
  if (confidence === "high") {
    return "High Match";
  }

  if (confidence === "medium") {
    return "Moderate Match";
  }

  return "Weak Match";
};

const getConfidenceBadgeClass = (
  confidence: SymptomResult["confidence"],
): string => {
  if (confidence === "high") {
    return "bg-emerald-100 text-emerald-700 border border-emerald-200";
  }

  if (confidence === "medium") {
    return "bg-amber-100 text-amber-700 border border-amber-200";
  }

  return "bg-gray-100 text-gray-700 border border-gray-200";
};

const getConfidenceBorderClass = (
  confidence: SymptomResult["confidence"],
): string => {
  if (confidence === "high") {
    return "border-l-4 border-l-emerald-500";
  }

  if (confidence === "medium") {
    return "border-l-4 border-l-amber-500";
  }

  return "border-l-4 border-l-gray-400";
};

const getCategoryBadgeClass = (category: string): string => {
  const normalized = category.toLowerCase();

  if (normalized === "vitamin") {
    return "bg-blue-100 text-blue-700 border border-blue-200";
  }

  if (normalized === "mineral") {
    return "bg-violet-100 text-violet-700 border border-violet-200";
  }

  if (normalized === "omega") {
    return "bg-cyan-100 text-cyan-700 border border-cyan-200";
  }

  if (normalized === "adaptogen") {
    return "bg-teal-100 text-teal-700 border border-teal-200";
  }

  if (normalized === "antioxidant") {
    return "bg-pink-100 text-pink-700 border border-pink-200";
  }

  return "bg-slate-100 text-slate-700 border border-slate-200";
};

export default function SymptomCheckerPage() {
  const { selectedSymptoms, toggleSymptom, clearSymptoms, isAtLimit } =
    useSymptomSelection();
  const symptomChecker = useSymptomChecker();
  const resultsSectionRef = useRef<HTMLElement | null>(null);
  const [lastAnalyzedAt, setLastAnalyzedAt] = useState<string | null>(null);

  const selectedCount = selectedSymptoms.length;
  const progressPercent = (selectedCount / MAX_SYMPTOMS) * 100;

  const handleAnalyze = () => {
    if (selectedCount === 0 || symptomChecker.isPending) {
      return;
    }

    symptomChecker.mutate(selectedSymptoms);
  };

  const hasSuccessfulResponse =
    symptomChecker.isSuccess && symptomChecker.data?.success;
  const results = hasSuccessfulResponse ? symptomChecker.data.data.results : [];
  const hasError = symptomChecker.isError;

  useEffect(() => {
    if (!hasSuccessfulResponse) {
      return;
    }

    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    requestAnimationFrame(() => {
      setLastAnalyzedAt(time);
      resultsSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [hasSuccessfulResponse, symptomChecker.data]);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <Container className="max-w-5xl space-y-8">
        <section>
          <Card className="border-slate-200">
            <CardHeader className="space-y-4">
              <CardTitle className="flex items-center gap-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                <FlaskConical className="h-8 w-8 text-indigo-600" />
                <span>Symptom Checker</span>
                <span>🔬</span>
              </CardTitle>
              <p className="text-base text-slate-600 sm:text-lg">
                Select your symptoms and discover potential nutritional
                deficiencies
              </p>
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
                Educational tool only — not medical advice. Always consult a
                doctor.
              </div>
            </CardHeader>
          </Card>
        </section>

        <section>
          <Card className="border-slate-200">
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-xl text-slate-900">
                  Symptom Selector
                </CardTitle>
                <Badge variant="secondary" className="text-sm">
                  {selectedCount} / {MAX_SYMPTOMS} symptoms selected
                </Badge>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <AnimatePresence>
                {isAtLimit && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700"
                  >
                    Maximum 10 symptoms reached
                  </motion.div>
                )}
              </AnimatePresence>
            </CardHeader>

            <CardContent className="space-y-4">
              {SYMPTOM_CATEGORIES.map((category) => {
                const categorySelectedCount = category.symptoms.filter((item) =>
                  selectedSymptoms.includes(item),
                ).length;

                return (
                  <details
                    key={category.category}
                    className="group rounded-lg border border-slate-200 bg-white"
                    open
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span className="font-medium text-slate-900">
                          {category.category}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {categorySelectedCount} selected
                      </Badge>
                    </summary>

                    <div className="flex flex-wrap gap-2 border-t border-slate-100 px-4 py-4">
                      {category.symptoms.map((symptom) => {
                        const isSelected = selectedSymptoms.includes(symptom);

                        return (
                          <button
                            key={symptom}
                            type="button"
                            onClick={() => toggleSymptom(symptom)}
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm transition-colors ${
                              isSelected
                                ? "bg-slate-900 text-white"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                          >
                            {isSelected && <Check className="h-3.5 w-3.5" />}
                            {symptom}
                          </button>
                        );
                      })}
                    </div>
                  </details>
                );
              })}

              <div className="space-y-4 pt-2">
                {selectedCount > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedSymptoms.map((symptom) => (
                      <Badge
                        key={symptom}
                        variant="secondary"
                        className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-indigo-700"
                      >
                        {symptom}
                        <button
                          type="button"
                          onClick={() => toggleSymptom(symptom)}
                          className="rounded-full p-0.5 hover:bg-indigo-200"
                          aria-label={`Remove ${symptom}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="sticky bottom-2 z-10 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white/90 p-3 backdrop-blur sm:static sm:z-auto sm:border-0 sm:bg-transparent sm:p-0 sm:flex-row sm:items-center">
                  {selectedCount > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={clearSymptoms}
                      className="transition-colors hover:bg-slate-100"
                    >
                      Clear All
                    </Button>
                  )}

                  <Button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={selectedCount === 0 || symptomChecker.isPending}
                    className="w-full bg-black text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow md:ml-auto md:w-auto"
                  >
                    {symptomChecker.isPending ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analyzing...
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Analyze My Symptoms
                      </span>
                    )}
                  </Button>
                </div>

                <AnimatePresence>
                  {hasError && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                    >
                      <p className="inline-flex items-center gap-2 font-medium">
                        <AlertCircle className="h-4 w-4" />
                        Unable to analyze symptoms right now.
                      </p>
                      <p className="mt-1 text-rose-600">
                        Please check your backend/API connection and try again.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </section>

        <AnimatePresence>
          {hasSuccessfulResponse && (
            <motion.section
              ref={resultsSectionRef}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              {lastAnalyzedAt && (
                <p className="text-right text-xs text-slate-500">
                  Last analyzed at {lastAnalyzedAt}
                </p>
              )}

              <Card className="border border-indigo-200 bg-indigo-50">
                <CardHeader>
                  <CardTitle className="text-xl text-indigo-900">
                    🤖 AI Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-indigo-900">
                    {symptomChecker.data.data.aiAnalysis}
                  </p>
                  <p className="text-sm italic text-slate-500">
                    {symptomChecker.data.data.disclaimer}
                  </p>
                </CardContent>
              </Card>

              {results.length > 0 ? (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-slate-900">
                    Potential Deficiencies Found ({results.length})
                  </h2>

                  <div className="space-y-4">
                    {results.map((result) => {
                      const scorePercent = Math.min(result.matchScore, 100);

                      return (
                        <Card
                          key={result.complement._id}
                          className={getConfidenceBorderClass(
                            result.confidence,
                          )}
                        >
                          <CardHeader className="space-y-4">
                            <div className="flex items-start justify-between gap-3">
                              <Badge
                                className={getCategoryBadgeClass(
                                  result.complement.category,
                                )}
                              >
                                {result.complement.category}
                              </Badge>
                              <Badge
                                className={getConfidenceBadgeClass(
                                  result.confidence,
                                )}
                              >
                                {getConfidenceLabel(result.confidence)}
                              </Badge>
                            </div>

                            <CardTitle className="text-xl text-slate-900">
                              {result.complement.name}
                            </CardTitle>
                          </CardHeader>

                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-slate-700">
                                Matched symptoms:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {result.matchedSymptoms.map((symptom) => (
                                  <Badge
                                    key={symptom}
                                    variant="secondary"
                                    className="bg-indigo-100 text-indigo-700"
                                  >
                                    {symptom}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm text-slate-700">
                                <span>Match Score</span>
                                <span>{result.matchScore}%</span>
                              </div>
                              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                                <div
                                  className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                                  style={{ width: `${scorePercent}%` }}
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 sm:grid-cols-4">
                                <p>
                                  Weighted{" "}
                                  {result.scoreBreakdown.weightedCoverage}%
                                </p>
                                <p>
                                  Selected{" "}
                                  {result.scoreBreakdown.selectedCoverage}%
                                </p>
                                <p>
                                  Deficiency{" "}
                                  {result.scoreBreakdown.deficiencyCoverage}%
                                </p>
                                <p>
                                  Link bonus +
                                  {result.scoreBreakdown.linkedComplementBonus}%
                                </p>
                              </div>
                            </div>

                            {result.recommendedFoods.length > 0 && (
                              <div className="space-y-2">
                                <p className="text-sm font-medium text-slate-700">
                                  Suggested foods to prioritize:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {result.recommendedFoods.map((food) => (
                                    <div
                                      key={`${result.complement._id}-${food.name}`}
                                      className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700"
                                    >
                                      {food.slug ? (
                                        <Link
                                          href={`/nutrition/foods/${food.slug}`}
                                          className="font-medium text-slate-800 underline-offset-2 hover:underline"
                                        >
                                          {food.name}
                                        </Link>
                                      ) : (
                                        <span className="font-medium text-slate-800">
                                          {food.name}
                                        </span>
                                      )}{" "}
                                      - {food.quantityPer100g}
                                      {food.unit}/100g
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="grid grid-cols-1 gap-3 rounded-lg bg-slate-50 p-3 text-sm sm:grid-cols-3">
                              <div>
                                <p className="text-xs text-slate-500">Men</p>
                                <p className="font-medium text-slate-800">
                                  {result.complement.dailyIntake.men}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500">Women</p>
                                <p className="font-medium text-slate-800">
                                  {result.complement.dailyIntake.women}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500">
                                  Athletes
                                </p>
                                <p className="font-medium text-slate-800">
                                  {result.complement.dailyIntake.athletes}
                                </p>
                              </div>
                            </div>

                            <Link
                              href={`/complements/${result.complement.slug}`}
                              className="inline-block"
                            >
                              <Button
                                variant="outline"
                                className="transition-colors hover:bg-slate-100"
                              >
                                View Full Details →
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                    <Search className="h-10 w-10 text-slate-400" />
                    <p className="text-lg font-medium text-slate-700">
                      No deficiencies matched your symptoms
                    </p>
                    <p className="text-sm text-slate-500">
                      Try selecting a different combination of symptoms.
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
}
