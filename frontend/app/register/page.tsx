import type { Metadata } from "next";

import { RegisterPageClient } from "./RegisterPageClient";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a NutriSense AI account to save favorites and insights.",
  keywords: [
    "register",
    "sign up",
    "nutrition",
    "supplements",
    "account",
  ],
  openGraph: {
    title: "Register | NutriSense AI",
    description: "Create a NutriSense AI account to save favorites and insights.",
    type: "website",
    url: "https://nutrisense-ai.com/register",
  },
  twitter: {
    card: "summary_large_image",
    title: "Register | NutriSense AI",
    description: "Create a NutriSense AI account to save favorites and insights.",
  },
};

/**
 * WHY: Export SEO metadata and render the interactive registration form.
 */
export default function RegisterPage() {
  return <RegisterPageClient />;
}
