

"use client";

import Image from "next/image";
import {
  ASTROLOGER_IMAGE,
  ASTROLOGER_ALT,
} from "./astrologer";

/** The one and only Gita — same portrait everywhere. */
export function Avatar({
  size = 96,
  glow = true,
  float = false,
}: {
  size?: number;
  glow?: boolean;
  float?: boolean;
}) {
  return (
    <div
      className={`relative inline-block ${
        float ? "anim-floaty" : ""
      }`}
      style={{ width: size, height: size }}
    >
      <Image
        src={ASTROLOGER_IMAGE}
        alt={ASTROLOGER_ALT}
        width={size}
        height={size}
        priority={size >= 96}
        className={`h-full w-full rounded-full object-cover ring-2 ring-gold-400/70 ${
          glow ? "avatar-glow" : ""
        }`}
      />

      <span
        className="absolute -bottom-1 -right-1 flex items-center justify-center rounded-full bg-night-900 ring-1 ring-gold-400/60"
        style={{
          width: size * 0.28,
          height: size * 0.28,
        }}
      >
        <span
          className="text-gold-300"
          style={{ fontSize: size * 0.15 }}
        >
          ✦
        </span>
      </span>
    </div>
  );
}
