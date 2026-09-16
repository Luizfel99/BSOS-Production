# BSOS Audit & Stabilization — 2026-09-16

## Executive summary

The current `main` branch contains several production-blocking inconsistencies. This stabilization branch intentionally applies only changes that are safe without direct database introspection.

## Critical findings

### 1. Secrets committed to the public repository

Tracked environment files contained database credentials, JWT/encryption/webhook secrets and Stripe test secrets. Root environment files were removed from this branch and `.gitignore` was hardened.

Required follow-up outside the repository:

- Rotate the Neon/PostgreSQL password / connection string.
- Rotate `JWT_SECRET` / `NEXTAUTH_SECRET`.
- Rotate `WEBHOOK_SECRET`.
- Rotate `ENCRYPTION_KEY` if it has been used to encrypt persisted data; coordinate this with any encrypted records.
- Rotate the exposed Stripe secret/test keys and recreate webhook secrets if used.
- Review any historical `.env*` files under `.history`; deleting files from the current tree does not remove secrets from Git history.

### 2. Prisma schema is not aligned with active application code

The current `prisma/schema.prisma` only defines `User`, while active API routes reference `Task`, `Property`, `TaskNote`, `Photo`, `Checklist`, `TeamMember`, and other models.

This is a production blocker because `prisma generate` from the current schema cannot produce a client compatible with these routes.

Do not blindly replace the schema until the live database is inspected. The repository contains older, substantially more complete schema snapshots under `.history/prisma/`, but they must be reconciled against the actual database before restoring a canonical schema.

Recommended recovery procedure:

1. Create a database backup/snapshot.
2. Run `prisma db pull` against a safe copy or staging database to introspect the real schema.
3. Compare the introspected schema with the latest complete historical schema and active API usage.
4. Restore a single canonical `prisma/schema.prisma`.
5. Run `prisma validate`, `prisma generate`, `npm run type-check`, then `npm run build`.
6. Only after those pass, create controlled migrations for intended schema changes.

### 3. Authentication could leak `passwordHash`

The login route selected `passwordHash` but attempted to remove a field named `password` before returning the user object. The stabilization branch now explicitly strips `passwordHash`.

The route also used a hard-coded JWT fallback secret. The stabilization branch now requires `JWT_SECRET` or `NEXTAUTH_SECRET` to be configured.

Authentication failures were normalized to avoid revealing whether a particular email exists.

## Changes made in this branch

- Hardened `.gitignore` to exclude all `.env.*` files except `.env.example`.
- Added `.history/`, `.vercel/`, `.vscode/` and common test/build artifacts to ignore rules.
- Removed tracked `.env.production`.
- Removed tracked `.env.local.backup`.
- Removed tracked `.env.local.new`.
- Fixed login response so `passwordHash` is never returned.
- Removed insecure hard-coded JWT fallback.
- Normalized login email and authentication failure messages.

## Items intentionally NOT changed yet

- `prisma/schema.prisma`: unsafe to reconstruct without confirming the live DB structure.
- Migrations: no migration should run until schema reconciliation is complete.
- Active database credentials: credential rotation must occur in Neon/Vercel/Stripe, not in source control.
- `.history/` Git history purge: requires a deliberate repository-history rewrite and coordination with all clones/deployments.

## Minimum release gate before merging feature work

The next stabilization pass should not be considered complete until all of the following pass against a staging database:

```bash
npx prisma validate
npx prisma generate
npm run type-check
npm run build
npm run test:api
```

Additionally:

- Login/logout/session flows must be smoke-tested.
- Owner/Manager/Cleaner/Client access controls must be verified per route.
- CRUD smoke tests must cover properties, jobs/tasks, team members, notes, photos and checklists.
- No secrets may remain in the tracked working tree.

## Current stability assessment

Security: BLOCKED until exposed credentials are rotated.

Database/Prisma: BLOCKED until the canonical schema is reconciled with the live DB.

Authentication: critical source-level leakage fixed on this branch; end-to-end validation remains pending the Prisma repair.

Feature development: PAUSE until the two blockers above are resolved.
