// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://gitatalk.in"; 

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',                // Homepage
          '/chat',            // Chat page
          '/kundli',          // Kundli
          '/matching',        // Kundli Milan
          '/palmistry',       // Hast Rekha
          '/face-reading',    // Face Reading
          '/panchang',        // Panchang
          // 10 Languages ke routes allow karne ke liye:
          '/en/', '/hi/', '/te/', '/ta/', '/kn/', '/bn/', '/mr/', '/gu/', '/ml/', '/pa/'
        ],
        disallow: [
          '/api/',            // Backend API (Cost & Security)
          '/settings/',       // Private Settings
          '/wallet/',         // Private Wallet
          '/admin/',          // Admin Panel
          '/daily',           // Duplicate route (Audit report ke hisaab se hatao)
          '/horoscope',       // Duplicate route
          '/search',          // Broken search action
        ],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}