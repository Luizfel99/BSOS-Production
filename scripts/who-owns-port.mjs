#!/usr/bin/env node
import { execSync } from "node:child_process";
const port = Number(process.env.PORT || 3020);
const s = (c)=>{ try{ return execSync(c,{stdio:"pipe",encoding:"utf8",shell:true}); }catch{ return ""; } };
console.log(`\n[who-owns-port] Porta: ${port}\n`);
console.log(">> ss:\n", s(`ss -lptn 'sport = :${port}' || true`) || "<vazio>", "\n");
console.log(">> lsof:\n", s(`lsof -iTCP:${port} -sTCP:LISTEN -nP || true`) || "<vazio>", "\n");
