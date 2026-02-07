import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

/**
 * WHY: Provide a strong hero message and primary CTAs.
 */
export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-20">
      <div className="absolute inset-0 opacity-40">
        <div className="h-full w-full bg-[radial-gradient(circle_at_top,_#10b9811a,_transparent_55%)]" />
      </div>
      <Container className="relative">
        <div className="max-w-3xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            NutriSense AI
          </p>
          <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl lg:text-6xl">
            Your AI-Powered Nutrition Guide
          </h1>
          <p className="text-lg text-slate-600 sm:text-xl">
            Discover supplements, track nutrition, and get expert AI advice
            tailored to your goals.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link href="/supplements">Explore Supplements</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/chat">Try AI Assistant</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};
