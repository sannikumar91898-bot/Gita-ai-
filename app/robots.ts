// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://gita-ai-1.onrender.com"; // Yahan apna real domain dalein (jaise https://gita-ai.com)

  return {
    rules: [
      {
        userAgent: '*', // Sabhi search engine bots (Google, Bing, etc.) ke liye
        allow: [
          '/',           // Homepage
          '/chat',       // Chat page
          '/matching',   // Kundli Milan
          '/kundli',     // Kundli page
          '/daily',      // Daily Horoscope
          '/palmistry',  // Hast Rekha
          '/face-reading', // Face Reading
          '/panchang',   // Panchang
        ],
        disallow: [
          '/api/',       // Backend API routes ko scan mat karo (Server cost bachegi aur security rahegi)
          '/settings/',  // User ke private settings page
          '/wallet/',    // User ka private wallet page
          '/admin/',     // Agar future me admin panel ho
        ],
      },
      {
        // Google ka special bot (Optional, but good for high-quality SEO)
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/settings/', '/wallet/'],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`, // Google ko batayein ki sitemap kahan hai
    host: baseUrl, // Preferred domain
  };
}