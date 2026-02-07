import { ArrowRight, Dumbbell, Leaf, Utensils } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    title: "Supplements",
    description:
      "Explore top performance supplements curated by goal and need.",
    href: "/supplements",
    icon: Dumbbell,
  },
  {
    title: "Dietary Complements",
    description: "Learn about vitamins, minerals, and functional complements.",
    href: "/complements",
    icon: Leaf,
  },
  {
    title: "Nutrition Guide",
    description: "Discover macro-rich foods and smarter nutrition choices.",
    href: "/nutrition",
    icon: Utensils,
  },
];

/**
 * WHY: Highlight key platform services with clear navigation.
 */
export const ServicesSection = () => {
  return (
    <section className="py-20">
      <Container>
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold text-slate-900">
            Our Services
          </h2>
          <p className="mt-2 text-slate-600">
            Everything you need to build smarter nutrition habits.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card
                key={service.title}
                className="group border-slate-200 transition-shadow hover:shadow-lg"
              >
                <CardContent className="space-y-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {service.description}
                    </p>
                  </div>
                  <Link
                    href={service.href}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition-colors group-hover:text-emerald-700"
                  >
                    Explore
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
