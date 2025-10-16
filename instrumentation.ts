import { initSentry } from './src/lib/sentry';

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    initSentry();
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    initSentry();
  }
}