// scripts/who-owns-port.mjs
// por quê: diagnóstico rápido quando algo insiste em travar a porta.
import { execSync } from "node:child_process";

const port = Number(process.env.PORT || 3020);

function safe(cmd) {
  try {
    return execSync(cmd, { stdio: "pipe", encoding: "utf8", shell: true });
  } catch {
    return "";
  }
}

const ssOut = safe(`ss -lptn 'sport = :${port}' || true`);
const lsofOut = safe(`lsof -iTCP:${port} -sTCP:LISTEN -nP || true`);

console.log(`\n[who-owns-port] Porta alvo: ${port}\n`);
if (ssOut.trim()) {
  console.log(">> ss:");
  console.log(ssOut.trim(), "\n");
} else {
  console.log(">> ss: sem listeners visíveis.\n");
}

if (lsofOut.trim()) {
  console.log(">> lsof:");
  console.log(lsofOut.trim(), "\n");
} else {
  console.log(">> lsof: sem listeners visíveis.\n");
}

console.log(
  "Dica: para matar manualmente: `lsof -t -iTCP:%PORT% -sTCP:LISTEN | xargs -r kill -9`.\n"
);
