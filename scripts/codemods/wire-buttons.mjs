#!/usr/bin/env node
/**
 * Codemod: troca <button> e <a href="/..."> internos por <WiredButton />
 * - Preserva props/children
 * - Adiciona import default de "@/components/ui/WiredButton" se faltar
 * - Não altera <a href="http(s)://..."> (externo)
 * - Idempotente
 */
import fs from "node:fs";
import path from "node:path";
import { glob } from "glob";
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";

const ROOT = process.cwd();
const FILES = glob.sync("src/**/*.{tsx,jsx}", {
  nodir: true,
  ignore: [
    "**/node_modules/**",
    "**/.next/**",
    "**/backups*/**",
    "**/.history/**",
    "**/*.backup.*",
    "**/*.backup2.*",
    "**/*.bak*",
  ],
});

const WIRED_IMPORT = "@/components/ui/WiredButton";
const WIRED_NAME = "WiredButton";

let changed = 0;

for (const file of FILES) {
  const src = fs.readFileSync(file, "utf8");
  let ast;
  try {
    ast = parser.parse(src, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });
  } catch (e) {
    // skip unparseable file
    continue;
  }

  let hasImport = false;
  let mutated = false;

  traverse.default(ast, {
    ImportDeclaration(p) {
      const d = p.node;
      if (d.source.value === WIRED_IMPORT) {
        // default import present?
        const hasDefault = d.specifiers.some((s) => t.isImportDefaultSpecifier(s));
        if (hasDefault) hasImport = true;
      }
    },
  });

  function ensureImport(pathProgram) {
    if (hasImport) return;
    const imp = t.importDeclaration(
      [t.importDefaultSpecifier(t.identifier(WIRED_NAME))],
      t.stringLiteral(WIRED_IMPORT)
    );
    pathProgram.node.body.unshift(imp);
    hasImport = true;
    mutated = true;
  }

  function transformAttributes(attrs) {
    // Preserve all attrs. If <a href="/..."> => keep href.
    // If <button>, keep onClick if present, else data-action marker.
    // Append data-action if none exists (for GlobalActionBus to wire).
    const names = new Set(
      attrs
        .map((a) => (t.isJSXAttribute(a) && t.isJSXIdentifier(a.name) ? a.name.name : null))
        .filter(Boolean)
    );

    if (!names.has("onClick") && !names.has("href")) {
      attrs.push(
        t.jsxAttribute(t.jsxIdentifier("data-action"), t.stringLiteral("wire.auto"))
      );
    }
    return attrs;
  }

  traverse.default(ast, {
    Program(pathProgram) {
      pathProgram.traverse({
        JSXElement(p) {
          const el = p.node.openingElement;
          if (!t.isJSXIdentifier(el.name)) return;
          const tag = el.name.name;

          // <button ...> -> <WiredButton ...>
          if (tag === "button") {
            ensureImport(pathProgram);
            el.name = t.jsxIdentifier(WIRED_NAME);
            el.attributes = transformAttributes(el.attributes);
            if (p.node.closingElement && t.isJSXIdentifier(p.node.closingElement.name)) {
              p.node.closingElement.name = t.jsxIdentifier(WIRED_NAME);
            }
            mutated = true;
            return;
          }

          // <a href="/..."> -> <WiredButton href="/...">
          if (tag === "a") {
            const hrefAttr = el.attributes.find(
              (a) =>
                t.isJSXAttribute(a) &&
                t.isJSXIdentifier(a.name) &&
                a.name.name === "href"
            );
            if (
              hrefAttr &&
              t.isJSXAttribute(hrefAttr) &&
              hrefAttr.value &&
              t.isStringLiteral(hrefAttr.value)
            ) {
              const href = hrefAttr.value.value;
              // Internal link only
              if (href.startsWith("/")) {
                ensureImport(pathProgram);
                el.name = t.jsxIdentifier(WIRED_NAME);
                el.attributes = transformAttributes(el.attributes);
                if (p.node.closingElement && t.isJSXIdentifier(p.node.closingElement.name)) {
                  p.node.closingElement.name = t.jsxIdentifier(WIRED_NAME);
                }
                mutated = true;
                return;
              }
            }
          }
        },
      });
    },
  });

  if (mutated) {
    const out = generate.default(ast, { retainLines: true }, src).code;
    fs.writeFileSync(file, out, "utf8");
    changed += 1;
  }
}

console.log(`✅ wire-buttons codemod finished. Files changed: ${changed}`);
