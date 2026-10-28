
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Home", emoji: "🏠" },
  { href: "/#astrologers", label: "Chat", emoji: "💬" },
  { href: "/daily", label: "Daily", emoji: "🌟" },
  { href: "/kundli", label: "Kundli", emoji: "📜" },
  { href: "/profile", label: "Profile", emoji: "👤" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-orange-100 bg-white px-1 py-2"
    >
      {items.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : item.href === "/#astrologers"
              ? false
              : pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 py-1 ${
              active ? "text-orange-600" : "text-gray-500"
            }`}
          >
            <span className="text-xl" aria-hidden="true">
              {item.emoji}
            </span>
            <span className="text-[10px] font-medium">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
