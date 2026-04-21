"use client";

import { motion } from "framer-motion";
import { ArrowRight, LayoutDashboard, Lightbulb, MessageSquare } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { fadeIn, staggerContainer } from "@/lib/animations";

const steps = [
  {
    step: "01",
    title: "Browse the Database",
    description:
      "Explore our curated catalog of sports supplements, dietary complements, vitamins, and nutrition data — all backed by scientific evidence.",
    icon: LayoutDashboard,
    iconBg: "from-emerald-400 to-teal-500",
    ringColor: "ring-emerald-200",
    numColor: "text-emerald-600",
  },
  {
    step: "02",
    title: "Ask the AI",
    description:
      "Use the AI-powered chat assistant to get instant, personalized guidance on dosing, stacking, and product selection for your goals.",
    icon: MessageSquare,
    iconBg: "from-blue-400 to-sky-500",
    ringColor: "ring-blue-200",
    numColor: "text-blue-600",
  },
  {
    step: "03",
    title: "Get Clear Insights",
    description:
      "Receive tailored recommendations, safety checks, and next-step action plans so you can move forward with total confidence.",
    icon: Lightbulb,
    iconBg: "from-amber-400 to-orange-500",
    ringColor: "ring-amber-200",
    numColor: "text-amber-600",
  },
];

/**
 * WHY: Explain the simple workflow to new users with visual clarity and a CTA.
 */
export const HowItWorksSection = () => {
  return (
    <motion.section
      className="relative overflow-hidden bg-slate-50 py-28"
      variants={fadeIn}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Subtle background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.05)_0%,transparent_60%)]" />
      </div>

      <Container className="relative">
        <div className="mb-16 text-center">
          <motion.p
            variants={fadeIn}
            className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600"
          >
            Simple Process
          </motion.p>
          <motion.h2
            variants={fadeIn}
            className="font-serif text-4xl font-bold text-slate-900 lg:text-5xl"
          >
            How It Works
          </motion.h2>
          <motion.p
            variants={fadeIn}
            className="mx-auto mt-4 max-w-xl text-lg text-slate-500"
          >
            Three focused steps from curiosity to confident nutrition decisions.
          </motion.p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          className="relative grid gap-8 md:grid-cols-3"
        >
          {/* Connecting line — desktop only */}
          <div
            className="absolute top-16 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] hidden h-0.5 bg-gradient-to-r from-emerald-200 via-blue-200 to-amber-200 md:block"
            aria-hidden="true"
          />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                variants={fadeIn}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step circle */}
                <div className="relative mb-6 flex flex-col items-center">
                  <div
                    className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${step.iconBg} shadow-lg ring-4 ${step.ringColor}`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <span
                    className={`mt-2 text-xs font-bold uppercase tracking-widest ${step.numColor}`}
                  >
                    Step {step.step}
                  </span>
                </div>

                {/* Card */}
                <div className="w-full rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-lg">
                  <h3 className="text-xl font-bold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">
                    {step.description}
                  </p>
                </div>

                {/* Mobile arrow between steps */}
                {index < steps.length - 1 && (
                  <ArrowRight className="mt-6 h-5 w-5 rotate-90 text-slate-300 md:hidden" />
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={fadeIn}
          className="mt-16 flex justify-center"
        >
          <Button
            size="lg"
            className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-10 font-semibold shadow-lg hover:from-emerald-600 hover:to-teal-700"
            asChild
          >
            <Link href="/supplements">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </Container>
    </motion.section>
  );
};
