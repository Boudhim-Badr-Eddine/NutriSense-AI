import type { Metadata } from "next";

import { Container } from '@/components/layout/Container';

import { ChatPageContent } from "./ChatPageContent";

export const metadata: Metadata = {
  title: "AI Assistant",
  description:
    "Chat with NutriSense AI for personalized nutrition and supplement guidance.",
  keywords: [
    "AI assistant",
    "nutrition chatbot",
    "supplements",
    "health",
    "guidance",
  ],
  openGraph: {
    title: "AI Assistant | NutriSense AI",
    description:
      "Chat with NutriSense AI for personalized nutrition and supplement guidance.",
    type: "website",
    url: "https://nutrisense-ai.com/chat",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Assistant | NutriSense AI",
    description:
      "Chat with NutriSense AI for personalized nutrition and supplement guidance.",
  },
};

/**
 * WHY: Reserve a dedicated chat page while the widget UI is integrated.
 */
export default function ChatPage() {
  return (
    <div className='bg-gradient-to-br from-slate-900 via-slate-950 to-black py-20 text-white'>
      <Container>
        <ChatPageContent />
      </Container>
    </div>
  );
}
