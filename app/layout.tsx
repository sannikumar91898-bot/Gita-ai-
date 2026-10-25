import React from "react";
import "./globals.css";
import { Providers } from "./Providers";

export const metadata = {
  title: "Gita AI",
  description: "Your AI Companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}