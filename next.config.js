/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false,
  experimental: {
    forceSwcTransforms: true,
  },
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/backup/**',
        '**/backups/**',
        '**/*.backup.*',
        '**/*.backup2.*',
        '**/*.bak',
        '**/backup_*/**',
      ],
    };
    return config;
  },
};

module.exports = nextConfig;
