import React from "react";
import "./globals.css";
import { AppProvider } from "./Providers";
import ServiceWorkerRegister from "./ServiceWorkerRegister";
import type { Metadata, Viewport } from "next";

// 🔥 SEO 9.5+ Metadata Setup
export const metadata: Metadata = {
  metadataBase: new URL("https://gita-ai-1.onrender.com"), // Apna real domain yahan dalein (jaise https://gita-ai.com)
  title: {
    default: "Gita AI — Best AI Astrologer & Free Online Kundli",
    template: "%s | Gita AI Astrology",
  },
  description:
    "Talk to Gita AI, your personal Vedic astrologer. Get accurate online kundli matching, daily horoscope, palmistry, and face reading. 100% Free first chat!",
  keywords: [
    "AI Astrologer",
    "Online Kundli",
    "Free Kundli Milan",
    "Vedic Astrology",
    "Daily Horoscope",
    "Palmistry AI",
    "Face Reading",
    "Gita AI",
    "Astrology Chat"
  ],
  authors: [{ name: "Gita AI Team" }],
  creator: "Gita AI",
  publisher: "Gita AI",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://gita-ai-1.onrender.com", // Apna real domain dalein
    siteName: "Gita AI",
    title: "Gita AI — Best AI Astrologer & Free Online Kundli",
    description: "Talk to Gita AI, your personal Vedic astrologer. Get accurate online kundli matching, daily horoscope, and remedies. 100% Free first chat!",
    images: [
      {
        url: "/og-image.jpg", // Ek 1200x630 ka banner public folder me daalein
        width: 1200,
        height: 630,
        alt: "Gita AI - Your Favorite AI Astrologer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gita AI — Best AI Astrologer",
    description: "Get accurate online kundli matching and daily horoscope for free.",
    images: ["/og-image.jpg"], // Same banner yahan bhi use hoga
  },
  manifest: "/manifest.webmanifest", // PWA manifest
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png", // Agar hai toh
  },
};

// 🔥 Viewport Fix: Accessibility aur Mobile SEO ke liye (Zoom allow kiya)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // User zoom kar sakta hai (SEO Audit Fix)
  userScalable: true,
  themeColor: "#0B0F19", // Mobile browser ki top bar ka color
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🔥 JSON-LD (Structured Data) for Google Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Gita AI",
    url: "https://gita-ai-1.onrender.com", // Apna real domain dalein
    description: "AI-powered Vedic astrology platform for Kundli, Horoscope, and Matchmaking.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://gita-ai-1.onrender.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="hi" suppressHydrationWarning> 
      {/* Note: Agar audience Indian hai toh lang="hi" (Hindi) ya lang="en-IN" zyada better SEO deta hai. */}
      <body className="antialiased overflow-x-hidden">
        
        {/* JSON-LD Script Injected into Body */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        <ServiceWorkerRegister />
        
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}