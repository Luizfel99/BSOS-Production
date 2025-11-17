#!/usr/bin/env node
import detect from "detect-port";
import { spawn } from "node:child_process";

const desired = Number(process.env.PORT || 3020);
const port = await detect(desired);

console.log(port !== desired
  ? `[dev] Porta ${desired} ocupada; iniciando em ${port}.`
  : `[dev] Iniciando Next em ${port}…`);

const child = spawn("next", ["dev", "-p", String(port)], { stdio: "inherit", shell: true });
child.on("exit", (code) => process.exit(code ?? 0));
