// components/BottomNav.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const items = [
    { href: "/", label: "Home", emoji: "🏠" },
    { href: "/#astrologers", label: "Chat", emoji: "💬" },
    { href: "/daily", label: "Daily", emoji: "🌟" },
    { href: "/profile", label: "Profile", emoji: "👤" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-orange-100 px-2 py-2 flex justify-around items-center">
      {items.map((item) => {
        const active = pathname === item.href || (item.href === "/" && pathname === "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 ${
              active ? "text-orange-600" : "text-gray-500"
            }`}
          >
            <span className="text-xl">{item.emoji}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
