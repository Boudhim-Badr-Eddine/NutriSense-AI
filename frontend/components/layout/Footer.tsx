import Link from "next/link";

import { Container } from "@/components/layout/Container";

/**
 * WHY: Provide consistent footer navigation and contact details.
 */
export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-200">
      <Container className="py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/supplements" className="hover:text-white">
                  Supplements
                </Link>
              </li>
              <li>
                <Link href="/complements" className="hover:text-white">
                  Complements
                </Link>
              </li>
              <li>
                <Link href="/nutrition" className="hover:text-white">
                  Nutrition
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">About</h3>
            <p className="text-sm text-slate-300">
              NutriSense AI helps you discover supplements, complements, and
              nutrition insights powered by evidence-based data and a smart AI
              assistant.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Contact</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>Email: support@nutrisense.ai</li>
              <li>
                <Link href="https://github.com" className="hover:text-white">
                  GitHub
                </Link>
              </li>
              <li>
                <Link href="https://linkedin.com" className="hover:text-white">
                  LinkedIn
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-700 pt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} NutriSense AI. All rights reserved.
        </div>
      </Container>
    </footer>
  );
};
