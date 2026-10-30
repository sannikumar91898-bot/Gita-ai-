/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "://unsplash.com",
      },
    ],
  },

  // ✅ Next.js 14 के अनुसार डायरेक्ट रूट लेवल पर सही कॉन्फ़िगरेशन
  serverExternalPackages: ["drizzle-orm", "pg"],

  typescript: {
    ignoreBuildErrors: false,
  },

  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
