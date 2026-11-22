// app/[lang]/panchang/page.tsx
import { Metadata } from 'next';
import PanchangClient from './PanchangClient';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}): Promise<Metadata> {
  const resolvedParams = await params; // 🔥 Next.js के लिए params को await करना ज़रूरी है
  const isHindi = resolvedParams.lang === 'hi';
  
  return {
    title: isHindi ? 'आज का पंचांग - GitaTalk' : 'Today Panchang - GitaTalk',
    description: isHindi ? 'आज का पंचांग, तिथि, नक्षत्र और सूर्योदय का समय देखें।' : 'Check today Panchang, tithi, nakshatra, and sunrise timings.',
    alternates: { canonical: `https://gitatalk.in/${resolvedParams.lang}/panchang` },
  };
}

export default function PanchangPage() {
  return <PanchangClient />;
}