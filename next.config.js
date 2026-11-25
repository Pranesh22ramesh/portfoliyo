/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_BUILD_DIR || '.next',
  images: { unoptimized:true },
  experimental: { optimizePackageImports: ['lucide-react', 'framer-motion'] },
};

module.exports = nextConfig;
