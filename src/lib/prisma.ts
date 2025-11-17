import { PrismaClient } from "@prisma/client";

// why: reuso em dev (HMR) evita criar múltiplas conexões localmente
declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

function makePrisma(): PrismaClient {
  const useNeon =
    process.env.NEON_HTTP?.toLowerCase() === "true" ||
    process.env.VERCEL === "1";

  // Simple DSN usage (Neon requires sslmode=require no DATABASE_URL)
  if (!useNeon) {
    return new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL,
    });
  }

  // --- Neon HTTP Adapter path (Edge/Serverless friendly) ---
  // If you prefer purely DATABASE_URL without adapter, you can disable this.
  // Requires: @neondatabase/serverless and @prisma/adapter-neon
  // And your schema provider = "postgresql"
  // For Accelerate or advanced setup, adapt here.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { neon } = require("@neondatabase/serverless");
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { PrismaNeon } = require("@prisma/adapter-neon");

  const neonClient = neon(process.env.DATABASE_URL!);
  const adapter = new PrismaNeon(neonClient);

  // @ts-expect-error - adapter is valid at runtime but not in types
  return new PrismaClient({ adapter });
}

let prisma: PrismaClient;

if (process.env.NODE_ENV !== "production") {
  if (!globalThis.prismaGlobal) {
    globalThis.prismaGlobal = makePrisma();
  }
  prisma = globalThis.prismaGlobal;
} else {
  prisma = makePrisma();
}

export const db = prisma;
