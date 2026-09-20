import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma 7 reads its connection settings from this file, not from schema.prisma.
// The placeholder lets `prisma generate` run on machines that do not have
// DATABASE_URL yet (for example during `npm install`); `migrate`/`seed` need
// the real value.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "postgresql://placeholder:placeholder@localhost:5432/placeholder",
  },
});
