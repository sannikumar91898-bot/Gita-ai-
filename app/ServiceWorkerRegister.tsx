// app/ServiceWorkerRegister.tsx
"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      // 🔥 window.load event HATAO, seedha register karo
      navigator.serviceWorker.register("/sw.js").then(
        function (registration) {
          console.log("SW registered:", registration.scope);
        },
        function (err) {
          console.log("SW failed:", err);
        }
      );
    }
  }, []);

  return null;
}