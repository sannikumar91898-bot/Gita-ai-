// app/layout.tsx
import React from "react";
import "./globals.css";
import { AppProvider } from "./Providers";
import ServiceWorkerRegister from "./ServiceWorkerRegister";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://gita-ai-1.onrender.com"), 
  title: {
    default: "Gita AI — Best AI Astrologer & Free Online Kundli",
    template: "%s | Gita AI Astrology",
  },
  description:
    "Talk to Gita AI, your personal Vedic astrologer. Get accurate online kundli matching, daily horoscope, palmistry, and face reading. 100% Free first chat!",
  keywords: [
    "AI Astrologer", "Online Kundli", "Free Kundli Milan", "Vedic Astrology", 
    "Daily Horoscope", "Palmistry AI", "Face Reading", "Gita AI", "Astrology Chat",
    "Free Online Astrologer", "Kundli Matching for Marriage", "Best Astrology App India"
  ],
  authors: [{ name: "Gita AI Team" }],
  creator: "Gita AI",
  publisher: "Gita AI",
  alternates: { canonical: "/" },
  
  // 🔥 Google Search Console Verification 🔥
  verification: {
    google: "ZcIHuXYR5-z_kC0EliGBYoR41O-duRHgJ9tQVqp3E1I", 
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
    url: "https://gita-ai-1.onrender.com", 
    siteName: "Gita AI",
    title: "Gita AI — Best AI Astrologer & Free Online Kundli",
    description: "Talk to Gita AI, your personal Vedic astrologer. Get accurate online kundli matching, daily horoscope, and remedies. 100% Free first chat!",
    images: [
      {
        url: "/gita-portrait.jpg", 
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
    images: ["/gita-portrait.jpg"], 
  },
  manifest: "/manifest.webmanifest", 
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" }
    ],
    apple: "/apple-touch-icon.png", 
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, 
  userScalable: true,
  themeColor: "#0B0F19", 
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🔥 ULTIMATE JSON-LD (Google Rich Snippets ke liye) 🔥
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Gita AI",
      "url": "https://gita-ai-1.onrender.com",
      "description": "AI-powered Vedic astrology platform for Kundli, Horoscope, and Matchmaking.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://gita-ai-1.onrender.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Gita AI",
      "url": "https://gita-ai-1.onrender.com",
      "logo": "https://gita-ai-1.onrender.com/icon-512.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-XXXXXXXXXX", // Apna number dalein (Optional)
        "contactType": "customer service",
        "email": "gitaaisupport@gmail.com"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Gita AI Premium",
      "description": "Unlimited AI Astrologer Chat & Premium Reports",
      "brand": {
        "@type": "Brand",
        "name": "Gita AI"
      },
      "offers": {
        "@type": "Offer",
        "price": "199",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock"
      }
    }
  ];

  return (
    <html lang="hi" suppressHydrationWarning> 
      <body className="antialiased overflow-x-hidden">
        
        {/* Inject Structured Data */}
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