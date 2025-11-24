#!/usr/bin/env node
import { execSync } from 'node:child_process';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('❌ DATABASE_URL not set. Aborting.');
  process.exit(1);
}

try {
  console.log('🚀 Deploying Prisma migrations to Neon…');
  execSync('npm run db:migrate:deploy', { stdio: 'inherit', env: process.env });
  console.log('✅ Migrations deployed.');
} catch (e) {
  console.error('❌ migrate deploy failed.');
  process.exit(1);
}
