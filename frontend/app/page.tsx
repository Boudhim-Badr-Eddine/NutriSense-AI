import { BenefitsSection } from "@/components/home/BenefitsSection";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { ServicesSection } from "@/components/home/ServicesSection";

/**
 * WHY: Compose the main landing page sections in a single layout.
 */
export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <ServicesSection />
      <BenefitsSection />
      <HowItWorksSection />
    </div>
  );
}
