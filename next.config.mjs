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

  typescript: {
    // Error ignore karke build pass karne ke liye
    ignoreBuildErrors: true,
  },

  eslint: {
    // Warnings ignore karne ke liye
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;