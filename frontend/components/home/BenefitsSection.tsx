"use client";

import { motion } from "framer-motion";
import { Brain, ClipboardList, Database, Sparkles } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { fadeIn, staggerContainer } from "@/lib/animations";

const benefits = [
  {
    title: "AI-Powered",
    description:
      "Get instant, context-aware answers from a smart nutrition assistant trained on thousands of clinical studies and product data.",
    stat: "< 2s",
    statLabel: "Response time",
    icon: Sparkles,
    gradient: "from-orange-50 to-amber-50",
    border: "border-orange-100 hover:border-orange-300",
    iconBg: "bg-gradient-to-br from-orange-400 to-amber-500",
    statColor: "text-orange-600",
    titleColor: "text-orange-700",
  },
  {
    title: "Evidence-Based",
    description:
      "Every recommendation is grounded in peer-reviewed science. No pseudoscience, no guesswork — only vetted, safe guidance.",
    stat: "500+",
    statLabel: "Studies referenced",
    icon: ClipboardList,
    gradient: "from-blue-50 to-sky-50",
    border: "border-blue-100 hover:border-blue-300",
    iconBg: "bg-gradient-to-br from-blue-400 to-sky-500",
    statColor: "text-blue-600",
    titleColor: "text-blue-700",
  },
  {
    title: "Comprehensive",
    description:
      "Explore a complete database of sports supplements, dietary complements, vitamins, and macro-rich whole foods in one place.",
    stat: "200+",
    statLabel: "Products catalogued",
    icon: Database,
    gradient: "from-emerald-50 to-teal-50",
    border: "border-emerald-100 hover:border-emerald-300",
    iconBg: "bg-gradient-to-br from-emerald-400 to-teal-500",
    statColor: "text-emerald-600",
    titleColor: "text-emerald-700",
  },
  {
    title: "Personalized",
    description:
      "Receive tailored recommendations aligned to your specific fitness goals, dietary restrictions, and health priorities.",
    stat: "1:1",
    statLabel: "Personalized advice",
    icon: Brain,
    gradient: "from-violet-50 to-purple-50",
    border: "border-violet-100 hover:border-violet-300",
    iconBg: "bg-gradient-to-br from-violet-400 to-purple-500",
    statColor: "text-violet-600",
    titleColor: "text-violet-700",
  },
];

/**
 * WHY: Showcase platform benefits to build trust and clarity with strong visual hierarchy.
 */
export const BenefitsSection = () => {
  return (
    <motion.section
      className="relative overflow-hidden bg-white py-28"
      variants={fadeIn}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Subtle background radial accents */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(16,185,129,0.06)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.06)_0%,transparent_50%)]" />
      </div>

      <Container className="relative">
        <div className="mb-16 text-center">
          <motion.p
            variants={fadeIn}
            className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600"
          >
            Why Choose Us
          </motion.p>
          <motion.h2
            variants={fadeIn}
            className="font-serif text-4xl font-bold text-slate-900 lg:text-5xl"
          >
            Why NutriSense AI?
          </motion.h2>
          <motion.p
            variants={fadeIn}
            className="mx-auto mt-4 max-w-xl text-lg text-slate-500"
          >
            Every feature is engineered to help you make faster, smarter, and
            safer nutrition decisions.
          </motion.p>
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
              <motion.div
                key={benefit.title}
                variants={fadeIn}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group"
              >
                <div
                  className={`h-full rounded-2xl border bg-gradient-to-br ${benefit.gradient} ${benefit.border} p-7 shadow-sm transition-all duration-300 group-hover:shadow-xl`}
                >
                  <div
                    className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${benefit.iconBg} shadow-md`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="mb-4">
                    <span
                      className={`text-3xl font-extrabold ${benefit.statColor}`}
                    >
                      {benefit.stat}
                    </span>
                    <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-slate-400">
                      {benefit.statLabel}
                    </p>
                  </div>
                  <h3 className={`text-lg font-bold ${benefit.titleColor}`}>
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
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
