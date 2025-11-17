// ============================================================================
// FILE: prisma/seed.mjs
// DESC: Safe seeder (idempotent). Populates Users + (Properties/Team/Tasks) if models exist.
// RUN:  npm run prisma:seed   or   POST /api/dev/seed?full=1
// ============================================================================
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const CITIES = ["Miami, FL", "Orlando, FL", "Tampa, FL", "Fort Lauderdale, FL", "Jacksonville, FL"];
const STREETS = ["Ocean Ave", "Sunset Blvd", "Palm St", "Bay Rd", "Collins Ave"];

const DEMO = {
  pwd: process.env.NEXT_PUBLIC_DEMO_PWD || "demo123",
  users: [
    { name: "Admin Demo", email: process.env.NEXT_PUBLIC_DEMO_EMAIL_ADMIN || "admin@demo.local", role: "admin" },
    { name: "Manager Demo", email: process.env.NEXT_PUBLIC_DEMO_EMAIL_MANAGER || "manager@demo.local", role: "manager" },
    { name: "Supervisor Demo", email: process.env.NEXT_PUBLIC_DEMO_EMAIL_SUPERVISOR || "supervisor@demo.local", role: "supervisor" },
    { name: "Cleaner Demo", email: process.env.NEXT_PUBLIC_DEMO_EMAIL_CLEANER || "cleaner@demo.local", role: "cleaner" },
    { name: "Client Demo", email: process.env.NEXT_PUBLIC_DEMO_EMAIL_CLIENT || "client@demo.local", role: "client" },
  ],
};

function makeProperties(n = 10) {
  return Array.from({ length: n }).map((_, i) => {
    const num = rnd(100, 9999);
    const street = STREETS[rnd(0, STREETS.length - 1)];
    const city = CITIES[rnd(0, CITIES.length - 1)];
    return { code: `PR${1000 + i}`, name: `Unit ${num}`, address: `${num} ${street}, ${city}` };
  });
}
function makeTeam(n = 10) {
  return Array.from({ length: n }).map((_, i) => ({
    name: `Team Member ${i + 1}`,
    email: `member${i + 1}@demo.local`,
    role: i % 3 === 0 ? "cleaner" : i % 3 === 1 ? "supervisor" : "manager",
  }));
}
function makeTasks(n = 25) {
  return Array.from({ length: n }).map((_, i) => ({
    title: `Task ${i + 1}`,
    description: `Auto-generated task #${i + 1}`,
    status: i % 4 === 0 ? "done" : i % 4 === 1 ? "in_progress" : "todo",
  }));
}

async function ensureUsers() {
  const hash = await bcrypt.hash(DEMO.pwd, 10);
  const results = [];
  for (const u of DEMO.users) {
    const found = await db.user.findUnique({ where: { email: u.email } }).catch(() => null);
    if (!found) {
      await db.user.create({ data: { name: u.name, email: u.email, role: u.role, passwordHash: hash } });
      results.push({ email: u.email, created: true });
    } else {
      results.push({ email: u.email, created: false });
    }
  }
  return results;
}

async function trySeed(modelName, upsertFn) {
  try {
    return await upsertFn();
  } catch {
    console.log(`SKIP: model ${modelName} not present/incompatible.`);
    return null;
  }
}

(async () => {
  console.log("🔰 Seed start");
  console.log("👥 Users:", await ensureUsers());

  if (process.env.FULL_SEED !== "1") {
    console.log("ℹ️  FULL_SEED=1 for full seed.");
    await db.$disconnect();
    return;
  }

  const properties = makeProperties(10);
  const team = makeTeam(10);
  const tasks = makeTasks(25);

  await trySeed("Property", async () => {
    for (const p of properties) {
      await db.property.upsert({
        where: { code: p.code },
        update: { name: p.name, address: p.address },
        create: { code: p.code, name: p.name, address: p.address },
      });
    }
  });

  await trySeed("TeamMember", async () => {
    for (const m of team) {
      await db.teamMember.upsert({
        where: { email: m.email },
        update: { name: m.name, role: m.role },
        create: { name: m.name, email: m.email, role: m.role },
      });
    }
  });

  await trySeed("Task", async () => {
    for (const t of tasks) {
      await db.task.upsert({
        where: { title: t.title },
        update: { description: t.description, status: t.status },
        create: { title: t.title, description: t.description, status: t.status },
      });
    }
  });

  await db.$disconnect();
  console.log("✅ Seed done");
})().catch(async (e) => {
  console.error(e);
  await db.$disconnect();
  process.exit(1);
});
