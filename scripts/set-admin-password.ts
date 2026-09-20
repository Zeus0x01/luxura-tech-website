import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";

/**
 * Reset an admin password from the command line:
 *   ADMIN_NEW_PASSWORD='...' npm run admin:password -- you@example.com
 */
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

  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  const prisma = new PrismaClient({ log: ["error"] });

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
