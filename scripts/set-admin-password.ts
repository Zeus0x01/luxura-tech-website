import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  const password = process.env.ADMIN_NEW_PASSWORD;
  if (!email || !password) {
    console.error("Usage: ADMIN_NEW_PASSWORD='<new password>' npm run admin:password -- <email>");
    process.exit(1);
  }
  if (password.length < 12 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    console.error("Password must be at least 12 characters with upper-case, lower-case and a number.");
    process.exit(1);
  }

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const adapter = new PrismaPg({ connectionString: url });
  const prisma = new PrismaClient({ adapter, log: ["error"] });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.error(`No admin user with email ${email}`);
      process.exit(1);
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await bcrypt.hash(password, 12), isActive: true },
    });
    console.log(`Password updated for ${email}`);
  } finally {
    await prisma.$disconnect();
  }
}

main();
