"use client";

import { useMemo } from "react";

/** Deterministic ambient starfield — layered, twinkling, non-interactive. */
export function StarField({ count = 60 }: { count?: number }) {
  const stars = useMemo(() => {
    const out: { top: number; left: number; size: number; dur: number; delay: number }[] = [];
    let seed = 42;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < count; i++) {
      out.push({
        top: rnd() * 100,
        left: rnd() * 100,
        size: rnd() * 2.2 + 0.8,
        dur: rnd() * 5 + 2.5,
        delay: rnd() * 5,
      });
    }
    return out;
  }, [count]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      {stars.map((s, i) => (
        <span
          key={i}
          className="star"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            ["--dur" as string]: `${s.dur}s`,
            ["--delay" as string]: `${s.delay}s`,
          }}
        />
      ))}
      <div
        className="absolute -top-24 right-[-120px] h-[420px] w-[420px] rounded-full opacity-25"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.55), transparent 65%)" }}
      />
      <div
        className="absolute bottom-[-160px] left-[-120px] h-[460px] w-[460px] rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, rgba(209,158,47,0.5), transparent 65%)" }}
      />
    </div>
  );
}
