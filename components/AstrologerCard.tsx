
"use client";

import Image from "next/image";
import Link from "next/link";
import type { Astrologer } from "@/lib/astrologers";

interface AstrologerCardProps {
  astrologer: Astrologer;
  status?: "online" | "busy" | "offline";
}

export default function AstrologerCard({
  astrologer,
  status = "online",
}: AstrologerCardProps) {
  const statusConfig = {
    online: {
      label: "Online",
      color: "bg-emerald-500",
    },
    busy: {
      label: "Busy",
      color: "bg-amber-500",
    },
    offline: {
      label: "Offline",
      color: "bg-gray-400",
    },
  };

  const currentStatus = statusConfig[status];

  return (
    <article className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-purple-50">
        <Image
          src={astrologer.photo}
          alt={astrologer.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-top"
        />

        <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-gray-800 shadow">
          <span
            className={`h-2 w-2 rounded-full ${currentStatus.color}`}
          />
          {currentStatus.label}
        </div>

        {astrologer.isCelebrity && (
          <div className="absolute right-3 top-3 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-bold text-gray-900 shadow">
            ★ Featured
          </div>
        )}
      </div>

      <div className="space-y-3 p-4">
        <div>
          <h3 className="text-base font-bold text-gray-900">
            {astrologer.name}
          </h3>

          <div className="mt-1 flex items-center gap-1 text-sm text-amber-600">
            <span aria-hidden="true">★</span>
            <span className="font-semibold">{astrologer.rating}</span>
            <span className="text-gray-500">
              · {astrologer.totalChats} chats
            </span>
          </div>

          <p className="mt-1 text-xs text-gray-500">
            {astrologer.experience} experience
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {astrologer.expertise.slice(0, 3).map((item) => (
            <span
              key={item}
              className="rounded-full bg-purple-50 px-2.5 py-1 text-xs text-purple-800"
            >
              {item}
            </span>
          ))}
        </div>

        <p className="line-clamp-2 text-sm leading-5 text-gray-600">
          {astrologer.shortBio}
        </p>

        <div className="flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
          <div>
            <p className="text-lg font-bold text-purple-800">
              ₹{astrologer.pricePerMin}
              <span className="text-xs font-normal text-gray-500">
                /min
              </span>
            </p>

            <p className="text-xs text-gray-400 line-through">
              ₹{astrologer.originalPrice}/min
            </p>
          </div>

          <Link
            href={`/chat/${encodeURIComponent(astrologer.id)}`}
            className="rounded-xl bg-purple-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            aria-label={`Chat with ${astrologer.name}`}
          >
            Chat Now
          </Link>
        </div>
      </div>
    </article>
  );
}
