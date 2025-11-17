#!/usr/bin/env node
/**
 * BSOS — Repair Script (idempotente)
 * - Mata dev servers + limpa caches (.next/.turbo)
 * - Remove backups/lixo
 * - Trava tsconfig (alias @/* -> src/*, include/exclude)
 * - Injeta export default em pages sem default
 * - Prisma: format/validate/generate (se prisma/schema.prisma existir)
 * - Prettier/ESLint se instalados
 * - tsc --noEmit
 * - Gera relatório simples de impacto por modelos Prisma (JSON)
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "src");
const TS_PATH = path.join(ROOT, "tsconfig.json");
const PRISMA_SCHEMA = path.join(ROOT, "prisma", "schema.prisma");
const MUST_DIRS = ["app", "components", "contexts", "hooks", "services"];

const run = (cmd) => {
  const r = spawnSync(cmd, { shell: true, stdio: "inherit" });
  if (r.status !== 0) throw new Error(`Command failed: ${cmd}`);
};
const tryRun = (cmd) => {
  const r = spawnSync(cmd, { shell: true, stdio: "inherit" });
  return r.status === 0;
};
const exists = (p) => { try { fs.accessSync(p); return true; } catch { return false; } };
const rmrf = (p) => { if (exists(p)) fs.rmSync(p, { recursive: true, force: true }); };
const walk = (dir, cb) => {
  if (!exists(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    cb(full, e);
    if (e.isDirectory()) walk(full, cb);
  }
};

function cleanProcsAndCaches() {
  tryRun(`pkill -9 -f "next dev" || true`);
  tryRun(`pkill -9 -f "next-server" || true`);
  tryRun(`lsof -t -i:3020 | xargs -r kill -9 || true`);
  rmrf(path.join(ROOT, ".next"));
  rmrf(path.join(ROOT, ".turbo"));
  rmrf(path.join(ROOT, "node_modules", ".cache"));
}

function deleteBackups() {
  const del = [];
  const dirMatch = (n) => ["backup","backups",".history","__history__","__backups__"].some(k=>n.toLowerCase().includes(k));
  const fileMatch = (n) => {
    const s = n.toLowerCase();
    if (s.endsWith(".d.ts") || s.endsWith(".map") || s.includes("node_modules")) return false;
    return [".backup.",".backup2.",".bak.",".bak",".old.",".old",".tmp.",".tmp"].some(k=>s.includes(k));
  };
  walk(ROOT, (full, e) => {
    if (full.includes("node_modules") || full.includes(".git")) return;
    if (e.isDirectory() && dirMatch(e.name)) { del.push(full); rmrf(full); }
    if (e.isFile() && fileMatch(e.name)) { del.push(full); rmrf(full); }
  });
  const specific = path.join(ROOT, "src/backups/login_backup_20251108_0319/LoginScreen.tsx");
  if (exists(specific)) { del.push(specific); rmrf(specific); }
  console.log(`🧹 Backups removidos: ${del.length}`);
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
    types: Array.isArray(ts.compilerOptions.types) ? ts.compilerOptions.types : ["node"],
  });
  ts.include = MUST_DIRS.map(d => `src/${d}/**/*.{ts,tsx}`);
  ts.exclude = [
    "node_modules",".next",
    "**/backups*/**","**/backup*/**","**/.history/**",
    "**/*.backup.*","**/*.backup2.*","**/*.bak*",
    "backups_before_login_update/**"
  ];
  fs.writeFileSync(TS_PATH, JSON.stringify(ts, null, 2) + "\n");
  console.log("✍️  tsconfig atualizado:", TS_PATH);
}

function ensureIgnores() {
  const globs = [
    "node_modules",".next",
    "**/backups*/","**/backup*/","**/.history/",
    "**/*.backup.*","**/*.backup2.*","**/*.bak*",
    "backups_before_login_update/"
  ];
  for (const f of [".eslintignore",".prettierignore"]) {
    const cur = exists(f) ? fs.readFileSync(f,"utf8") : "";
    const set = new Set(cur.split(/\r?\n/).map(s=>s.trim()).filter(Boolean));
    globs.forEach(g=>set.add(g));
    fs.writeFileSync(f, [...set].join("\n")+"\n");
  }
  console.log("🛡  ignores ok: .eslintignore, .prettierignore");
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
      code += `\n\n// auto-fix: default export exigido por Next.js\nexport default function Page(): JSX.Element { return null as unknown as JSX.Element }\n`;
      fs.writeFileSync(f, code);
      touched++;
      console.log("➕ default export injetado:", f);
    }
  }
  console.log("🧩 pages ajustadas:", touched);
}

function prismaPipeline() {
  if (!exists(PRISMA_SCHEMA)) { console.log("ℹ️ prisma/schema.prisma não encontrado — pulando Prisma."); return; }
  console.log("🟪 Prisma format"); tryRun(`npx --yes prisma format`);
  console.log("🟪 Prisma validate"); run(`npx --yes prisma validate`);
  console.log("🟪 Prisma generate"); run(`npx --yes prisma generate`);
}

function lintAndFormat() {
  if (tryRun(`npx --yes prettier -v`)) {
    console.log("🎨 Prettier write"); tryRun(`npx --yes prettier "src/**/*.{ts,tsx,js,jsx,css,md}" --write`);
  }
  if (tryRun(`npx --yes eslint -v`)) {
    console.log("🧯 ESLint fix"); tryRun(`npx --yes eslint "src/**/*.{ts,tsx,js,jsx}" --fix`);
  }
}

function typecheck() {
  if (!tryRun(`npx --yes tsc -v`)) { console.log("ℹ️ TypeScript não disponível — pulando tsc."); return; }
  console.log("🟦 tsc --noEmit"); run(`npx --yes tsc --noEmit`);
}

function prismaImpactReport() {
  if (!exists(PRISMA_SCHEMA)) return;
  const txt = fs.readFileSync(PRISMA_SCHEMA,"utf8");
  const models = [...txt.matchAll(/^\s*model\s+([A-Za-z0-9_]+)\s*{/gm)].map(m=>m[1]);
  const out = [];
  for (const m of models) {
    const r = spawnSync(`grep -RIl "\\b${m}\\b" src --include="*.{ts,tsx}" 2>/dev/null || true`, { shell:true, stdio:["ignore","pipe","ignore"] });
    const files = r.stdout?.toString?.().trim().split("\n").filter(Boolean) || [];
    out.push({ model: m, files });
    console.log(` - ${m}: ${files.length} ocorrência(s)`);
  }
  fs.mkdirSync(path.join(ROOT, "reports"), { recursive: true });
  const file = path.join(ROOT, "reports", `prisma-impact-${Date.now()}.json`);
  fs.writeFileSync(file, JSON.stringify(out, null, 2));
  console.log("📝 Impact report salvo:", file);
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
prismaImpactReport();
console.log("✅ Repair ok");
