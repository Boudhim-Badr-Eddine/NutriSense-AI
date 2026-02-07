import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/Container";

const steps = [
  {
    step: "01",
    title: "Browse Database",
    description: "Explore supplements, complements, and nutrition data.",
  },
  {
    step: "02",
    title: "Ask Questions",
    description: "Use the AI chatbot to get instant guidance.",
  },
  {
    step: "03",
    title: "Get Insights",
    description: "Receive personalized recommendations and next steps.",
  },
];

/**
 * WHY: Explain the simple workflow to new users.
 */
export const HowItWorksSection = () => {
  return (
    <section className="py-20">
      <Container>
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold text-slate-900">
            How It Works
          </h2>
          <p className="mt-2 text-slate-600">
            Three simple steps to smarter nutrition decisions.
          </p>
        </div>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {steps.map((step, index) => (
            <div key={step.step} className="flex flex-1 items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <span className="text-sm font-semibold">{step.step}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="hidden h-5 w-5 text-slate-400 md:block" />
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
