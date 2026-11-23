// app/(localized)/[lang]/layout.tsx
import React from "react";
import { notFound } from "next/navigation";

const locales = ['en', 'hi', 'hinglish', 'te', 'ta', 'kn', 'bn', 'mr', 'gu', 'ml'];

export default async function LocalizedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!locales.includes(lang)) {
    notFound();
  }

  return <>{children}</>;
}