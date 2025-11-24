// ============================================================================
// FILE: src/app/api/dev/seed/route.ts
// DESC: POST /api/dev/seed?full=1  → runs prisma/seed.mjs inside the server
// ============================================================================
import { NextResponse } from "next/server";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";

export async function POST(req: Request) {
  const url = new URL(req.url);
  const full = url.searchParams.get("full") === "1";
  const cwd = process.cwd();
  const file = path.join(cwd, "prisma", "seed.mjs");

  return new Promise((resolve) => {
    const env = { ...process.env, FULL_SEED: full ? "1" : "0" };
    const child = spawn("node", [file], { cwd, env, shell: true });

    let out = "";
    let err = "";
    child.stdout.on("data", (d) => (out += d.toString()));
    child.stderr.on("data", (d) => (err += d.toString()));
    child.on("close", (code) => {
      if (code === 0) {
        resolve(NextResponse.json({ ok: true, out }));
      } else {
        resolve(NextResponse.json({ ok: false, out, err }, { status: 500 }));
      }
    });
  });
}
