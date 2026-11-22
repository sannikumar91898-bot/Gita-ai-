// app/layout.tsx
import "./globals.css";
import { AppProvider } from "./Providers"; // या जो भी सही path हो

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}