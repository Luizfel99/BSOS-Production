#!/usr/bin/env node
import detect from "detect-port";
import { spawn } from "node:child_process";

const desired = Number(process.env.PORT || 3020);
const useTurbo = process.argv.includes("--turbo");
const port = await detect(desired);

console.log(port !== desired
  ? `[dev] Porta ${desired} ocupada; iniciando em ${port}.`
  : `[dev] Iniciando Next em ${port}${useTurbo ? " (Turbopack)" : ""}…`);

const args = ["dev", "-p", String(port)];
if (useTurbo) args.push("--turbo");

const child = spawn("next", args, { stdio: "inherit", shell: true });
child.on("exit", (code) => process.exit(code ?? 0));
