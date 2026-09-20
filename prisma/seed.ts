import "dotenv/config";
import { randomInt } from "node:crypto";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

function makeClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const adapter = new PrismaPg({ connectionString: url });
  return new PrismaClient({ adapter, log: ["error"] });
}

const prisma = makeClient();

function strongEnough(p: string) {
  return p.length >= 12 && /[a-z]/.test(p) && /[A-Z]/.test(p) && /\d/.test(p);
}

function generatePassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789-_!";
  for (;;) {
    const pw = Array.from({ length: 22 }, () => chars[randomInt(chars.length)]).join("");
    if (strongEnough(pw)) return pw;
  }
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!email) {
    console.warn("! ADMIN_EMAIL is not set — skipping admin user creation.");
    return;
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user already exists: ${email}`);
    return;
  }
  let password = process.env.ADMIN_INITIAL_PASSWORD?.trim();
  if (!password || !strongEnough(password)) {
    password = generatePassword();
    console.log("\n========================================");
    console.log("ADMIN PASSWORD (save this, shown once):");
    console.log(password);
    console.log("========================================\n");
  }
  await prisma.user.create({
    data: {
      email,
      name: "Admin",
      passwordHash: await bcrypt.hash(password, 12),
      role: "ADMIN",
      isActive: true,
    },
  });
  console.log(`Created admin user: ${email}`);
}

async function main() {
  console.log("Seeding...");
  await seedAdmin();
  console.log("Seed finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
