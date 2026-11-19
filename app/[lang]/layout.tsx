// app/[lang]/layout.tsx
import React from "react";
import "../globals.css"; // Path check kar lena, agar zaroorat ho

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang={params.lang} suppressHydrationWarning>
      <body className="antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}