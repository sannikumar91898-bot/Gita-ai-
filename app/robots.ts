// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // 🔥 आपका नया कस्टम डोमेन यहाँ सेट कर दिया गया है
  const baseUrl = "https://gitatalk.in"; 

  return {
    rules: [
      {
        userAgent: '*', // सभी सर्च इंजन बॉट्स (Google, Bing, etc.) के लिए
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
          '/api/',       // बैकएंड API को स्कैन न करे (सर्वर कॉस्ट बचाने और सिक्योरिटी के लिए)
          '/settings/',  // यूजर के प्राइवेट सेटिंग्स
          '/wallet/',    // यूजर का प्राइवेट वॉलेट
          '/admin/',     // एडमिन पैनल (अगर भविष्य में हो)
        ],
      },
      {
        // Googlebot के लिए स्पेशल रूल्स (SEO के लिए अच्छा है)
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/settings/', '/wallet/'],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`, // Google को बताएगा कि Sitemap कहाँ है
    host: baseUrl, // आपका प्रेफर्ड डोमेन
  };
}