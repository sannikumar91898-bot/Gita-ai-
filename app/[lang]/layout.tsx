// app/[lang]/layout.tsx
import React from "react";

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    // Ye wrapper Google ko batata hai ki is page ki language kya hai
    <div lang={params.lang} className="contents">
      {children}
    </div>
  );
}