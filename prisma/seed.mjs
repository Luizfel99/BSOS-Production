import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const DEMO_PWD = process.env.NEXT_PUBLIC_DEMO_PWD || "demo123";

const USERS = [
  { role: "admin",      email: "admin@demo.local",      name: "Admin User" },
  { role: "manager",    email: "manager@demo.local",    name: "Manager User" },
  { role: "supervisor", email: "supervisor@demo.local", name: "Supervisor User" },
  { role: "cleaner",    email: "cleaner@demo.local",    name: "Cleaner User" },
  { role: "client",     email: "client@demo.local",     name: "Client User" },
];

const PROPERTIES = Array.from({ length: 10 }).map((_, i) => ({
  name: `Property ${i + 1}`,
  address: `${100 + i} Market St`,
  city: "San Francisco",
  state: "CA",
  country: "US",
}));

const TEAM_POS = ["Cleaner", "Supervisor", "Manager", "QA", "Support"];

const TASK_TITLES = [
  "Deep cleaning",
  "Change linens",
  "Restock supplies",
  "Inspect property",
  "Fix minor issues",
];

async function main() {
  console.log("🌱 Seeding demo data…");
  
  // Users
  for (const u of USERS) {
    const hash = await bcrypt.hash(DEMO_PWD, 10);
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        name: u.name,
        role: u.role,
        passwordHash: hash,
      },
    });
  }
  const users = await prisma.user.findMany();
  const admin = users.find((u) => u.role === "admin");
  const cleaner = users.find((u) => u.role === "cleaner");

  // Properties
  for (const p of PROPERTIES) {
    await prisma.property.create({ data: p });
  }
  const props = await prisma.property.findMany();

  // Team members (link users with roles != client to team)
  for (const u of users.filter((x) => x.role !== "client")) {
    await prisma.teamMember.upsert({
      where: { userId: u.id },
      update: {},
      create: {
        userId: u.id,
        position: TEAM_POS[Math.floor(Math.random() * TEAM_POS.length)],
        phone: "+1 555 0100",
      },
    });
  }

  // Tasks (25)
  for (let i = 0; i < 25; i++) {
    const title = TASK_TITLES[i % TASK_TITLES.length];
    const property = props[i % props.length];
    const assignee = cleaner; // simples: atribui ao cleaner
    await prisma.task.create({
      data: {
        title: `${title} #${i + 1}`,
        description: `Auto-generated task ${i + 1}`,
        status: i % 5 === 0 ? "in_progress" : "pending",
        dueDate: new Date(Date.now() + (i + 1) * 86400000),
        propertyId: property.id,
        assigneeId: assignee?.id ?? null,
        creatorId: admin.id,
      },
    });
  }

  console.log("✅ Seed complete. Login: {role}@demo.local / " + DEMO_PWD);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
