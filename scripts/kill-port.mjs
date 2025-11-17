// scripts/kill-port.mjs
// por quê: matar listeners antes de iniciar reduz flakiness em Codespaces
import { execSync } from "node:child_process";

const port = Number(process.env.PORT || 3020);

function tryExec(cmd) {
  try {
    execSync(cmd, { stdio: "ignore", shell: true });
    return true;
  } catch {
    return false;
  }
}

function portBusy(p) {
  try {
    execSync(
      `ss -ltn 'sport = :${p}' | awk 'NR>1{f=1} END{exit (f?0:1)}'`,
      { stdio: "ignore", shell: true }
    );
    return true;
  } catch {
    return false;
  }
}

let attempts = 0;
while (portBusy(port) && attempts < 3) {
  attempts += 1;
  // tenta fuser (rápido), depois lsof (cobre ambientes sem fuser)
  if (!tryExec(`fuser -k -n tcp ${port}`)) {
    tryExec(
      `PIDS=$(lsof -t -iTCP:${port} -sTCP:LISTEN 2>/dev/null || true); [ -n "$PIDS" ] && kill -9 $PIDS || true`
    );
  }
}

if (portBusy(port)) {
  console.warn(
    `[predev] Porta ${port} ainda ocupada após ${attempts} tentativa(s). Faremos fallback automaticamente.`
  );
} else {
  console.log(`[predev] Porta ${port} liberada.`);
}
