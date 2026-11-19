// app/[lang]/kundli/page.tsx
import { Metadata } from 'next';
import KundliClient from './KundliClient';

// 1. Dynamic SEO Metadata
export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const isHindi = params.lang === 'hi';
  
  return {
    title: isHindi ? 'ऑनलाइन कुंडली मिलान - GitaTalk' : 'Free Online Kundli - GitaTalk',
    description: isHindi 
      ? 'अपनी जन्म कुंडली ऑनलाइन बनाएं और AI ज्योतिषी से सटीक भविष्यवाणी पाएं।' 
      : 'Generate your birth chart online and get accurate predictions from AI Astrologer.',
    // 2. Canonical URL
    alternates: {
      canonical: `https://gitatalk.in/${params.lang}/kundli`,
    },
  };
}

// 3. Tool ke liye alag Schema (SEO)
export default function KundliPage({ params }: { params: { lang: string } }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Free Online Kundli",
    "url": `https://gitatalk.in/${params.lang}/kundli`,
    "applicationCategory": "AstrologyApplication",
    "operatingSystem": "Web",
    "description": "Generate your Vedic birth chart online."
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <KundliClient />
    </>
  );
}