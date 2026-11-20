// app/[lang]/matching/page.tsx
import { Metadata } from 'next';
import MatchingClient from './MatchingClient';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const isHindi = params.lang === 'hi';
  return {
    title: isHindi ? 'कुंडली मिलान - GitaTalk' : 'Free Kundli Matching - GitaTalk',
    description: isHindi ? 'अपनी और साथी की कुंडली मिलान करें।' : 'Match your kundli with your partner for free.',
    alternates: { canonical: `https://gitatalk.in/${params.lang}/matching` },
  };
}

export default function MatchingPage() {
  return <MatchingClient />;
}
