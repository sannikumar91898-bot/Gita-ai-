
"use client";

import Image from "next/image";
import Link from "next/link";
import type { Astrologer } from "@/lib/astrologers";

interface Props {
  astrologer: Astrologer;
}

export default function AstrologerCard({
  astrologer,
}: Props) {
  return (
    <article className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
      <div className="flex gap-4 p-4">
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border-2 border-orange-200">
          <Image
            src={astrologer.photo}
            alt={astrologer.name}
            fill
            sizes="80px"
            className="object-cover"
          />

          <span className="absolute inset-x-0 bottom-0 bg-emerald-600 py-0.5 text-center text-[9px] font-bold text-white">
            AI
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="text-base font-semibold leading-tight text-gray-900">
              {astrologer.name}
            </h3>

            {astrologer.isCelebrity && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-semibold text-amber-800">
                Featured
              </span>
            )}
          </div>

          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            {astrologer.expertise.slice(0, 3).join(" • ")}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-gray-500">
            <span className="rounded-full bg-emerald-50 px-2 py-1 font-medium text-emerald-700">
              AI Astrologer
            </span>

            <span>
              {astrologer.languages.join(" / ")}
            </span>
          </div>

          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-600">
            {astrologer.shortBio}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-orange-50 px-4 py-3">
        <div>
          <span className="text-lg font-bold text-orange-600">
            ₹{astrologer.pricePerMin}
          </span>

          {astrologer.originalPrice > astrologer.pricePerMin && (
            <span className="ml-1.5 text-xs text-gray-400 line-through">
              ₹{astrologer.originalPrice}
            </span>
          )}

          <span className="ml-1 text-xs text-gray-500">
            /min
          </span>
        </div>

        <Link
          href={`/chat/${astrologer.id}`}
          className="rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-orange-600 hover:to-orange-700 active:scale-95"
        >
          Chat Now
        </Link>
      </div>
    </article>
  );
}
