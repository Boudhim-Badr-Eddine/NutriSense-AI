import type { Metadata } from "next";

import { ChatWidgetLoader } from "@/components/layout/ChatWidgetLoader";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { AuthProvider } from "./AuthContext";
import "./globals.css";
import { Providers } from "./providers";

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
      <body className="font-sans antialiased">
        <Providers>
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <ChatWidgetLoader />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
