import type { Metadata } from "next";
import { Sora, Oswald } from "next/font/google";
import "./globals.css";

const sora = Sora({ variable: "--font-sora", subsets: ["latin"], weight: ["300", "400", "500", "600"] });
const cond = Oswald({ variable: "--font-cond", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  title: "Fanthom AI Notetaker – Never Take Notes Again",
  description:
    "Fanthom captures, transcribes, and summarizes your Zoom, Google Meet, and Microsoft Teams calls. A working rebuild of fathom.ai built as a 24-hour assignment.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${cond.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
