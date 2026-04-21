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
    gradient: "from-sky-500/12 to-cyan-500/6",
    border: "border-sky-200/45 hover:border-sky-300/70",
    iconBg: "bg-gradient-to-br from-sky-500 to-cyan-500",
    statColor: "text-sky-700",
    titleColor: "text-sky-800",
  },
  {
    title: "Evidence-Based",
    description:
      "Every recommendation is grounded in peer-reviewed science. No pseudoscience, no guesswork — only vetted, safe guidance.",
    stat: "500+",
    statLabel: "Studies referenced",
    icon: ClipboardList,
    gradient: "from-indigo-500/10 to-blue-500/5",
    border: "border-indigo-200/40 hover:border-indigo-300/70",
    iconBg: "bg-gradient-to-br from-indigo-500 to-blue-500",
    statColor: "text-indigo-700",
    titleColor: "text-indigo-800",
  },
  {
    title: "Comprehensive",
    description:
      "Explore a complete database of sports supplements, dietary complements, vitamins, and macro-rich whole foods in one place.",
    stat: "200+",
    statLabel: "Products catalogued",
    icon: Database,
    gradient: "from-cyan-500/10 to-teal-500/5",
    border: "border-cyan-200/40 hover:border-cyan-300/70",
    iconBg: "bg-gradient-to-br from-cyan-500 to-teal-500",
    statColor: "text-cyan-700",
    titleColor: "text-cyan-800",
  },
  {
    title: "Personalized",
    description:
      "Receive tailored recommendations aligned to your specific fitness goals, dietary restrictions, and health priorities.",
    stat: "1:1",
    statLabel: "Personalized advice",
    icon: Brain,
    gradient: "from-amber-500/10 to-orange-500/5",
    border: "border-amber-200/40 hover:border-amber-300/70",
    iconBg: "bg-gradient-to-br from-orange-500 to-amber-500",
    statColor: "text-amber-700",
    titleColor: "text-amber-800",
  },
];

/**
 * WHY: Showcase platform benefits to build trust and clarity with strong visual hierarchy.
 */
export const BenefitsSection = () => {
  return (
    <motion.section
      className="relative overflow-hidden py-28"
      style={{
        background:
          "linear-gradient(180deg, rgba(245,249,255,1) 0%, rgba(236,246,255,0.96) 45%, rgba(255,248,241,1) 100%)",
      }}
      variants={fadeIn}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Subtle background radial accents */}
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(14,165,233,0.1)_0%,transparent_50%)]"
          animate={{ opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.1)_0%,transparent_55%)]"
          animate={{ opacity: [0.3, 0.52, 0.3] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <Container className="relative">
        <div className="mb-16 text-center">
          <motion.p
            variants={fadeIn}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-sky-600" />
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
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.22 },
                }}
                className="group"
              >
                <div
                  className={`relative h-full overflow-hidden rounded-2xl border bg-gradient-to-br ${benefit.gradient} ${benefit.border} p-7 shadow-sm transition-all duration-300 group-hover:shadow-2xl`}
                >
                  <div className="pointer-events-none absolute -bottom-16 -right-10 h-36 w-36 rounded-full bg-white/45 blur-2xl" />
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
