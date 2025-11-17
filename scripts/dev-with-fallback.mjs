// scripts/dev-with-fallback.mjs
// por quê: escolhe porta livre automaticamente, mas respeita PORT se possível
import detect from "detect-port";
import { spawn } from "node:child_process";

const desired = Number(process.env.PORT || 3020);
const port = await detect(desired);

if (port !== desired) {
  console.warn(
    `[dev] Porta ${desired} ocupada; iniciando no porto livre ${port}. ` +
      `Defina PORT=<n> para forçar uma porta específica.`
  );
} else {
  console.log(`[dev] Iniciando Next em ${port}…`);
}

const child = spawn("next", ["dev", "-p", String(port)], {
  stdio: "inherit",
  shell: true
});

child.on("exit", (code) => process.exit(code ?? 0));
