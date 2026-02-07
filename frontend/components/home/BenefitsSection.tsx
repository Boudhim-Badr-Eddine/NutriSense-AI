"use client";

import { motion } from "framer-motion";
import { Brain, ClipboardList, Database, Sparkles } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { fadeIn, staggerContainer } from "@/lib/animations";

const benefits = [
  {
    title: "AI-Powered",
    description: "Get instant answers with a smart nutrition assistant.",
    icon: Sparkles,
  },
  {
    title: "Evidence-Based",
    description: "Access scientific-backed information and safe guidance.",
    icon: ClipboardList,
  },
  {
    title: "Comprehensive",
    description: "Explore a complete database of supplements and foods.",
    icon: Database,
  },
  {
    title: "Personalized",
    description: "Receive tailored recommendations for your goals.",
    icon: Brain,
  },
];

/**
 * WHY: Showcase platform benefits to build trust and clarity.
 */
export const BenefitsSection = () => {
  return (
    <motion.section
      className="bg-slate-50 py-20"
      variants={fadeIn}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.2 }}
    >
      <Container>
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold text-slate-900">
            Why NutriSense AI?
          </h2>
          <p className="mt-2 text-slate-600">
            Everything is designed to help you make informed nutrition choices.
          </p>
        </div>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <motion.div key={benefit.title} variants={fadeIn}>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </motion.section>
  );
};
