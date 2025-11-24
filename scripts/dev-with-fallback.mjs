#!/usr/bin/env node
import detect from "detect-port";
import { spawn } from "node:child_process";

const desired = Number(process.env.PORT || 3020);
const port = await detect(desired);

const args = ["dev", "-p", String(port)];
// liga Turbopack se var estiver setada
if (process.env.TURBOPACK === "1") {
  args.splice(1, 0, "--turbo");
}

const msg =
  port === desired
    ? `[dev] Starting Next on ${port}…`
    : `[dev] Port ${desired} busy; starting on ${port}. Set PORT=<n> to try a specific port.`;
console.log(msg);

const child = spawn("next", args, { stdio: "inherit", shell: true });
child.on("exit", (code) => process.exit(code ?? 0));
