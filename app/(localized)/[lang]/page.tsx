// app/(localized)/[lang]/page.tsx
import type { Metadata } from "next";
import HomePage from "@/components/HomePage"; // 🔥 असली होमपेज इम्पोर्ट किया

const locales = ['en', 'hi', 'hinglish', 'te', 'ta', 'kn', 'bn', 'mr', 'gu', 'ml'];
const BASE_URL = "https://gitatalk.in";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "GitaTalk – Best AI Astrologer & Free Online Kundli",
    description: "AI-powered Vedic astrology, kundli, tarot and matching.",
    alternates: {
      canonical: `${BASE_URL}/${lang}`,
      languages: Object.fromEntries(locales.map((l) => [l, `${BASE_URL}/${l}`])),
    },
  };
}

export default async function LocalizedHome({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!locales.includes(lang)) return null;
  
  // 🔥 टेस्ट टेक्स्ट की जगह असली होमपेज रेंडर कर दिया
  return <HomePage lang={lang} />;
}