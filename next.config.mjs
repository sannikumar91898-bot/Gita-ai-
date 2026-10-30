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

  // Drizzle और Postgres को प्रोडक्शन में सुरक्षित रखने के लिए
  serverExternalPackages: ["drizzle-orm", "pg"],

  typescript: {
    ignoreBuildErrors: false,
  },

  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
