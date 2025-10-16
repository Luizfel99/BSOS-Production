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
  // Sentry configuration
  sentry: {
    hideSourceMaps: false,
    widenClientFileUpload: true,
  },
  // Enable experimental features for better error reporting
  experimental: {
    instrumentationHook: true,
  },
}; 
module.exports = nextConfig;
