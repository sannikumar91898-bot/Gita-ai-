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

  // ⚠️ सुधारा गया: serverExternalPackages को सही ढंग से experimental ऑब्जेक्ट के अंदर रखा गया है
  experimental: {
    serverExternalPackages: ["drizzle-orm", "pg"],
  },

  typescript: {
    ignoreBuildErrors: false,
  },

  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
