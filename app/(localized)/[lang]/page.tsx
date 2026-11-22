// app/(localized)/[lang]/page.tsx
import type { Metadata } from "next";
import HomePage from "../../../page"; // ✅ आपका असली होमपेज डिज़ाइन यहीं से आएगा

const locales = ['en', 'hi', 'hinglish', 'te', 'ta', 'kn', 'bn', 'mr', 'gu', 'ml'];
const BASE_URL = "https://gitatalk.in"; // ✅ अपना असली डोमेन डालें

// 1) सभी 10 भाषाओं के लिए static page generate करें
export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

// 2) SEO के लिए hreflang + canonical
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
      languages: Object.fromEntries(
        locales.map((l) => [l, `${BASE_URL}/${l}`])
      ),
    },
  };
}

// 3) पेज — URL वाली भाषा को HomePage में pass करें
export default async function LocalizedHome({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // अगर गलत भाषा आए तो 404 (layout में पहले से check है, फिर भी safety)
  if (!locales.includes(lang)) {
    return null; // layout का notFound() इसे संभाल लेगा
  }

  return <HomePage lang={lang} />;
}