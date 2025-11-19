#!/usr/bin/env node
import { execSync } from 'node:child_process';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('❌ DATABASE_URL not set. Skipping seed.');
  process.exit(0);
}

try {
  console.log('🌱 Seeding production (idempotent)…');
  execSync('npm run db:seed:prod', { stdio: 'inherit', env: process.env });
  console.log('✅ Seed completed.');
} catch (e) {
  console.error('❌ Seed failed (continuing).');
  process.exit(0);
}
