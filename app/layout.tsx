
import type { ReactNode } from "react";
import "./globals.css";
import { AppProvider } from "./Providers";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="hi">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}