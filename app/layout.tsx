// app/layout.tsx
import "./globals.css"; // अगर आपकी globals.css कहीं और है तो path चेक कर लें
import { AppProvider } from "./Providers"; // पक्का करें कि Providers.tsx में AppProvider export हो रहा है

export const metadata = {
  title: "Gita AI - Your Personal AI Astrologer",
  description: "Premium AI Vedic astrology, kundli, palmistry and more.",
};

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