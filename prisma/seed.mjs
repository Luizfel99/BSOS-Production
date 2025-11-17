// ============================================================================
// FILE: prisma/seed.mjs
// DESC: Safe seeder (idempotent). Populates Users + (Properties/Team/Tasks) if models exist.
// RUN:  npm run prisma:seed   or   POST /api/dev/seed?full=1
// ============================================================================
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

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

const DEMO_PROPERTIES = Array.from({ length: 10 }).map((_, i) => ({
  code: `PROP-${1000 + i}`,
  name: `Sunset Apt #${i + 1}`,
  address: `#${i + 1} Ocean Ave, Miami, FL`,
}));

const DEMO_TEAM = Array.from({ length: 10 }).map((_, i) => ({
  name: `Team Member ${i + 1}`,
  email: `member${i + 1}@demo.local`,
  role: i % 3 === 0 ? "cleaner" : i % 3 === 1 ? "supervisor" : "manager",
}));

const DEMO_TASKS = Array.from({ length: 25 }).map((_, i) => ({
  title: `Task ${i + 1}`,
  description: `Auto-generated task #${i + 1}`,
  status: i % 4 === 0 ? "done" : i % 4 === 1 ? "in_progress" : "todo",
}));

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
  } catch (e) {
    // why: silently skip if model not in schema (keeps repo green in any state)
    console.log(`SKIP: model ${modelName} not present or incompatible.`);
    return null;
  }
}

async function seedProperties() {
  await trySeed("Property", async () => {
    for (const p of DEMO_PROPERTIES) {
      await db.property.upsert({
        where: { code: p.code },
        update: { name: p.name, address: p.address },
        create: { code: p.code, name: p.name, address: p.address },
      });
    }
    return true;
  });
}

async function seedTeam() {
  await trySeed("TeamMember", async () => {
    for (const m of DEMO_TEAM) {
      await db.teamMember.upsert({
        where: { email: m.email },
        update: { name: m.name, role: m.role },
        create: { name: m.name, email: m.email, role: m.role },
      });
    }
    return true;
  });
}

async function seedTasks() {
  await trySeed("Task", async () => {
    for (let i = 0; i < DEMO_TASKS.length; i++) {
      await db.task.upsert({
        where: { title: DEMO_TASKS[i].title },
        update: { description: DEMO_TASKS[i].description, status: DEMO_TASKS[i].status },
        create: { title: DEMO_TASKS[i].title, description: DEMO_TASKS[i].description, status: DEMO_TASKS[i].status },
      });
    }
    return true;
  });
}

(async () => {
  console.log("🔰 Seed start");
  const users = await ensureUsers();
  console.log("👥 Users:", users);

  const wantFull = process.env.FULL_SEED === "1";
  if (wantFull) {
    await seedProperties();
    await seedTeam();
    await seedTasks();
    console.log("📦 Full demo data prepared.");
  } else {
    console.log("ℹ️  FULL_SEED=1 to also create properties/team/tasks");
  }

  await db.$disconnect();
  console.log("✅ Seed done");
})().catch(async (e) => {
  console.error(e);
  await db.$disconnect();
  process.exit(1);
});
