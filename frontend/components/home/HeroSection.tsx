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
  image: string;
}

const supplements: Supplement[] = [
  {
    name: "Whey Protein",
    category: "Muscle & Recovery",
    benefit: "25g protein per serving",
    purityScore: 98,
    badge: "Best Seller",
    accentFrom: "#0f766e",
    accentTo: "#14b8a6",
    iconBg: "from-teal-400 to-teal-600",
    image:
      "https://goldnutrition.ma/wp-content/uploads/2021/02/on-gold-standard-100-whey-protein_Image_02.jpg",
  },
  {
    name: "Creatine Monohydrate",
    category: "Strength & Power",
    benefit: "5g per serving · Pure form",
    purityScore: 99,
    badge: "Top Rated",
    accentFrom: "#1d4ed8",
    accentTo: "#38bdf8",
    iconBg: "from-blue-400 to-blue-600",
    image:
      "https://maghrebnutrition.ma/wp-content/uploads/2025/01/Creatine-Monohydrate.webp",
  },
  {
    name: "Omega-3 Fish Oil",
    category: "Heart & Brain Health",
    benefit: "1200mg EPA+DHA · Wild-caught",
    purityScore: 97,
    badge: "Science-Backed",
    accentFrom: "#0369a1",
    accentTo: "#0ea5e9",
    iconBg: "from-emerald-400 to-emerald-600",
    image:
      "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/now/now01652/y/68.jpg",
  },
  {
    name: "Vitamin D3 + K2",
    category: "Immune & Bone Support",
    benefit: "5000 IU D3 · 100mcg MK-7",
    purityScore: 99,
    badge: "Essential",
    accentFrom: "#b45309",
    accentTo: "#f59e0b",
    iconBg: "from-cyan-400 to-cyan-600",
    image:
      "https://paralagloire.ma/wp-content/uploads/2025/04/NOW-FOODS-VITAMIN-D-3-K-2-120-CAPSULES.jpg",
  },
  {
    name: "Daily Multivitamin",
    category: "Overall Wellness",
    benefit: "23 essential vitamins & minerals",
    purityScore: 96,
    badge: "Daily Essential",
    accentFrom: "#be185d",
    accentTo: "#fb7185",
    iconBg: "from-red-400 to-red-600",
    image: "/images/supplements/caffeine-beta-alanine-pre-workout.jpg",
  },
];

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
    setActiveIndex(
      (prev) => (prev - 1 + supplements.length) % supplements.length,
    );
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
        background:
          "linear-gradient(130deg, #f5f8ff 0%, #eef9ff 45%, #fdf6ec 100%)",
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
          initial={{ opacity: 0.12, scale: 0.95 }}
          animate={{ opacity: [0.1, 0.2, 0.1], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full blur-3xl"
          style={{ background: active.accentFrom }}
        />
        <motion.div
          key={`b-${activeIndex}`}
          initial={{ opacity: 0.12, scale: 0.95 }}
          animate={{ opacity: [0.1, 0.2, 0.1], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full blur-3xl"
          style={{ background: active.accentTo }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.45)_0%,transparent_70%)]" />
      </div>

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left: Text content */}
          <div className="space-y-8">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full border border-sky-900/10 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-sky-800"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-sky-600" />
              NutriSense AI Platform
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-serif text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl"
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
              className="max-w-lg text-lg leading-relaxed text-slate-600"
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
                className="rounded-full px-8 font-semibold text-white shadow-lg"
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
                className="rounded-full border-slate-300 bg-white/75 px-8 font-semibold text-slate-800 hover:bg-white"
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
                    className="text-2xl font-bold"
                    style={{
                      color: active.accentFrom,
                      transition: "color 0.6s",
                    }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-xs text-slate-500">{stat.label}</span>
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
                  className="relative overflow-hidden rounded-3xl border border-slate-200/80 shadow-[0_16px_60px_-22px_rgba(15,23,42,0.35)]"
                  style={{
                    background:
                      "linear-gradient(155deg, rgba(255,255,255,0.88) 0%, rgba(246,249,246,0.78) 100%)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                  }}
                >
                  {/* Gradient accent corner */}
                  <div
                    className="absolute -top-16 -right-16 z-0 h-48 w-48 rounded-full opacity-20 blur-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${active.accentFrom}, ${active.accentTo})`,
                    }}
                  />

                  {/* BIG product image — full width, tall */}
                  <div
                    className="relative isolate flex h-72 w-full items-center justify-center overflow-hidden"
                    style={{ backgroundColor: "rgba(229, 236, 230, 0.82)" }}
                  >
                    <motion.img
                      key={`img-${activeIndex}`}
                      src={active.image}
                      alt={active.name}
                      initial={{ scale: 1.06, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full w-full object-cover"
                      style={{
                        mixBlendMode: "multiply",
                        filter: "contrast(1.16) saturate(1.05)",
                      }}
                    />
                    {/* Gradient fade to card bottom */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to bottom, transparent 55%, rgba(15,23,42,0.22) 100%)",
                      }}
                    />
                    {/* Purity badge on top of image */}
                    <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-slate-300/80 bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-700 backdrop-blur-md">
                      <Shield
                        className="h-3 w-3"
                        style={{ color: active.accentFrom }}
                      />
                      <span>{active.purityScore}% Pure</span>
                    </div>
                    {/* Category label bottom-left of image */}
                    <p className="absolute bottom-4 left-5 text-xs font-semibold uppercase tracking-widest text-slate-700/80">
                      {active.category}
                    </p>
                  </div>

                  {/* Product info below image */}
                  <div className="space-y-3 border-t border-slate-200/80 bg-white/45 p-6">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-2xl font-bold text-slate-900">
                        {active.name}
                      </h3>
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

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Zap
                        className="h-4 w-4"
                        style={{ color: active.accentFrom }}
                      />
                      {active.benefit}
                    </div>

                    {/* Purity bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>Purity Score</span>
                        <span className="font-semibold text-slate-900">
                          {active.purityScore}/100
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-300/50">
                        <motion.div
                          key={`bar-${activeIndex}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${active.purityScore}%` }}
                          transition={{
                            duration: 0.8,
                            ease: "easeOut",
                            delay: 0.1,
                          }}
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
              className="absolute left-0 top-1/2 -translate-x-4 -translate-y-1/2 rounded-full border border-slate-300/80 bg-white/80 p-2 text-slate-700 backdrop-blur-sm transition hover:bg-white lg:-translate-x-6"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goNext}
              aria-label="Next supplement"
              className="absolute right-0 top-1/2 translate-x-4 -translate-y-1/2 rounded-full border border-slate-300/80 bg-white/80 p-2 text-slate-700 backdrop-blur-sm transition hover:bg-white lg:translate-x-6"
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
                    background:
                      i === activeIndex
                        ? active.accentFrom
                        : "rgba(100,116,139,0.35)",
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
