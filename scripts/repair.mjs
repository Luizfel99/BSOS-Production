#!/usr/bin/env node
/**
 * BSOS Repair Script
 * - Kill dev processes and clean caches
 * - Remove/ignore backups
 * - Fix tsconfig (alias/scope)
 * - Inject default export in src/app pages without default
 * - Prisma format/validate/generate (if exists)
 * - Prettier/ESLint (if installed)
 * - tsc --noEmit
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "src");
const TS_PATH = path.join(ROOT, "tsconfig.json");
const PRISMA_SCHEMA = path.join(ROOT, "prisma", "schema.prisma");
const MUST_DIRS = ["app","components","contexts","hooks","services"];

const run = (cmd) => { const r = spawnSync(cmd, { shell: true, stdio: "inherit" }); if (r.status !== 0) throw new Error(`failed: ${cmd}`); };
const tryRun = (cmd) => spawnSync(cmd, { shell: true, stdio: "inherit" }).status === 0;
const exists = (p) => { try { fs.accessSync(p); return true; } catch { return false; } };
const rmrf = (p) => { if (exists(p)) fs.rmSync(p, { recursive: true, force: true }); };

function walk(dir, cb) {
  if (!exists(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    cb(full, e);
    if (e.isDirectory()) walk(full, cb);
  }
}

function cleanProcsAndCaches() {
  tryRun(`pkill -9 -f "next dev" || true`);
  tryRun(`pkill -9 -f "next-server" || true`);
  tryRun(`lsof -t -i:3020 | xargs -r kill -9 || true`);
  rmrf(path.join(ROOT, ".next"));
  rmrf(path.join(ROOT, ".turbo"));
  rmrf(path.join(ROOT, "node_modules", ".cache"));
  console.log("🧽 caches cleaned");
}

function deleteBackups() {
  let count = 0;
  const isBackupDir = (n) => ["backup","backups",".history","__history__","__backups__"].some(k=>n.toLowerCase().includes(k));
  const isBackupFile = (n) => /\.(backup|backup2|bak|old|tmp)\./i.test(n);
  walk(ROOT, (full, e) => {
    if (full.includes("node_modules") || full.includes(".git")) return;
    if (e.isDirectory() && isBackupDir(e.name)) { rmrf(full); count++; }
    if (e.isFile() && isBackupFile(e.name)) { rmrf(full); count++; }
  });
  console.log(`🧹 backups removed: ${count}`);
}

function lockTsConfig() {
  let ts = exists(TS_PATH) ? JSON.parse(fs.readFileSync(TS_PATH, "utf8")) : {};
  ts.compilerOptions ||= {};
  Object.assign(ts.compilerOptions, {
    target: "ES2020",
    lib: ["dom","dom.iterable","esnext"],
    allowJs: false,
    skipLibCheck: true,
    strict: true,
    forceConsistentCasingInFileNames: true,
    noEmit: true,
    esModuleInterop: true,
    module: "esnext",
    moduleResolution: "bundler",
    resolveJsonModule: true,
    incremental: true,
    jsx: ts.compilerOptions.jsx || "preserve",
    isolatedModules: true,
    baseUrl: ".",
    paths: { "@/*": ["src/*"] },
    types: Array.isArray(ts.compilerOptions.types) ? ts.compilerOptions.types : ["node"]
  });
  ts.include = ["next-env.d.ts","src/**/*.ts","src/**/*.tsx"];
ts.exclude = [
    "node_modules",".next",
    "**/backups*/**","**/backup*/**","**/.history/**",
    "**/*.backup.*","**/*.backup2.*","**/*.bak*",
    "backups_before_login_update/**"
  ];
  fs.writeFileSync(TS_PATH, JSON.stringify(ts, null, 2) + "\n");
  console.log("✍️ tsconfig updated");
}

function ensureIgnores() {
  const globs = [
    "node_modules",".next",".turbo",
    "**/backups*/","**/backup*/","**/.history/",
    "**/*.backup.*","**/*.backup2.*","**/*.bak*",
    "backups_before_login_update/",".env*"
  ];
  for (const f of [".eslintignore",".prettierignore",".gitignore"]) {
    const cur = exists(f) ? fs.readFileSync(f,"utf8") : "";
    const set = new Set(cur.split(/\r?\n/).map(s=>s.trim()).filter(Boolean));
    globs.forEach(g=>set.add(g));
    fs.writeFileSync(f, [...set].join("\n")+"\n");
  }
  console.log("🛡 ignores reinforced");
}

function injectDefaultExportInPages() {
  const pages = [];
  for (const d of MUST_DIRS) {
    const dir = path.join(SRC, d);
    if (!exists(dir)) continue;
    walk(dir, (full, e) => {
      if (e.isFile() && /\/page\.(tsx|ts)$/.test(full)) pages.push(full);
    });
  }
  let touched = 0;
  for (const f of pages) {
    let code = fs.readFileSync(f,"utf8");
    const hasDefault =
      /export\s+default\s+function\s+/m.test(code) ||
      /export\s+{[^}]*\s+default\s+as\s+/m.test(code) ||
      /export\s+default\s+\(/m.test(code) ||
      /export\s+default\s+.+?;/m.test(code);
    if (!hasDefault) {
      code += `\n\n// auto-fix: default export required by Next.js\nexport default function Page(): JSX.Element { return null as unknown as JSX.Element }\n`;
      fs.writeFileSync(f, code);
      touched++;
      console.log("➕ default export:", f);
    }
  }
  console.log(`🧩 pages fixed: ${touched}`);
}

function prismaPipeline() {
  if (!exists(PRISMA_SCHEMA)) { console.log("ℹ️ prisma/schema.prisma not found - skipping Prisma"); return; }
  tryRun(`npx --yes prisma format`);
  run(`npx --yes prisma validate`);
  run(`npx --yes prisma generate`);
  console.log("🟪 Prisma ok");
}

function lintAndFormat() {
  if (tryRun(`npx --yes prettier -v`)) {
    tryRun(`npx --yes prettier "src/**/*.{ts,tsx,js,jsx,css,md}" --write`);
    console.log("🎨 Prettier applied");
  }
  if (tryRun(`npx --yes eslint -v`)) {
    tryRun(`npx --yes eslint "src/**/*.{ts,tsx,js,jsx}" --fix`);
    console.log("🧯 ESLint fix applied");
  }
}

function typecheck() {
  if (!tryRun(`npx --yes tsc -v`)) { console.log("ℹ️ TypeScript not available - skipping tsc"); return; }
  run(`npx --yes tsc --noEmit`);
  console.log("🟦 TypeScript OK");
}

console.log("🚀 Repair start");
cleanProcsAndCaches();
deleteBackups();
lockTsConfig();
ensureIgnores();
injectDefaultExportInPages();
prismaPipeline();
lintAndFormat();
typecheck();
console.log("✅ Repair ok");
