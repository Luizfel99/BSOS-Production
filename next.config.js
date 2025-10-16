/** @type {import('next').NextConfig} */ 
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enable source maps for better error tracking
  productionBrowserSourceMaps: true,
}; 
module.exports = nextConfig;
