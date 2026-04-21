import type { Metadata } from "next";

import { BenefitsSection } from "@/components/home/BenefitsSection";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { ProofSection } from "@/components/home/ProofSection";
import { SectionDivider } from "@/components/home/SectionDivider";
import { ServicesSection } from "@/components/home/ServicesSection";

export const metadata: Metadata = {
  title: "NutriSense AI - Your AI-Powered Nutrition Guide",
  description:
    "Discover supplements, track nutrition, and get expert AI advice. Comprehensive database of sports supplements, dietary complements, and nutritional information.",
  keywords: [
    "nutrition",
    "supplements",
    "AI",
    "health",
    "fitness",
    "protein",
    "vitamins",
  ],
  openGraph: {
    title: "NutriSense AI",
    description: "Your AI-Powered Nutrition Guide",
    type: "website",
    url: "https://nutrisense-ai.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "NutriSense AI",
    description: "Your AI-Powered Nutrition Guide",
  },
};

/**
 * WHY: Compose the main landing page sections in a single layout.
 */
export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <SectionDivider className="-mt-10" />
      <ServicesSection />
      <SectionDivider flip className="-mt-10" />
      <ProofSection />
      <SectionDivider className="-mt-10" />
      <BenefitsSection />
      <SectionDivider flip className="-mt-10" />
      <HowItWorksSection />
    </div>
  );
}
