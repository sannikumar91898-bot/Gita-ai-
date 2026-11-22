// app/(main)/layout.tsx
import React from "react";
import "../globals.css";
import { AppProvider } from "../Providers";
import ServiceWorkerRegister from "../ServiceWorkerRegister";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://gitatalk.in"),
  title: { default: "GitaTalk – Best AI Astrologer & Free Online Kundli", template: "%s | GitaTalk" },
  // ... आपका पुराना मेटाडेटा यहाँ कॉपी करें ...
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#0B0F19",
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <ServiceWorkerRegister />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}