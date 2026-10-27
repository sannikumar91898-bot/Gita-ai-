import React from "react";
import "./globals.css";
import { AppProvider } from "./Providers";

export const metadata = {
  title: "Gita AI",
  description: "Your AI Companion",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}