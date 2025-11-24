#!/usr/bin/env node
/**
 * Remove COMPLETAMENTE qualquer banner/aviso Demo/Re-Seed da UI.
 * Idempotente. Também remove strings explícitas de demo dos .tsx/.jsx.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "src");

const DELETE_FILES = [
  path.join(SRC, "components", "DemoInfoBanner.tsx"),
  path.join(SRC, "components", "DemoBanner.tsx"),
];

const TEXT_MARKERS = [
  "Demo:",
  "Re-Seed",
  "ReSeed",
  "demo@",
  "admin@demo.local",
  "manager@demo.local",
  "supervisor@demo.local",
  "cleaner@demo.local",
  "client@demo.local",
  'data-testid="demo-info-banner"',
  "data-testid='demo-info-banner'",
];

// util: lista arquivos TS/TSX no src
function walk(dir, acc = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === ".next") continue;
      walk(full, acc);
    } else if (/\.(tsx?|jsx?|css|md|mjs|cjs)$/i.test(e.name)) {
      acc.push(full);
    }
  }
  return acc;
}

function safeUnlink(file) {
  try {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      log(`🗑️  deleted: ${path.relative(ROOT, file)}`);
    }
  } catch (e) {
    warn(`failed to delete ${file}: ${e.message}`);
  }
}

function patchLayout() {
  const layout = path.join(SRC, "app", "layout.tsx");
  if (!fs.existsSync(layout)) return;
  let s = fs.readFileSync(layout, "utf8");

  // remove import do DemoInfoBanner / DemoBanner…
  s = s.replace(/import\s+.*DemoInfoBanner.*;?\r?\n/gi, "");
  s = s.replace(/import\s+.*DemoBanner.*;?\r?\n/gi, "");

  // remove JSX <DemoInfoBanner /> ou <DemoBanner />
  s = s.replace(/<DemoInfoBanner\s*\/>\s*/gi, "");
  s = s.replace(/<DemoBanner\s*\/>\s*/gi, "");

  fs.writeFileSync(layout, s, "utf8");
  log(`✍️  patched: ${path.relative(ROOT, layout)} (imports/JSX removidos)`);
}

function stripBannerBlocks() {
  const files = walk(SRC);
  let touched = 0;

  for (const f of files) {
    let s = fs.readFileSync(f, "utf8");
    let original = s;

    // remove blocos comuns de banner com testid
    s = s.replace(
      /<div[^>]*data-testid=["']demo-info-banner["'][\s\S]*?<\/div>\s*/gi,
      ""
    );

    // remove linhas contendo marcadores explícitos (apenas UI strings)
    for (const m of TEXT_MARKERS) {
      // why: evitamos remover referências legítimas em seeds/APIs; só limpamos UI .tsx/.jsx
      if (/\.(tsx|jsx)$/i.test(f)) {
        const before = s;
        s = s
          .split("\n")
          .filter((line) => !line.includes(m))
          .join("\n");
        if (s !== before) {
          // continue checking other markers
        }
      }
    }

    if (s !== original) {
      fs.writeFileSync(f, s, "utf8");
      touched++;
      log(`✍️  stripped: ${path.relative(ROOT, f)}`);
    }
  }

  log(`🧹 strip done. files touched: ${touched}`);
}

function ensureLoginScreenNoBanner() {
  const login = path.join(SRC, "components", "LoginScreen.tsx");
  if (!fs.existsSync(login)) return;

  let s = fs.readFileSync(login, "utf8");

  // garante ausência explícita dos marcadores
  for (const m of TEXT_MARKERS) {
    s = s.replace(new RegExp(m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), "");
  }

  // garante que não existe nenhum <DemoInfoBanner /> por engano
  s = s.replace(/<DemoInfoBanner\s*\/>\s*/gi, "");
  s = s.replace(/import\s+.*DemoInfoBanner.*;?\r?\n/gi, "");

  fs.writeFileSync(login, s, "utf8");
  log(`✅ verified: ${path.relative(ROOT, login)} (no-banner)`);
}

function log(m) {
  process.stdout.write(`${m}\n`);
}
function warn(m) {
  process.stderr.write(`WARN: ${m}\n`);
}

(function main() {
  log("🚀 remove-demo-banners start");

  // 1) delete banner components (if any)
  DELETE_FILES.forEach(safeUnlink);

  // 2) patch layout imports/usages
  patchLayout();

  // 3) strip banner strings/blocks from UI files
  stripBannerBlocks();

  // 4) make sure LoginScreen has no banner residue
  ensureLoginScreenNoBanner();

  log("✅ remove-demo-banners done");
})();
