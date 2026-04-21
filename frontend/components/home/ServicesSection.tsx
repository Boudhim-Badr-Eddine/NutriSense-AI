"use client";

import { motion } from "framer-motion";
import { ArrowRight, Dumbbell, Leaf, Utensils } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { fadeIn, staggerContainer } from "@/lib/animations";

const services = [
  {
    title: "Supplements",
    description:
      "Explore top-performance supplements curated by goal, category, and scientific evidence. Find exactly what your body needs.",
    href: "/supplements",
    icon: Dumbbell,
    count: "120+ products",
    cardBg: "from-sky-500/12 to-cyan-500/5",
    border: "border-sky-200/50 hover:border-sky-300/75",
    iconBg: "bg-gradient-to-br from-sky-500 to-cyan-500",
    linkColor: "text-sky-700 group-hover:text-sky-800",
  },
  {
    title: "Dietary Complements",
    description:
      "Learn about vitamins, minerals, herbal extracts, and functional complements designed to fill the gaps in your daily diet.",
    href: "/complements",
    icon: Leaf,
    count: "80+ products",
    cardBg: "from-cyan-500/12 to-teal-500/6",
    border: "border-cyan-200/50 hover:border-cyan-300/75",
    iconBg: "bg-gradient-to-br from-cyan-500 to-teal-500",
    linkColor: "text-cyan-700 group-hover:text-cyan-800",
  },
  {
    title: "Nutrition Guide",
    description:
      "Discover macro-rich whole foods, meal timing strategies, and evidence-based nutrition plans tailored to your performance goals.",
    href: "/nutrition",
    icon: Utensils,
    count: "500+ foods",
    cardBg: "from-amber-500/10 to-orange-500/5",
    border: "border-amber-200/45 hover:border-amber-300/70",
    iconBg: "bg-gradient-to-br from-orange-500 to-amber-500",
    linkColor: "text-amber-700 group-hover:text-amber-800",
  },
];

/**
 * WHY: Highlight key platform services with clear navigation and visual identity.
 */
export const ServicesSection = () => {
  return (
    <motion.section
      className="relative overflow-hidden py-28"
      style={{
        background:
          "linear-gradient(180deg, rgba(236,245,255,0.75) 0%, rgba(236,250,255,0.92) 40%, rgba(255,249,242,1) 100%)",
      }}
      variants={fadeIn}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -left-24 top-8 h-64 w-64 rounded-full bg-sky-300/25 blur-3xl"
          animate={{ x: [0, 24, 0], y: [0, -18, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl"
          animate={{ x: [0, -28, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <Container>
        <div className="mb-16 text-center">
          <motion.p
            variants={fadeIn}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-sky-600" />
            What We Offer
          </motion.p>
          <motion.h2
            variants={fadeIn}
            className="font-serif text-4xl font-bold text-slate-900 lg:text-5xl"
          >
            Our Services
          </motion.h2>
          <motion.p
            variants={fadeIn}
            className="mx-auto mt-4 max-w-xl text-lg text-slate-500"
          >
            Everything you need to build smarter, evidence-based nutrition
            habits — all in one place.
          </motion.p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-7 md:grid-cols-3"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                variants={fadeIn}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.22 },
                }}
                className="group"
              >
                <div
                  className={`relative h-full overflow-hidden rounded-2xl border bg-gradient-to-br ${service.cardBg} ${service.border} p-8 shadow-sm transition-all duration-300 group-hover:shadow-2xl`}
                >
                  <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/45 blur-2xl" />
                  {/* Icon + count */}
                  <div className="mb-6 flex items-center justify-between">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${service.iconBg} shadow-md`}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm">
                      {service.count}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {service.description}
                  </p>

                  <Link
                    href={service.href}
                    className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold transition-colors ${service.linkColor}`}
                  >
                    Explore
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Trust bar */}
        <motion.div
          variants={fadeIn}
          className="mt-14 flex flex-wrap justify-center gap-8 rounded-2xl border border-sky-200/45 bg-white/85 px-8 py-6 shadow-sm backdrop-blur-md"
        >
          {[
            { value: "100%", label: "Third-Party Tested" },
            { value: "No", label: "Proprietary Blends" },
            { value: "GMP", label: "Certified Facilities" },
            { value: "Free", label: "Expert Nutrition Advice" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1">
              <span className="text-2xl font-extrabold text-sky-700">
                {item.value}
              </span>
              <span className="text-xs font-medium text-slate-500">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>
      </Container>
    </motion.section>
  );
};
