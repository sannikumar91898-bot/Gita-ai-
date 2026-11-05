// app/sitemap.ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // 🔥 Apna real domain yahan dalein (Future me custom domain lagayein toh yahan update karein)
  const baseUrl = "https://gita-ai-1.onrender.com"; 
  
  // Aaj ki date (Google ko batata hai ki content recent hai)
  const currentDate = new Date();

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0, // Homepage sabse important
    },
    {
      url: `${baseUrl}/chat`,
      lastModified: currentDate,
      changeFrequency: 'always', // Chat page hamesha update hota rehta hai
      priority: 0.9,
    },
    {
      url: `${baseUrl}/matching`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kundli`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/daily`,
      lastModified: currentDate,
      changeFrequency: 'daily', // Daily horoscope roz update hota hai
      priority: 0.8,
    },
    {
      url: `${baseUrl}/palmistry`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/face-reading`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/panchang`,
      lastModified: currentDate,
      changeFrequency: 'daily', // Panchang roz badalta hai
      priority: 0.7,
    },
  ];
}