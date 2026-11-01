// components/ServiceWorkerRegister.tsx
"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    // Check karo ki browser Service Worker support karta hai ya nahi
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      
      // Service worker ko register karo
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "✅ Service Worker registered successfully with scope:",
            registration.scope
          );
        })
        .catch((error) => {
          console.error("❌ Service Worker registration failed:", error);
        });
    }
  }, []);

  // Yeh component screen par kuch render nahi karta, bas background mein kaam karta hai
  return null;
}