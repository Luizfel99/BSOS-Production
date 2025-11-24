// src/app/api/_security-middleware.ts
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import pino from 'pino';
import pinoPretty from 'pino-pretty';
import xssClean from 'xss-clean';
import type { NextApiRequest, NextApiResponse } from 'next';

const logger = pino(pinoPretty());

// Rate Limiting: 100 requests per 15 min per IP
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Helmet: Secure HTTP headers
export const apiHelmet = helmet();

// XSS Clean: Sanitizes user input
export const apiSanitizer = xssClean();

// Pino logger middleware
export function apiLogger(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  logger.info({
    method: req.method,
    url: req.url,
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    body: req.body,
  });
  next();
}

// Token Regeneration Example (to be used in auth routes)
export function regenerateToken(oldToken: string): string {
  // Implement your JWT/session token regeneration logic here
  // Example: return jwt.sign({ ...payload }, secret, { expiresIn: '1h' });
  return oldToken + '_regenerated'; // Placeholder
}
