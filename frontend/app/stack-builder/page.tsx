"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  GripVertical,
  Loader2,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import { useAuth } from "@/app/AuthContext";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useStackBuilder } from "@/hooks/useStackBuilder";
import type { Supplement, ApiResponse } from "@/types";
import type { CompatibilityRule, StackAnalysisResult, StackSupplement } from "@/types/stack";

const CATEGORY_ORDER = [
  "proteins",
  "creatine",
  "bcaa",
  "pre-workout",
  "recovery",
] as const;

const CATEGORY_LABELS: Record<(typeof CATEGORY_ORDER)[number], string> = {
  proteins: "Proteins",
  creatine: "Creatine",
  bcaa: "BCAA",
  "pre-workout": "Pre-Workout",
  recovery: "Recovery",
};

const GOAL_OPTIONS = [
  "Muscle Gain",
  "Fat Loss",
  "Endurance",
  "Recovery",
  "General Fitness",
];

const TIMING_SLOTS = [
  { key: "morning", label: "Morning", icon: "🌅" },
  { key: "preWorkout", label: "Pre-Workout", icon: "💪" },
  { key: "postWorkout", label: "Post-Workout", icon: "🔄" },
  { key: "withMeals", label: "With Meals", icon: "🍽️" },
  { key: "beforeBed", label: "Before Bed", icon: "🌙" },
] as const;

const scoreToneClasses = {
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  blue: "border-sky-200 bg-sky-50 text-sky-700",
  yellow: "border-amber-200 bg-amber-50 text-amber-700",
  red: "border-rose-200 bg-rose-50 text-rose-700",
};

const reportColumnStyles = {
  synergy: {
    wrapper: "border-emerald-200 bg-emerald-50/70",
    badge: "border-emerald-200 bg-emerald-100 text-emerald-700",
    empty: "text-emerald-700/70",
  },
  caution: {
    wrapper: "border-amber-200 bg-amber-50/80",
    badge: "border-amber-200 bg-amber-100 text-amber-700",
    empty: "text-amber-700/70",
  },
  avoid: {
    wrapper: "border-rose-200 bg-rose-50/80",
    badge: "border-rose-200 bg-rose-100 text-rose-700",
    empty: "text-rose-700/70",
  },
};

interface SaveStackResponse {
  id: string;
  stackName: string;
  userGoal: string;
  supplementIds: string[];
  createdAt: string;
}

const toStackSupplement = (supplement: Supplement): StackSupplement => ({
  _id: supplement._id,
  name: supplement.name,
  slug: supplement.slug,
  category: supplement.category,
  dosage: supplement.dosage,
  timing: supplement.timing,
  benefits: supplement.benefits,
  goals: supplement.goals,
});

const getScoreTone = (score: number) => {
  if (score >= 90) {
    return scoreToneClasses.green;
  }

  if (score >= 70) {
    return scoreToneClasses.blue;
  }

  if (score >= 50) {
    return scoreToneClasses.yellow;
  }

  return scoreToneClasses.red;
};

const getScheduleNames = (slot: unknown): string[] => {
  if (!Array.isArray(slot)) {
    return [];
  }

  return slot
    .map((entry) => {
      if (typeof entry === "string") {
        return entry;
      }

      if (
        typeof entry === "object" &&
        entry !== null &&
        "name" in entry &&
        typeof entry.name === "string"
      ) {
        return entry.name;
      }

      return null;
    })
    .filter((entry): entry is string => Boolean(entry));
};

const GoalPill = ({ goal }: { goal: string }) => {
  return (
    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
      {goal}
    </span>
  );
};

const ReportColumn = ({
  title,
  icon,
  rules,
  type,
}: {
  title: string;
  icon: string;
  rules: CompatibilityRule[];
  type: "synergy" | "caution" | "avoid";
}) => {
  const style = reportColumnStyles[type];

  return (
    <Card className={cn("border", style.wrapper)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="text-xl">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {rules.length === 0 ? (
          <p className={cn("text-sm", style.empty)}>None found 🎉</p>
        ) : (
          rules.map((rule) => (
            <div
              key={`${rule.type}-${rule.title}`}
              className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm"
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <h3 className="font-semibold text-slate-900">{rule.title}</h3>
                {rule.timing ? (
                  <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-medium", style.badge)}>
                    {rule.timing}
                  </span>
                ) : null}
              </div>
              <p className="text-sm leading-6 text-slate-600">{rule.reason}</p>
              {type === "caution" ? (
                <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-amber-700">
                  Advice: monitor dose and tolerance
                </p>
              ) : null}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default function StackBuilderPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    proteins: true,
    creatine: true,
    bcaa: true,
    "pre-workout": true,
    recovery: true,
  });
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [stackName, setStackName] = useState("");

  const {
    selectedSupplements,
    userGoal,
    setUserGoal,
    addSupplement,
    removeSupplement,
    clearStack,
    canAnalyze,
    analyzeStack,
    analysisResult,
    isAnalyzing,
    analysisError,
    resetAnalysis,
  } = useStackBuilder();

  const supplementsQuery = useQuery({
    queryKey: ["stack-builder", "supplements"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Supplement[]>>("/supplements");
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const saveStackMutation = useMutation<SaveStackResponse, Error, string>({
    mutationFn: async (name) => {
      const response = await apiClient.post<ApiResponse<SaveStackResponse>>("/stack/save", {
        stackName: name,
        userGoal,
        supplementIds: selectedSupplements.map((supplement) => supplement._id),
      });

      return response.data.data;
    },
    onSuccess: () => {
      setIsSaveModalOpen(false);
      setStackName("");
    },
  });

  const filteredSupplements = useMemo(() => {
    const supplements = supplementsQuery.data ?? [];
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return supplements;
    }

    return supplements.filter((supplement) =>
      supplement.name.toLowerCase().includes(normalizedSearch),
    );
  }, [searchTerm, supplementsQuery.data]);

  const groupedSupplements = useMemo(() => {
    return CATEGORY_ORDER.map((category) => ({
      category,
      items: filteredSupplements.filter((supplement) => supplement.category === category),
    }));
  }, [filteredSupplements]);

  const selectedIds = useMemo(
    () => new Set(selectedSupplements.map((supplement) => supplement._id)),
    [selectedSupplements],
  );

  const scoreTone = analysisResult ? getScoreTone(analysisResult.stackScore) : scoreToneClasses.blue;
  const schedule = (analysisResult?.timingSchedule ?? {}) as Record<string, unknown>;

  const handleToggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleAnalyze = () => {
    resetAnalysis();
    analyzeStack();
  };

  const handleSaveStack = () => {
    const trimmedName = stackName.trim();
    if (!trimmedName) {
      return;
    }

    saveStackMutation.mutate(trimmedName);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.14),_transparent_32%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_45%,_#f8fafc_100%)] py-10 sm:py-14">
      <Container className="space-y-10">
        <section className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 px-6 py-10 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:px-10 md:py-14">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700">
              <FlaskConical className="h-4 w-4" />
              AI Supplement Planning
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
                <span className="mr-3 inline-block">⚗️</span>
                AI Stack Builder
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                Select 2-6 supplements and get an AI-powered compatibility analysis.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              {[
                "200+ Supplements analyzed",
                "AI-Powered",
                "Free",
              ].map((stat) => (
                <div
                  key={stat}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  {stat}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-white/60 bg-white/85 shadow-xl shadow-slate-200/70 backdrop-blur">
            <CardHeader className="space-y-4">
              <div>
                <CardTitle className="text-2xl text-slate-950">Available Supplements</CardTitle>
                <CardDescription>
                  Search the catalog, browse by category, and add up to six products.
                </CardDescription>
              </div>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search supplements by name"
                  className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {supplementsQuery.isLoading ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
                    />
                  ))}
                </div>
              ) : supplementsQuery.isError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
                  Failed to load supplements. Please refresh the page and try again.
                </div>
              ) : (
                groupedSupplements.map(({ category, items }) => {
                  const isExpanded = expandedCategories[category];

                  return (
                    <div key={category} className="rounded-2xl border border-slate-200 bg-slate-50/80">
                      <button
                        type="button"
                        onClick={() => handleToggleCategory(category)}
                        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                      >
                        <div>
                          <h2 className="font-semibold text-slate-900">{CATEGORY_LABELS[category]}</h2>
                          <p className="text-sm text-slate-500">{items.length} supplement{items.length === 1 ? "" : "s"}</p>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-slate-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-slate-500" />
                        )}
                      </button>

                      {isExpanded ? (
                        <div className="grid gap-4 border-t border-slate-200 p-4 md:grid-cols-2">
                          {items.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-200 bg-white/80 p-6 text-sm text-slate-500 md:col-span-2">
                              No supplements match this search.
                            </div>
                          ) : (
                            items.map((supplement) => {
                              const isSelected = selectedIds.has(supplement._id);
                              const isStackFull = selectedSupplements.length >= 6;

                              return (
                                <div
                                  key={supplement._id}
                                  className="rounded-2xl border border-white bg-white p-4 shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
                                >
                                  <div className="mb-3 flex items-start justify-between gap-3">
                                    <div>
                                      <h3 className="font-semibold text-slate-900">{supplement.name}</h3>
                                      <Badge variant="secondary" className="mt-2 rounded-full bg-slate-100 text-slate-700">
                                        {CATEGORY_LABELS[supplement.category]}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="mb-4 flex flex-wrap gap-2">
                                    {supplement.goals.slice(0, 3).map((goal) => (
                                      <GoalPill key={`${supplement._id}-${goal}`} goal={goal} />
                                    ))}
                                  </div>
                                  {isSelected ? (
                                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                                      <CheckCircle2 className="h-4 w-4" />
                                      ✓ Added
                                    </div>
                                  ) : (
                                    <Button
                                      type="button"
                                      onClick={() => addSupplement(toStackSupplement(supplement))}
                                      disabled={isStackFull}
                                      className="w-full rounded-xl bg-slate-950 text-white hover:bg-slate-800"
                                    >
                                      Add to Stack
                                    </Button>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      ) : null}
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          <Card className="sticky top-24 h-fit border-white/60 bg-white/90 shadow-xl shadow-slate-200/70 backdrop-blur">
            <CardHeader className="space-y-5">
              <div>
                <CardTitle className="text-2xl text-slate-950">
                  Your Stack ({selectedSupplements.length}/6)
                </CardTitle>
                <CardDescription>
                  Build a focused stack for one goal and analyze the interactions.
                </CardDescription>
              </div>
              {selectedSupplements.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                  Add supplements from the left to build your stack.
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedSupplements.map((supplement) => (
                    <div
                      key={supplement._id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <GripVertical className="mt-1 h-4 w-4 text-slate-400" />
                          <div>
                            <h3 className="font-semibold text-slate-900">{supplement.name}</h3>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <Badge variant="secondary" className="rounded-full bg-slate-200 text-slate-700">
                                {CATEGORY_LABELS[supplement.category as keyof typeof CATEGORY_LABELS] ?? supplement.category}
                              </Badge>
                              <span className="text-xs font-medium text-slate-500">
                                {supplement.dosage}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSupplement(supplement._id)}
                          className="rounded-full text-slate-500 hover:bg-slate-200"
                          aria-label={`Remove ${supplement.name}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="stack-goal">Your Main Goal</Label>
                <Select value={userGoal} onValueChange={setUserGoal}>
                  <SelectTrigger id="stack-goal" className="h-11 rounded-xl border-slate-200 bg-slate-50">
                    <SelectValue placeholder="Select your main goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {GOAL_OPTIONS.map((goal) => (
                      <SelectItem key={goal} value={goal}>
                        {goal}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="button"
                onClick={handleAnalyze}
                disabled={!canAnalyze || isAnalyzing}
                className="h-12 w-full rounded-2xl bg-black text-base font-semibold text-white hover:bg-slate-800"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    🤖 Analyzing...
                  </>
                ) : (
                  "Analyze Stack"
                )}
              </Button>

              {!canAnalyze ? (
                <p className="text-center text-sm text-slate-500">(min 2 supplements)</p>
              ) : null}

              {analysisError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                  {analysisError.message || "Failed to analyze stack."}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </section>

        {analysisResult ? (
          <section className="space-y-6 animate-in fade-in-50 duration-500">
            <Card className="overflow-hidden border-white/60 bg-white/90 shadow-xl shadow-slate-200/70">
              <CardContent className="flex flex-col items-center gap-6 p-8 lg:flex-row lg:justify-between">
                <div className="flex flex-col items-center gap-5 text-center lg:flex-row lg:text-left">
                  <div
                    className={cn(
                      "flex h-36 w-36 items-center justify-center rounded-full border-8 text-4xl font-black shadow-inner",
                      scoreTone,
                    )}
                  >
                    {analysisResult.stackScore}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Stack Score
                    </p>
                    <h2 className="text-3xl font-black text-slate-950">
                      {analysisResult.stackRating}
                    </h2>
                    <p className="max-w-xl text-slate-600">
                      Based on {analysisResult.compatibilityReport.synergies.length} synergies and {" "}
                      {analysisResult.compatibilityReport.cautions.length + analysisResult.compatibilityReport.avoids.length} cautions found.
                    </p>
                  </div>
                </div>

                {user ? (
                  <Button
                    type="button"
                    onClick={() => setIsSaveModalOpen(true)}
                    className="rounded-2xl bg-slate-950 px-6 py-6 text-white hover:bg-slate-800"
                  >
                    Save This Stack
                  </Button>
                ) : null}
              </CardContent>
            </Card>

            <div className="grid gap-6 xl:grid-cols-3">
              <ReportColumn
                title="Synergies"
                icon="✅"
                rules={analysisResult.compatibilityReport.synergies}
                type="synergy"
              />
              <ReportColumn
                title="Cautions"
                icon="⚠️"
                rules={analysisResult.compatibilityReport.cautions}
                type="caution"
              />
              <ReportColumn
                title="Avoid"
                icon="❌"
                rules={analysisResult.compatibilityReport.avoids}
                type="avoid"
              />
            </div>

            <Card className="overflow-hidden border-0 bg-gradient-to-br from-indigo-600 via-sky-600 to-violet-700 text-white shadow-[0_24px_80px_rgba(79,70,229,0.35)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Sparkles className="h-5 w-5" />
                  AI Stack Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-8 text-white/95">{analysisResult.aiAnalysis}</p>
                <p className="mt-5 text-sm italic text-slate-200">{analysisResult.disclaimer}</p>
              </CardContent>
            </Card>

            <Card className="border-white/60 bg-white/90 shadow-xl shadow-slate-200/70">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-950">Optimized Daily Timing Schedule</CardTitle>
                <CardDescription>
                  A simple timing plan based on your selected supplements and the current rules engine.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 lg:grid-cols-5">
                  {TIMING_SLOTS.map((slot) => {
                    const slotItems = getScheduleNames(schedule[slot.key]);

                    return (
                      <div
                        key={slot.key}
                        className="relative rounded-3xl border border-slate-200 bg-slate-50 p-5"
                      >
                        <div className="mb-4 flex items-center gap-3">
                          <span className="text-2xl">{slot.icon}</span>
                          <div>
                            <h3 className="font-semibold text-slate-900">{slot.label}</h3>
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                              Time slot
                            </p>
                          </div>
                        </div>

                        {slotItems.length === 0 ? (
                          <p className="text-sm text-slate-400">Nothing scheduled</p>
                        ) : (
                          <div className="space-y-2">
                            {slotItems.map((item) => (
                              <div
                                key={`${slot.key}-${item}`}
                                className="rounded-2xl border border-white bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm"
                              >
                                {item}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {saveStackMutation.isSuccess ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
                Stack saved successfully.
              </div>
            ) : null}
          </section>
        ) : null}

        <section className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-xl shadow-slate-200/60 backdrop-blur sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-950">Pro Tips for Stacking</h2>
            <p className="mt-2 text-slate-600">
              A few simple rules improve adherence, safety, and results more than most people expect.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: "💧",
                title: "Stay hydrated",
                description: "Most supplements work better with adequate water intake.",
              },
              {
                icon: "🍽️",
                title: "Take fat-soluble vitamins with meals",
                description: "Vitamins D, E, and K absorb better when meals include some fat.",
              },
              {
                icon: "⏰",
                title: "Consistency beats perfect timing",
                description: "Same time daily is usually better than chasing an ideal schedule you cannot keep.",
              },
            ].map((tip) => (
              <Card key={tip.title} className="border-slate-200 bg-slate-50/80 shadow-none">
                <CardContent className="p-5">
                  <div className="mb-4 text-3xl">{tip.icon}</div>
                  <h3 className="mb-2 font-semibold text-slate-900">{tip.title}</h3>
                  <p className="text-sm leading-6 text-slate-600">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </Container>

      {selectedSupplements.length > 0 ? (
        <div className="fixed bottom-5 left-5 z-30">
          <Button
            type="button"
            variant="destructive"
            onClick={clearStack}
            className="rounded-full px-5 py-6 shadow-lg"
          >
            Clear Stack
          </Button>
        </div>
      ) : null}

      {isSaveModalOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
          <Card className="w-full max-w-md border-white/60 bg-white shadow-2xl">
            <CardHeader>
              <CardTitle>Save This Stack</CardTitle>
              <CardDescription>
                Give this supplement combination a name so you can find it later.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stack-name">Stack Name</Label>
                <Input
                  id="stack-name"
                  value={stackName}
                  onChange={(event) => setStackName(event.target.value)}
                  placeholder="Example: Lean Bulk AM Stack"
                  className="h-11 rounded-xl"
                />
              </div>

              {saveStackMutation.isError ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {saveStackMutation.error.message || "Failed to save stack."}
                </div>
              ) : null}

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsSaveModalOpen(false);
                    setStackName("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSaveStack}
                  disabled={!stackName.trim() || saveStackMutation.isPending}
                  className="bg-slate-950 text-white hover:bg-slate-800"
                >
                  {saveStackMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Stack"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}