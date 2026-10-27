// components/AstrologerCard.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { Astrologer, getAstrologerStatus } from "@/lib/astrologers";

interface Props {
  astrologer: Astrologer;
}

export default function AstrologerCard({ astrologer }: Props) {
  const status = getAstrologerStatus(astrologer.id);

  const statusColor =
    status === "online"
      ? "bg-green-500"
      : status === "busy"
      ? "bg-red-500"
      : "bg-gray-400";

  const statusText =
    status === "online"
      ? "Online"
      : status === "busy"
      ? "Busy • wait \~4 min"
      : "Offline";

  const viewing = 20 + (astrologer.id.charCodeAt(0) % 40);
  const queue = status === "busy" ? 3 + (astrologer.id.charCodeAt(1) % 8) : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
      <div className="p-4 flex gap-4">
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-orange-200">
            <Image
              src={astrologer.photo}
              alt={astrologer.name}
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </div>
          <span
            className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${statusColor}`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-base leading-tight">
            {astrologer.name}
            {astrologer.isCelebrity && (
              <span className="ml-1.5 text-[10px] bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded-full font-medium">
                Celebrity
              </span>
            )}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {astrologer.expertise.slice(0, 2).join(" • ")}
          </p>

          <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-600">
            <span className="flex items-center gap-0.5">
              <span className="text-yellow-500">★</span>
              {astrologer.rating}
            </span>
            <span>•</span>
            <span>{astrologer.totalChats} chats</span>
            <span>•</span>
            <span>{astrologer.experience}</span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
            <span
              className={`font-medium ${
                status === "online"
                  ? "text-green-600"
                  : status === "busy"
                  ? "text-red-600"
                  : "text-gray-500"
              }`}
            >
              {statusText}
            </span>
            {queue > 0 && (
              <span className="text-orange-600 font-medium">
                🔥 {queue} people waiting
              </span>
            )}
            <span className="text-gray-400">👁 {viewing} viewing</span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 flex items-center justify-between">
        <div>
          <span className="text-lg font-bold text-orange-600">
            ₹{astrologer.pricePerMin}
          </span>
          <span className="text-sm text-gray-400 line-through ml-1.5">
            ₹{astrologer.originalPrice}
          </span>
          <span className="text-xs text-gray-500 ml-1">/min</span>
        </div>

        <Link
          href={`/chat/${astrologer.id}`}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold text-white shadow-sm ${
            status === "offline"
              ? "bg-gray-300 pointer-events-none"
              : "bg-gradient-to-r from-orange-500 to-orange-600"
          }`}
        >
          {status === "busy" ? "Join Queue" : "Chat Now"}
        </Link>
      </div>
    </div>
  );
}
