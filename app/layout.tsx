import React from "react";
import "./globals.css";
import { AppProvider } from "./Providers"; // आपके ओरिजिनल प्रोवाइडर नाम का पूरी तरह से सम्मान

export const metadata = {
  title: "Gita AI — Your Favorite Astrologer",
  description: "Personalised Vedic kundli, trilingual AI chat, daily horoscope, palmistry, and face reading guided by premium AI Experts.",
  manifest: "/manifest.webmanifest",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased overflow-x-hidden">
        {/* आपके पुराने प्रोवाइडर रैपर को बनाए रखा गया है ताकि इंटरनल स्टेट्स न टूटें */}
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
