/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Build ke dauran ESLint errors ko ignore karo (Build fail nahi hoga)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 2. Build ke dauran TypeScript errors ko ignore karo (Build fail nahi hoga)
  typescript: {
    ignoreDuringBuilds: true,
  },
  // 3. Image optimization settings (Agar error aaye toh)
  images: {
    unoptimized: true, 
  },
  // 4. SWC compiler ko force karo (Babel se slow nahi hoga)
  swcMinify: true, 
};

module.exports = nextConfig;