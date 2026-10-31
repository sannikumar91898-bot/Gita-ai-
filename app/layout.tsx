// app/layout.tsx
import React from "react";
import "./globals.css";
import { AppProvider } from "./Providers";
import ServiceWorkerRegister from "./ServiceWorkerRegister"; // Naya component import kiya

export const metadata = {
  title: "Gita AI — Your Favorite Astrologer",
  description: "Personalised Vedic kundli, trilingual AI chat, daily horoscope, palmistry, and face reading guided by premium AI Experts.",
  manifest: "/manifest.webmanifest",
};

// 🔥 FIX: Viewport ko metadata se bahar nikal diya (Next.js 14 requirement) taaki warning na aaye
export const viewport = {
  width: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased overflow-x-hidden">
        {/* 🔥 Service Worker Register yahan add kiya taaki PWABuilder isko detect kar sake */}
        <ServiceWorkerRegister />
        
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}