
import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import {
  Marcellus,
  Mulish,
  Noto_Sans_Devanagari,
} from "next/font/google";

import "./globals.css";
import { AppProvider } from "./Providers";
import { AppShell } from "../AppShell";

const marcellus = Marcellus({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marcellus",
});

const mulish = Mulish({
  subsets: ["latin"],
  variable: "--font-mulish",
});

const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari",
});

export const metadata: Metadata = {
  title: "Gita AI — Your Personal AI Astrologer",
  description:
    "Meet Gita, your warm AI astrologer. Personalised Vedic kundli, daily horoscope, palm reading and heartfelt guidance in Hindi, Hinglish and English.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/icon-512.png",
    apple: "/icons/icon-512.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Gita AI",
  },
};

export const viewport: Viewport = {
  themeColor: "#100b1d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${marcellus.variable} ${mulish.variable} ${devanagari.variable}`}
    >
      <body className="min-h-screen bg-[#100b1d] text-[#f5efff] antialiased">
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
