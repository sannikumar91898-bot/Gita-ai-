// app/(localized)/[lang]/layout.tsx
import React from "react";
import { notFound } from "next/navigation";
import "../../globals.css";
import { AppProvider } from "../../Providers";
import ServiceWorkerRegister from "../../ServiceWorkerRegister";

const locales = ['en', 'hi', 'hinglish', 'te', 'ta', 'kn', 'bn', 'mr', 'gu', 'ml'];

export default async function LocalizedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;      // ✅ Promise
}) {
  const { lang } = await params;           // ✅ await

  if (!locales.includes(lang)) {           // ✅ invalid lang → 404
    notFound();
  }

  return (
    <html lang={lang}>
      <body>
        <AppProvider>
          <ServiceWorkerRegister />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}