import type { Metadata } from "next";

import { LoginPageClient } from "./LoginPageClient";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to access your personalized nutrition dashboard.",
  keywords: [
    "login",
    "sign in",
    "nutrition",
    "supplements",
    "account",
  ],
  openGraph: {
    title: "Login | NutriSense AI",
    description: "Sign in to access your personalized nutrition dashboard.",
    type: "website",
    url: "https://nutrisense-ai.com/login",
  },
  twitter: {
    card: "summary_large_image",
    title: "Login | NutriSense AI",
    description: "Sign in to access your personalized nutrition dashboard.",
  },
};

/**
 * WHY: Export SEO metadata and render the interactive login form.
 */
export default function LoginPage() {
  return <LoginPageClient />;
}
