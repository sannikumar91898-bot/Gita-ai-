// app/layout.tsx
import React from "react";
import "./globals.css";
import { AppProvider } from "./Providers";
import ServiceWorkerRegister from "./ServiceWorkerRegister";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://gitatalk.in"), 
  
  title: {
    default: "GitaTalk – Best AI Astrologer & Free Online Kundli",
    template: "%s | GitaTalk",
  },
  description:
    "Talk to GitaTalk AI, your personal Vedic astrologer. Get accurate online kundli matching, daily horoscope, palmistry, and face reading. 100% Free first chat!",
  keywords: [
    "AI Astrologer", "Online Kundli", "Free Kundli Milan", "Vedic Astrology", 
    "Daily Horoscope", "Palmistry AI", "Face Reading", "GitaTalk", "Astrology Chat",
    "Free Online Astrologer", "Kundli Matching for Marriage", "Best Astrology App India"
  ],
  authors: [{ name: "GitaTalk Team" }],
  creator: "GitaTalk",
  publisher: "GitaTalk",
  category: "Astrology",
  
  // 🔥 FIXED: 10 Languages ke liye alag-alag URL set kiye gaye hain
  alternates: { 
    canonical: "/",
    languages: {
      'en': '/en',
      'hi': '/hi',
      'te': '/te',
      'ta': '/ta',
      'kn': '/kn',
      'bn': '/bn',
      'mr': '/mr',
      'gu': '/gu',
      'ml': '/ml',
      'x-default': '/',
    },
  },
  
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
    url: "https://gitatalk.in", 
    siteName: "GitaTalk",
    title: "GitaTalk – Best AI Astrologer & Free Online Kundli",
    description: "Talk to GitaTalk AI, your personal Vedic astrologer. Get accurate online kundli matching, daily horoscope, and remedies. 100% Free first chat!",
    images: [
      {
        url: "/gita-portrait.jpg", 
        width: 1200,
        height: 630,
        alt: "GitaTalk - Your Favorite AI Astrologer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GitaTalk – Best AI Astrologer",
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
  // 🔥 FIXED: Fake Phone Number, Fake Product Schema, aur Broken Search Action hata diya gaya hai
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "GitaTalk",
      "url": "https://gitatalk.in",
      "description": "AI-powered Vedic astrology platform for Kundli, Horoscope, and Matchmaking.",
      // SearchAction hata diya kyunki /search page broken hai
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "GitaTalk",
      "url": "https://gitatalk.in",
      "logo": "https://gitatalk.in/icon-512.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "gitaaisupport@gmail.com"
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