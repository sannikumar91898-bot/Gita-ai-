// app/(localized)/[lang]/layout.tsx
import React from "react";
import "../../globals.css";
import { AppProvider } from "../../Providers";
import ServiceWorkerRegister from "../../ServiceWorkerRegister";

export default function LocalizedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang={params.lang}>
      <body>
        <AppProvider>
          <ServiceWorkerRegister />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}