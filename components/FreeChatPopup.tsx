// components/FreeChatPopup.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function FreeChatPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("free_chat_seen");
    if (!seen) {
      const t = setTimeout(() => setShow(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl animate-in slide-in-from-bottom">
        <div className="text-center">
          <div className="text-4xl mb-3">🎁</div>
          <h3 className="text-lg font-bold text-gray-900">
            Congratulations!
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            You have got a <span className="font-semibold text-orange-600">FREE Chat</span> with our expert Astrologers.
          </p>
          <Link
            href="/#astrologers"
            onClick={() => {
              localStorage.setItem("free_chat_seen", "1");
              setShow(false);
            }}
            className="mt-5 block w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 rounded-full text-center"
          >
            CHAT NOW
          </Link>
          <button
            onClick={() => {
              localStorage.setItem("free_chat_seen", "1");
              setShow(false);
            }}
            className="mt-3 text-sm text-gray-500"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
