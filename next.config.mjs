/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // ✅ Next.js 14 के अनुसार परफेक्ट रूट लेवल प्लेसमेंट (नो एक्सपेरिमेंटल वार्निंग)
  serverExternalPackages: ["drizzle-orm", "pg"],

  typescript: {
    ignoreBuildErrors: false,
  },

  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
