import type { Metadata } from "next";
import { Manrope, Plus_Jakarta_Sans } from "next/font/google";

import { CartProvider } from "@/app/CartContext";
import { ChatWidgetLoader } from "@/components/layout/ChatWidgetLoader";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { AuthProvider } from "./AuthContext";
import "./globals.css";
import { Providers } from "./providers";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "NutriSense AI",
    template: "%s | NutriSense AI",
  },
  description: "Supplements and nutrition platform with an AI assistant.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${plusJakartaSans.variable} ${manrope.variable} font-sans antialiased`}
      >
        <Providers>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <main className="min-h-screen">{children}</main>
              <Footer />
              <ChatWidgetLoader />
            </CartProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
