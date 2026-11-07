// app/chat/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sparkles } from "lucide-react";

export default function AstrologerRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const astrologerId = typeof params?.id === "string" ? params.id : "";

  useEffect(() => {
    if (astrologerId) {
      // 🔥 Purane link (/chat/gita) ko naye chat page (/chat?persona=gita) par bhej do
      router.replace(`/chat?persona=${astrologerId}`);
    } else {
      router.replace("/chat");
    }
  }, [astrologerId, router]);

  return (
    <div className="flex h-[100dvh] w-full flex-col items-center justify-center bg-[#0B0F19] text-white">
      <Sparkles size={40} className="text-orange-500 animate-spin mb-4" />
      <h1 className="text-lg font-black text-orange-500">Connecting to Astrologer...</h1>
      <p className="text-sm text-slate-400 mt-2">Please wait while we set up your session.</p>
    </div>
  );
}