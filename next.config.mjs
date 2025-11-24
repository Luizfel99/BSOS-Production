import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

/**
 * Dev rápido e Prod estrito.
 */
const withDevTweaks = (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    reactStrictMode: true,
    // SWC minify ajuda em prod; em dev é irrelevante
    swcMinify: true,

    // Imagens otimizadas são pesadas em dev; desligamos só no dev
    images: {
      unoptimized: isDev ? true : false,
    },

    // ESLint pode atrasar startup. Rodamos via script dedicado (lint).
    eslint: {
      ignoreDuringBuilds: isDev ? true : false,
    },

    // TypeScript: não bloquear o dev-server. Em build:ci isso volta a valer.
    typescript: {
      ignoreBuildErrors: isDev ? true : false,
    },

    // Webpack cache para dev mais quente
    webpack: (config, { dev }) => {
      if (dev) {
        config.cache = {
          type: "filesystem",
          buildDependencies: {
            config: [__filename],
          },
        };
      }
      return config;
    },

    // Import map de pacotes grandes (Next 15): acelera cold-start
    experimental: {
      optimizePackageImports: [
        "lodash",
        "date-fns",
        "react-icons",
        "@tanstack/react-query",
      ],
      turbo: {
        // Turbopack ativo no dev:fast
        rules: {},
      },
    },
  };
};

export default withDevTweaks;
