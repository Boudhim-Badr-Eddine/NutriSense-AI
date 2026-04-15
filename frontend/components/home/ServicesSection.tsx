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
    gradient: "from-orange-500 to-amber-500",
    cardBg: "from-orange-50 to-amber-50",
    border: "border-orange-100 hover:border-orange-300",
    iconBg: "bg-gradient-to-br from-orange-400 to-amber-500",
    linkColor: "text-orange-600 group-hover:text-orange-700",
  },
  {
    title: "Dietary Complements",
    description:
      "Learn about vitamins, minerals, herbal extracts, and functional complements designed to fill the gaps in your daily diet.",
    href: "/complements",
    icon: Leaf,
    count: "80+ products",
    gradient: "from-emerald-500 to-teal-500",
    cardBg: "from-emerald-50 to-teal-50",
    border: "border-emerald-100 hover:border-emerald-300",
    iconBg: "bg-gradient-to-br from-emerald-400 to-teal-500",
    linkColor: "text-emerald-600 group-hover:text-emerald-700",
  },
  {
    title: "Nutrition Guide",
    description:
      "Discover macro-rich whole foods, meal timing strategies, and evidence-based nutrition plans tailored to your performance goals.",
    href: "/nutrition",
    icon: Utensils,
    count: "500+ foods",
    gradient: "from-blue-500 to-sky-500",
    cardBg: "from-blue-50 to-sky-50",
    border: "border-blue-100 hover:border-blue-300",
    iconBg: "bg-gradient-to-br from-blue-400 to-sky-500",
    linkColor: "text-blue-600 group-hover:text-blue-700",
  },
];

/**
 * WHY: Highlight key platform services with clear navigation and visual identity.
 */
export const ServicesSection = () => {
  return (
    <motion.section
      className="relative overflow-hidden bg-slate-50 py-28"
      variants={fadeIn}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.2 }}
    >
      <Container>
        <div className="mb-16 text-center">
          <motion.p
            variants={fadeIn}
            className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600"
          >
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
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group"
              >
                <div
                  className={`h-full rounded-2xl border bg-gradient-to-br ${service.cardBg} ${service.border} p-8 shadow-sm transition-all duration-300 group-hover:shadow-xl`}
                >
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
          className="mt-14 flex flex-wrap justify-center gap-8 rounded-2xl border border-slate-200 bg-white px-8 py-6 shadow-sm"
        >
          {[
            { value: "100%", label: "Third-Party Tested" },
            { value: "No", label: "Proprietary Blends" },
            { value: "GMP", label: "Certified Facilities" },
            { value: "Free", label: "AI Nutrition Advice" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1">
              <span className="text-2xl font-extrabold text-emerald-600">
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
