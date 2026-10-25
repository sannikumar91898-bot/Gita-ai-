"use client";

import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0f081d] text-white p-6 flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-purple-400 mb-2 font-display">404</h1>
      <h2 className="text-xl font-semibold text-violet-100 mb-4">Page Not Found</h2>
      <p className="text-gray-400 text-sm max-w-sm mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl text-black font-bold text-sm shadow-lg hover:from-amber-400 hover:to-amber-500 transition-all">
        Go Back Home
      </Link>
    </div>
  );
}
