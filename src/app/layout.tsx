import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VerbatimAI — Real-Time Truth Intelligence Copilot",
  description: "Real-time AI fact-checking and bias-detection copilot that listens to live conversations, extracts factual claims, verifies them against live web sources, and displays an instant trust feed.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-[#07090e] antialiased">
      <body className="min-h-full flex flex-col bg-[#07090e] text-slate-100">{children}</body>
    </html>
  );
}
