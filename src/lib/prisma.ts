import { PrismaClient } from "@prisma/client";

// why: Vercel/Edge → usar HTTP driver do Neon para máxima compatibilidade serverless.
let prisma: PrismaClient;

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

// decide driver pela env (Edge/Serverless vs Node dev)
const useNeon = !!process.env.NEON_HTTP && process.env.NEON_HTTP !== "false";

if (process.env.NODE_ENV !== "production") {
  if (!globalThis.prismaGlobal) {
    globalThis.prismaGlobal = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL,
    });
  }
  prisma = globalThis.prismaGlobal;
} else {
  prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  });
}

// optional: driver adapter Neon HTTP (quando quiser usar Accelerate/HTTP)
// Mantido simples: apenas DATABASE_URL com sslmode=require em Neon.
// Se quiser HTTP adapter: descomente abaixo e ajuste schema para provider = "postgresql".
// import { PrismaNeon } from "@prisma/adapter-neon";
// import { neon } from "@neondatabase/serverless";
// if (useNeon) {
//   const neonClient = neon(process.env.DATABASE_URL!);
//   const adapter = new PrismaNeon(neonClient);
//   prisma = new PrismaClient({ adapter });
// }

export const db = prisma;
