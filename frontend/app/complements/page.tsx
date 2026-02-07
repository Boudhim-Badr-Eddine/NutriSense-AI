import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

/**
 * WHY: Provide a landing scaffold until complements data is wired.
 */
export default function ComplementsPage() {
  return (
    <div className="bg-white py-16">
      <Container>
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-emerald-50 p-10 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Complements
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">
            Vitamins and mineral insights
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Explore biological roles, daily intake targets, and natural food
            sources for key complements. The full catalog is being wired now.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/register">Create an account</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
