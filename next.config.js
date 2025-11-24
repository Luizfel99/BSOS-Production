const { withSentryConfig } = require('@sentry/nextjs');

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

// Wrap with Sentry for source map upload in production builds when SENTRY_* envs are present
const sentryWebpackPluginOptions = {
  // These can also be supplied via env: SENTRY_AUTH_TOKEN, SENTRY_ORG, SENTRY_PROJECT
  silent: true,
  // Reduce bundle size by not including debug logs
  disableLogger: true,
};

const sentryNextOptions = {
  // Hide uploaded source maps from public access
  hideSourcemaps: true,
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions, sentryNextOptions);
