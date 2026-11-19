// app/[lang]/page.tsx
import Link from "next/link";

// Ye function Next.js ko batata hai ki kaunsi languages support karni hain
export async function generateStaticParams() {
  return [
    { lang: 'en' },
    { lang: 'hi' },
    { lang: 'te' },
    { lang: 'ta' },
    { lang: 'kn' },
    { lang: 'bn' },
    { lang: 'mr' },
    { lang: 'gu' },
    { lang: 'ml' },
  ];
}

export default function LangHomePage({ params }: { params: { lang: string } }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FEF8EF] text-center p-6">
      <h1 className="text-3xl font-bold text-[#ff6b00] mb-4">
        Welcome to GitaTalk ({params.lang.toUpperCase()})
      </h1>
      <p className="mb-6">Your language is set to: {params.lang}</p>
      
      {/* Example link jo language ke hisaab se kaam karega */}
      <Link 
        href={`/${params.lang}/kundli`} 
        className="px-6 py-3 bg-[#ff6b00] text-white rounded-lg font-bold"
      >
        Go to Kundli Page
      </Link>
    </div>
  );
}