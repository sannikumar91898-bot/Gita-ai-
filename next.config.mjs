/** @type {import('next').NextConfig} */
const nextConfig = {
  /* 1. इमेज होस्टिंग सेटिंग्स (यदि आप बाहरी अवतार या अनस्प्लैश इमेजेस यूज़ कर रहे हैं) */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '://unsplash.com',
      },
    ],
  },

  /* 2. Drizzle ORM और pg (PostgreSQL) को सर्वर-साइड पर सुचारू रूप से चलाने के लिए */
  serverExternalPackages: ['drizzle-orm', 'pg'],

  /* 3. प्रोडक्शन बिल्ड के समय कड़क चेकिंग और ऑप्टिमाइज़ेशन */
  typescript: {
    // अगर आप चाहते हैं कि छोटे-मोटे वार्निंग्स बिल्ड न रोकें, तो इसे true रख सकते हैं
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
