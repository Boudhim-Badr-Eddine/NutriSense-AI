"use client";

import { Camera, Loader2, UploadCloud } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  ChangeEvent,
  DragEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useMealAnalyzer } from "@/hooks/useMealAnalyzer";
import { MealAnalysisResult } from "@/types/mealAnalyzer";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);
const ANALYZE_STEPS = [
  "🔍 Identifying foods...",
  "📊 Calculating nutrition...",
  "💊 Finding supplement matches...",
];
const EXAMPLE_IMAGE_URL =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80";

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const getPortionLabel = (grams: number): string => {
  if (grams <= 120) {
    return "Small";
  }

  if (grams <= 240) {
    return "Medium";
  }

  if (grams <= 360) {
    return "Large";
  }

  return "Extra-Large";
};

const getConfidenceClasses = (confidence: "high" | "medium" | "low") => {
  if (confidence === "high") {
    return "bg-emerald-500";
  }

  if (confidence === "medium") {
    return "bg-amber-500";
  }

  return "bg-rose-500";
};

const getMealRatingBadgeClasses = (mealRating: string): string => {
  const value = mealRating.toLowerCase();

  if (value.includes("protein")) {
    return "bg-blue-100 text-blue-700 border-blue-200";
  }

  if (value.includes("balanced")) {
    return "bg-emerald-100 text-emerald-700 border-emerald-200";
  }

  if (value.includes("fat")) {
    return "bg-lime-100 text-lime-700 border-lime-200";
  }

  if (value.includes("carb")) {
    return "bg-amber-100 text-amber-700 border-amber-200";
  }

  return "bg-purple-100 text-purple-700 border-purple-200";
};

const buildSummary = (result: MealAnalysisResult): string => {
  const supplements =
    result.recommendedSupplements.length > 0
      ? result.recommendedSupplements.map((supplement) => supplement.name).join(", ")
      : "No direct supplement matches";

  return [
    `Meal Rating: ${result.mealRating}`,
    `Portion: ${result.portionAssessment}`,
    `Calories: ${result.totals.calories} kcal`,
    `Protein: ${result.totals.protein}g (${result.macroPercentages.protein}%)`,
    `Carbs: ${result.totals.carbs}g (${result.macroPercentages.carbs}%)`,
    `Fats: ${result.totals.fats}g (${result.macroPercentages.fats}%)`,
    `Foods: ${result.foods.map((food) => food.name).join(", ")}`,
    `Supplements: ${supplements}`,
  ].join("\n");
};

export default function MealAnalyzerPage() {
  const {
    previewUrl,
    setImagePreview,
    clearImage,
    analyzeMealPhoto,
    analysisResult,
    isAnalyzing,
    analysisError,
    resetAnalysis,
  } = useMealAnalyzer();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const uploadSectionRef = useRef<HTMLDivElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [loadingStep, setLoadingStep] = useState(ANALYZE_STEPS[0]);
  const [clipboardFeedback, setClipboardFeedback] = useState<string | null>(null);

  const hasResult = Boolean(analysisResult);

  useEffect(() => {
    if (!isAnalyzing) {
      return;
    }

    const timeoutTwo = window.setTimeout(() => {
      setLoadingStep(ANALYZE_STEPS[1]);
    }, 2000);
    const timeoutFour = window.setTimeout(() => {
      setLoadingStep(ANALYZE_STEPS[2]);
    }, 4000);

    return () => {
      window.clearTimeout(timeoutTwo);
      window.clearTimeout(timeoutFour);
    };
  }, [isAnalyzing]);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.has(file.type.toLowerCase())) {
      return "Unsupported format. Please upload JPG, PNG, or WEBP.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "Image is too large. Maximum file size is 5MB.";
    }

    return null;
  };

  const applyFile = (file: File) => {
    const validationError = validateFile(file);

    if (validationError) {
      setUploadError(validationError);
      return;
    }

    setUploadError(null);
    setSelectedFile(file);
    setImagePreview(file);
    resetAnalysis();
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      applyFile(file);
    }
  };

  const openFileBrowser = () => {
    inputRef.current?.click();
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      applyFile(file);
    }
  };

  const handleAnalyze = () => {
    if (!selectedFile || isAnalyzing) {
      return;
    }

    setLoadingStep(ANALYZE_STEPS[0]);
    analyzeMealPhoto(selectedFile);
  };

  const handleAnalyzeAnother = () => {
    clearImage();
    setSelectedFile(null);
    setUploadError(null);
    setClipboardFeedback(null);
    resetAnalysis();
    uploadSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCopySummary = async () => {
    if (!analysisResult) {
      return;
    }

    try {
      await navigator.clipboard.writeText(buildSummary(analysisResult));
      setClipboardFeedback("Summary copied to clipboard.");
      window.setTimeout(() => setClipboardFeedback(null), 2500);
    } catch {
      setClipboardFeedback("Unable to copy summary. Please try again.");
      window.setTimeout(() => setClipboardFeedback(null), 2500);
    }
  };

  const handleLoadExample = async () => {
    try {
      setUploadError(null);
      const response = await fetch(EXAMPLE_IMAGE_URL);
      if (!response.ok) {
        setUploadError("Could not load example image right now.");
        return;
      }

      const blob = await response.blob();
      const exampleFile = new File([blob], "example-meal.jpg", {
        type: blob.type || "image/jpeg",
      });
      applyFile(exampleFile);
    } catch {
      setUploadError("Could not load example image right now.");
    }
  };

  const macroBarValues = useMemo(() => {
    if (!analysisResult) {
      return { protein: 0, carbs: 0, fats: 0 };
    }

    return analysisResult.macroPercentages;
  }, [analysisResult]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,rgba(59,130,246,0.13),transparent_35%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_50%,#f8fafc_100%)] py-10 sm:py-14">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-white/70 bg-white/85 px-6 py-10 shadow-[0_25px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:px-10">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
              <span className="text-lg">📸</span>
              Meal Vision AI
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              AI Meal Analyzer
            </h1>
            <p className="text-lg leading-8 text-slate-600 sm:text-xl">
              Take a photo of your meal and get instant nutrition breakdown.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {["Instant Analysis", "Powered by Gemini Vision", "Free"].map((feature) => (
                <span
                  key={feature}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-700"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section ref={uploadSectionRef} className="mt-8">
          <Card className="border-white/70 bg-white/90 shadow-xl shadow-slate-200/60">
            <CardHeader>
              <CardTitle>Upload Your Meal Photo</CardTitle>
              <CardDescription>
                Drag and drop an image, or click the area to browse from your device.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openFileBrowser();
                  }
                }}
                onClick={openFileBrowser}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "relative overflow-hidden rounded-2xl border-2 border-dashed p-6 transition-all",
                  isDragOver
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-300 bg-slate-50 hover:border-slate-400",
                  previewUrl ? "min-h-70 sm:min-h-90" : "min-h-70",
                )}
              >
                {!previewUrl ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <Camera className="mb-4 h-14 w-14 text-slate-400" />
                    <p className="text-xl font-semibold text-slate-800">Drop your meal photo here</p>
                    <p className="mt-2 text-sm text-slate-500">or click to browse</p>
                    <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                      Supported formats: JPG, PNG, WEBP | Max 5MB
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="relative h-full min-h-55 w-full overflow-hidden rounded-xl">
                      <Image
                        src={previewUrl}
                        alt="Meal preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      className="absolute right-4 top-4 bg-slate-950 text-white hover:bg-slate-800"
                      onClick={(event) => {
                        event.stopPropagation();
                        openFileBrowser();
                      }}
                    >
                      Change Photo
                    </Button>
                  </>
                )}
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={handleInputChange}
                />
              </div>

              {selectedFile ? (
                <div className="text-sm text-slate-600">
                  <span className="font-medium text-slate-900">{selectedFile.name}</span>
                  <span className="ml-2">({formatBytes(selectedFile.size)})</span>
                </div>
              ) : null}

              {uploadError ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {uploadError}
                </div>
              ) : null}

              {analysisError ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {analysisError.message || "Analysis failed. Please try again."}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={!selectedFile || isAnalyzing}
                  className="h-12 w-full bg-black text-base font-semibold text-white hover:bg-slate-800 sm:flex-1"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {loadingStep}
                    </>
                  ) : (
                    "📸 Analyze My Meal"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={handleLoadExample} className="h-12 sm:h-10">
                  <UploadCloud className="h-4 w-4" />
                  Try with example
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {hasResult && analysisResult ? (
          <section className="mt-8 animate-in fade-in-50 duration-500 space-y-6">
            <Card className="border-white/70 bg-white/90 shadow-xl shadow-slate-200/60">
              <CardHeader>
                <CardTitle>Meal Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-[200px_1fr]">
                  {previewUrl ? (
                    <div className="relative h-40 w-full overflow-hidden rounded-xl">
                      <Image
                        src={previewUrl}
                        alt="Analyzed meal"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="flex h-40 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                      No image preview
                    </div>
                  )}

                  <div className="space-y-4">
                    <Badge className={cn("w-fit border", getMealRatingBadgeClasses(analysisResult.mealRating))}>
                      {analysisResult.mealRating}
                    </Badge>
                    <p className="text-sm leading-6 text-slate-600">{analysisResult.portionAssessment}</p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <div className="rounded-xl border border-orange-100 bg-orange-50 p-3 text-center">
                        <p className="text-xl">🔥</p>
                        <p className="mt-1 text-2xl font-bold text-orange-700">{analysisResult.totals.calories}</p>
                        <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">Calories</p>
                      </div>
                      <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-center">
                        <p className="text-xl">💪</p>
                        <p className="mt-1 text-2xl font-bold text-blue-700">{analysisResult.totals.protein}g</p>
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Protein</p>
                      </div>
                      <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-center">
                        <p className="text-xl">🍞</p>
                        <p className="mt-1 text-2xl font-bold text-amber-700">{analysisResult.totals.carbs}g</p>
                        <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">Carbs</p>
                      </div>
                      <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-center">
                        <p className="text-xl">🥑</p>
                        <p className="mt-1 text-2xl font-bold text-emerald-700">{analysisResult.totals.fats}g</p>
                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Fats</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/70 bg-white/90 shadow-xl shadow-slate-200/60">
              <CardHeader>
                <CardTitle>Macro Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-4 overflow-hidden rounded-full bg-slate-200">
                  <div className="flex h-full w-full">
                    <div className="bg-blue-500" style={{ width: `${macroBarValues.protein}%` }} />
                    <div className="bg-amber-400" style={{ width: `${macroBarValues.carbs}%` }} />
                    <div className="bg-emerald-500" style={{ width: `${macroBarValues.fats}%` }} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                    Protein {macroBarValues.protein}%
                  </span>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
                    Carbs {macroBarValues.carbs}%
                  </span>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                    Fats {macroBarValues.fats}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/70 bg-white/90 shadow-xl shadow-slate-200/60">
              <CardHeader>
                <CardTitle>Foods Detected ({analysisResult.foods.length} items)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-190 w-full text-sm">
                    <thead>
                      <tr className="border-b bg-slate-50 text-left text-slate-600">
                        <th className="px-3 py-2 font-semibold">Food</th>
                        <th className="px-3 py-2 font-semibold">Portion</th>
                        <th className="px-3 py-2 font-semibold">Cal</th>
                        <th className="px-3 py-2 font-semibold">Protein</th>
                        <th className="px-3 py-2 font-semibold">Carbs</th>
                        <th className="px-3 py-2 font-semibold">Fats</th>
                        <th className="px-3 py-2 font-semibold">Confidence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysisResult.foods.map((food) => (
                        <tr key={`${food.name}-${food.estimatedGrams}`} className="border-b last:border-b-0">
                          <td className="px-3 py-2 font-medium text-slate-800">
                            {food.hasDetailPage && food.dbMatch ? (
                              <Link href={`/nutrition/foods/${food.dbMatch.slug}`} className="text-blue-700 hover:underline">
                                {food.name}
                              </Link>
                            ) : (
                              food.name
                            )}
                          </td>
                          <td className="px-3 py-2 text-slate-600">
                            {getPortionLabel(food.estimatedGrams)} ({food.estimatedGrams}g)
                          </td>
                          <td className="px-3 py-2">{food.calories}</td>
                          <td className="px-3 py-2">{food.protein}g</td>
                          <td className="px-3 py-2">{food.carbs}g</td>
                          <td className="px-3 py-2">{food.fats}g</td>
                          <td className="px-3 py-2">
                            <span className="inline-flex items-center gap-2 capitalize">
                              <span className={cn("h-2.5 w-2.5 rounded-full", getConfidenceClasses(food.confidence))} />
                              {food.confidence}
                            </span>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-slate-100 font-bold text-slate-900">
                        <td className="px-3 py-2">TOTALS</td>
                        <td className="px-3 py-2">-</td>
                        <td className="px-3 py-2">{analysisResult.totals.calories}</td>
                        <td className="px-3 py-2">{analysisResult.totals.protein}g</td>
                        <td className="px-3 py-2">{analysisResult.totals.carbs}g</td>
                        <td className="px-3 py-2">{analysisResult.totals.fats}g</td>
                        <td className="px-3 py-2">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="border-indigo-200 bg-indigo-50/60 shadow-lg">
              <CardHeader>
                <CardTitle>💊 Recommended Supplements for This Meal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border border-indigo-200 bg-white p-4 text-sm leading-7 text-slate-700">
                  {analysisResult.aiRecommendation}
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {analysisResult.recommendedSupplements.map((supplement) => (
                    <div key={supplement._id} className="rounded-xl border border-indigo-200 bg-white p-4">
                      <h3 className="font-semibold text-slate-900">{supplement.name}</h3>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded-full bg-indigo-100 px-2 py-1 font-medium text-indigo-700">
                          {supplement.category}
                        </span>
                        <span className="text-slate-500">{supplement.dosage}</span>
                      </div>
                      <Link href={`/supplements/${supplement.slug}`} className="mt-3 inline-block text-sm font-medium text-indigo-700 hover:underline">
                        View Details →
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="button" variant="outline" onClick={handleCopySummary} className="sm:w-auto">
                📋 Copy Summary
              </Button>
              <Button type="button" onClick={handleAnalyzeAnother} className="bg-slate-950 text-white hover:bg-slate-800 sm:w-auto">
                🔄 Analyze Another Meal
              </Button>
            </div>

            {clipboardFeedback ? (
              <p className="text-sm text-slate-600">{clipboardFeedback}</p>
            ) : null}

            <p className="text-xs italic text-slate-500">{analysisResult.disclaimer}</p>
          </section>
        ) : null}
      </div>
    </div>
  );
}
