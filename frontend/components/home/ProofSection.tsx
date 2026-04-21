"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, Star, Users } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { fadeIn, staggerContainer } from "@/lib/animations";

interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  topic: string;
  color: string;
}

interface StatItem {
  icon: typeof Users;
  value: string;
  label: string;
}

const testimonials: TestimonialItem[] = [
  {
    quote:
      "I finally stopped guessing my supplement stack. The AI breaks everything down clearly and safely.",
    author: "Yassine A.",
    role: "CrossFit Athlete",
    topic: "Supplements",
    color: "from-sky-500/15 to-indigo-500/10",
  },
  {
    quote:
      "Best nutrition platform I used in Morocco. It feels premium and actually useful day to day.",
    author: "Salma R.",
    role: "Nutrition Student",
    topic: "Nutrition Guides",
    color: "from-cyan-500/15 to-teal-500/10",
  },
  {
    quote:
      "The science references and dosage tips gave me confidence to choose products smarter.",
    author: "Mehdi K.",
    role: "Gym Coach",
    topic: "Safety & Dosage",
    color: "from-amber-500/15 to-orange-500/10",
  },
  {
    quote:
      "I love that product details explain when to take each capsule and with what meal. Very practical.",
    author: "Nadia T.",
    role: "Busy Professional",
    topic: "Product Details",
    color: "from-indigo-500/15 to-blue-500/10",
  },
  {
    quote:
      "Checkout was smooth and I got my order timeline immediately. It feels like a real e-commerce store.",
    author: "Hamza L.",
    role: "Customer",
    topic: "Service Quality",
    color: "from-sky-500/15 to-cyan-500/10",
  },
  {
    quote:
      "Favorites and order history make it easy to repeat my monthly stack without searching again.",
    author: "Imane B.",
    role: "Fitness Enthusiast",
    topic: "User Experience",
    color: "from-emerald-500/15 to-teal-500/10",
  },
];

const stats: StatItem[] = [
  { icon: Users, value: "50K+", label: "Active Users" },
  { icon: ShieldCheck, value: "100%", label: "Evidence-Based Guidance" },
  { icon: Sparkles, value: "2s", label: "Average AI Response" },
  { icon: Star, value: "4.9/5", label: "User Satisfaction" },
];

const marqueeCards = [...testimonials, ...testimonials];

/**
 * WHY: Add strong social proof and trust cues between discovery sections.
 */
export const ProofSection = () => {
  return (
    <motion.section
      className="relative overflow-hidden py-24"
      style={{
        background:
          "linear-gradient(180deg, rgba(246,250,255,1) 0%, rgba(234,246,255,0.95) 45%, rgba(255,249,242,0.9) 100%)",
      }}
      variants={fadeIn}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.25 }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_30%,rgba(14,165,233,0.12)_0%,transparent_38%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_72%,rgba(245,158,11,0.12)_0%,transparent_42%)]" />
      </div>

      <Container className="relative">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          className="rounded-3xl border border-sky-200/60 bg-white/85 p-8 shadow-[0_20px_70px_-30px_rgba(15,23,42,0.35)] backdrop-blur-md md:p-10"
        >
          <motion.div variants={fadeIn} className="mb-8 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
              Trusted By Real Users
            </p>
            <h3 className="font-serif text-3xl font-bold text-slate-900 md:text-4xl">
              Results You Can Feel, Guidance You Can Trust
            </h3>
          </motion.div>

          <motion.div
            variants={fadeIn}
            className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {stats.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-200 bg-white/85 p-4 text-center shadow-sm"
                >
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-sky-50">
                    <Icon className="h-5 w-5 text-sky-700" />
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900">
                    {item.value}
                  </p>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {item.label}
                  </p>
                </div>
              );
            })}
          </motion.div>

          <motion.div variants={fadeIn} className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-white/90 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-white/90 to-transparent" />

            <motion.div
              className="flex w-max gap-4"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            >
              {marqueeCards.map((testimonial, index) => (
                <motion.article
                  key={`${testimonial.author}-${testimonial.topic}-${index}`}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className={`w-[320px] shrink-0 rounded-2xl border border-slate-200 bg-gradient-to-br ${testimonial.color} p-5 shadow-sm md:w-[360px]`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                    <span className="rounded-full border border-slate-200/70 bg-white/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                      {testimonial.topic}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-700">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {testimonial.author}
                    </p>
                    <p className="text-xs text-slate-500">{testimonial.role}</p>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>
    </motion.section>
  );
};
