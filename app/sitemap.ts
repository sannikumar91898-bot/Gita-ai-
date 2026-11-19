// app/sitemap.ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://gitatalk.in"; 
  const currentDate = new Date();

  // ✅ 10 Languages (Hinglish nahi hai, kyunki Google usko duplicate maanta hai)
  const languages = ['en', 'hi', 'te', 'ta', 'kn', 'bn', 'mr', 'gu', 'ml', 'pa'];

  // ✅ Main Tools jo aapki site par hain
  const tools = [
    { path: 'kundli', freq: 'weekly' as const, priority: 0.9 },
    { path: 'matching', freq: 'weekly' as const, priority: 0.9 },
    { path: 'palmistry', freq: 'monthly' as const, priority: 0.8 },
    { path: 'face-reading', freq: 'monthly' as const, priority: 0.8 },
    { path: 'panchang', freq: 'daily' as const, priority: 0.8 },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [
    // 1. Base Homepage
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  // 2. 10 Languages ke liye Tools aur Homepages automatically generate honge
  languages.forEach((lang) => {
    // Har language ka homepage (jaise: gitatalk.in/hi, gitatalk.in/ta)
    sitemapEntries.push({
      url: `${baseUrl}/${lang}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    });

    // Har language ke tools (jaise: gitatalk.in/hi/kundli, gitatalk.in/ta/kundli)
    tools.forEach((tool) => {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}/${tool.path}`,
        lastModified: currentDate,
        changeFrequency: tool.freq,
        priority: tool.priority,
      });
    });
  });

  // 3. Global English Tools (Root level, SEO boost ke liye)
  tools.forEach((tool) => {
    sitemapEntries.push({
      url: `${baseUrl}/${tool.path}`,
      lastModified: currentDate,
      changeFrequency: tool.freq,
      priority: 0.9, 
    });
  });

  // 4. Chat Page (Main feature hai toh high priority)
  sitemapEntries.push({
    url: `${baseUrl}/chat`,
    lastModified: currentDate,
    changeFrequency: 'always',
    priority: 0.9,
  });

  // 5. Legal Pages (Trust & E-E-A-T ke liye zaroori)
  sitemapEntries.push(
    { url: `${baseUrl}/privacy-policy`, lastModified: currentDate, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: currentDate, changeFrequency: 'yearly', priority: 0.3 }
  );

  // ❌ /daily ko jaan-boojh kar nahi dala gaya hai, kyunki audit ke hisaab se wo duplicate hai.

  return sitemapEntries;
}