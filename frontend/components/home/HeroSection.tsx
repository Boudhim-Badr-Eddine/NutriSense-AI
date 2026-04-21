"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { fadeIn } from "@/lib/animations";

interface Supplement {
  name: string;
  category: string;
  benefit: string;
  purityScore: number;
  badge: string;
  accentFrom: string;
  accentTo: string;
  iconBg: string;
  svgPath: React.ReactNode;
}

const supplements: Supplement[] = [
  {
    name: "Whey Protein",
    category: "Muscle & Recovery",
    benefit: "25g protein per serving",
    purityScore: 98,
    badge: "Best Seller",
    accentFrom: "#f97316",
    accentTo: "#ea580c",
    iconBg: "from-orange-400 to-orange-600",
    svgPath: (
      <svg viewBox="0 0 80 80" fill="none" className="h-full w-full">
        <ellipse cx="40" cy="60" rx="26" ry="8" fill="rgba(255,255,255,0.15)" />
        <rect x="22" y="18" width="36" height="44" rx="8" fill="rgba(255,255,255,0.25)" />
        <rect x="28" y="12" width="24" height="10" rx="5" fill="rgba(255,255,255,0.35)" />
        <path d="M30 34 Q40 28 50 34 Q40 40 30 34Z" fill="rgba(255,255,255,0.5)" />
        <circle cx="40" cy="46" r="6" fill="rgba(255,255,255,0.4)" />
      </svg>
    ),
  },
  {
    name: "Creatine Monohydrate",
    category: "Strength & Power",
    benefit: "5g per serving · Pure form",
    purityScore: 99,
    badge: "Top Rated",
    accentFrom: "#3b82f6",
    accentTo: "#1d4ed8",
    iconBg: "from-blue-400 to-blue-600",
    svgPath: (
      <svg viewBox="0 0 80 80" fill="none" className="h-full w-full">
        <polygon points="40,10 70,60 10,60" fill="rgba(255,255,255,0.2)" />
        <polygon points="40,20 62,56 18,56" fill="rgba(255,255,255,0.25)" />
        <circle cx="40" cy="44" r="12" fill="rgba(255,255,255,0.35)" />
        <circle cx="40" cy="44" r="6" fill="rgba(255,255,255,0.5)" />
        <line x1="40" y1="10" x2="40" y2="20" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
      </svg>
    ),
  },
  {
    name: "Omega-3 Fish Oil",
    category: "Heart & Brain Health",
    benefit: "1200mg EPA+DHA · Wild-caught",
    purityScore: 97,
    badge: "Science-Backed",
    accentFrom: "#10b981",
    accentTo: "#059669",
    iconBg: "from-emerald-400 to-emerald-600",
    svgPath: (
      <svg viewBox="0 0 80 80" fill="none" className="h-full w-full">
        <ellipse cx="40" cy="40" rx="28" ry="18" fill="rgba(255,255,255,0.2)" />
        <ellipse cx="40" cy="40" rx="20" ry="12" fill="rgba(255,255,255,0.3)" />
        <path d="M12 40 Q26 20 40 40 Q54 60 68 40" stroke="rgba(255,255,255,0.6)" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="40" cy="40" r="7" fill="rgba(255,255,255,0.5)" />
        <path d="M60 34 Q66 40 60 46" stroke="rgba(255,255,255,0.5)" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Vitamin D3 + K2",
    category: "Immune & Bone Support",
    benefit: "5000 IU D3 · 100mcg MK-7",
    purityScore: 99,
    badge: "Essential",
    accentFrom: "#f59e0b",
    accentTo: "#d97706",
    iconBg: "from-amber-400 to-amber-600",
    svgPath: (
      <svg viewBox="0 0 80 80" fill="none" className="h-full w-full">
        <circle cx="40" cy="40" r="22" fill="rgba(255,255,255,0.2)" />
        <circle cx="40" cy="40" r="14" fill="rgba(255,255,255,0.3)" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
          <line
            key={i}
            x1={40 + 16 * Math.cos((deg * Math.PI) / 180)}
            y1={40 + 16 * Math.sin((deg * Math.PI) / 180)}
            x2={40 + 26 * Math.cos((deg * Math.PI) / 180)}
            y2={40 + 26 * Math.sin((deg * Math.PI) / 180)}
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        ))}
        <circle cx="40" cy="40" r="7" fill="rgba(255,255,255,0.55)" />
      </svg>
    ),
  },
  {
    name: "Daily Multivitamin",
    category: "Overall Wellness",
    benefit: "23 essential vitamins & minerals",
    purityScore: 96,
    badge: "Daily Essential",
    accentFrom: "#8b5cf6",
    accentTo: "#7c3aed",
    iconBg: "from-violet-400 to-violet-600",
    svgPath: (
      <svg viewBox="0 0 80 80" fill="none" className="h-full w-full">
        <rect x="16" y="28" width="20" height="28" rx="10" fill="rgba(255,255,255,0.25)" />
        <rect x="44" y="24" width="20" height="28" rx="10" fill="rgba(255,255,255,0.3)" />
        <circle cx="26" cy="22" r="8" fill="rgba(255,255,255,0.35)" />
        <circle cx="54" cy="62" r="6" fill="rgba(255,255,255,0.4)" />
        <path d="M36 42 L44 42" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

/**
 * WHY: Provide a strong hero message with rotating supplement showcase and primary CTAs.
 */
export const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > activeIndex ? 1 : -1);
      setActiveIndex(index);
    },
    [activeIndex],
  );

  const goNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % supplements.length);
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + supplements.length) % supplements.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(goNext, 4000);
    return () => clearInterval(timer);
  }, [goNext]);

  const active = supplements[activeIndex];

  const cardVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 60, scale: 0.95 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -60, scale: 0.95 }),
  };

  return (
    <motion.section
      className="relative overflow-hidden py-24 lg:py-32"
      style={{
        background: `linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)`,
      }}
      variants={fadeIn}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* Background glow blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.18 }}
          transition={{ duration: 1 }}
          className="absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full blur-3xl"
          style={{ background: active.accentFrom }}
        />
        <motion.div
          key={`b-${activeIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.12 }}
          transition={{ duration: 1 }}
          className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full blur-3xl"
          style={{ background: active.accentTo }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
      </div>

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left: Text content */}
          <div className="space-y-8">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              NutriSense AI Platform
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
            >
              Precision Fueling,{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(90deg, ${active.accentFrom}, ${active.accentTo})`,
                  transition: "background-image 0.6s ease",
                }}
              >
                Simplified
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-lg text-lg leading-relaxed text-slate-400"
            >
              Science-backed supplements, AI-powered recommendations, and
              evidence-driven nutrition guidance — all in one platform built for
              serious athletes and health-conscious individuals.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                size="lg"
                className="rounded-full px-8 font-semibold shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${active.accentFrom}, ${active.accentTo})`,
                  transition: "background 0.6s ease",
                }}
                asChild
              >
                <Link href="/supplements">Explore Supplements</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white/20 bg-white/5 px-8 font-semibold text-white hover:bg-white/10"
                asChild
              >
                <Link href="/chat">Try AI Assistant</Link>
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-6 pt-2"
            >
              {[
                { value: "200+", label: "Products" },
                { value: "100%", label: "Third-Party Tested" },
                { value: "50K+", label: "Happy Users" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span
                    className="text-2xl font-bold text-white"
                    style={{ color: active.accentFrom, transition: "color 0.6s" }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-xs text-slate-400">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Product showcase card */}
          <div className="relative flex items-center justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative w-full max-w-sm"
              >
                {/* Glass card */}
                <div
                  className="relative overflow-hidden rounded-3xl border border-white/10 p-8 shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)`,
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                  }}
                >
                  {/* Gradient accent corner */}
                  <div
                    className="absolute -top-16 -right-16 h-48 w-48 rounded-full opacity-30 blur-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${active.accentFrom}, ${active.accentTo})`,
                    }}
                  />

                  {/* Product illustration */}
                  <div className="relative mb-6 flex h-44 items-center justify-center">
                    <div
                      className={`flex h-36 w-36 items-center justify-center rounded-2xl bg-gradient-to-br p-6 shadow-lg ${active.iconBg}`}
                      style={{ transition: "all 0.4s ease" }}
                    >
                      {active.svgPath}
                    </div>
                    {/* Purity badge */}
                    <div className="absolute top-0 right-0 flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                      <Shield className="h-3 w-3 text-emerald-400" />
                      <span>{active.purityScore}% Pure</span>
                    </div>
                  </div>

                  {/* Product info */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                          {active.category}
                        </p>
                        <h3 className="mt-1 text-2xl font-bold text-white">
                          {active.name}
                        </h3>
                      </div>
                      <span
                        className="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold"
                        style={{
                          background: `linear-gradient(135deg, ${active.accentFrom}33, ${active.accentTo}33)`,
                          color: active.accentFrom,
                          border: `1px solid ${active.accentFrom}44`,
                        }}
                      >
                        {active.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Zap className="h-4 w-4" style={{ color: active.accentFrom }} />
                      {active.benefit}
                    </div>

                    {/* Purity bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Purity Score</span>
                        <span className="font-semibold text-white">{active.purityScore}/100</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          key={`bar-${activeIndex}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${active.purityScore}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                          className="h-full rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${active.accentFrom}, ${active.accentTo})`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows */}
            <button
              onClick={goPrev}
              aria-label="Previous supplement"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 rounded-full border border-white/10 bg-white/5 p-2 text-white backdrop-blur-sm transition hover:bg-white/15 lg:-translate-x-6"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goNext}
              aria-label="Next supplement"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 rounded-full border border-white/10 bg-white/5 p-2 text-white backdrop-blur-sm transition hover:bg-white/15 lg:translate-x-6"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Dot indicators */}
            <div className="absolute -bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
              {supplements.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to supplement ${i + 1}`}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === activeIndex ? "2rem" : "0.375rem",
                    background: i === activeIndex ? active.accentFrom : "rgba(255,255,255,0.2)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </motion.section>
  );
};
