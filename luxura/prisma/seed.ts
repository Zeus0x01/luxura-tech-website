import "dotenv/config";
import { randomInt } from "node:crypto";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { categories, homepage, industries, sampleArticles, services, settings } from "./seed-data";

/**
 * Idempotent seed. Safe to run on every deploy: it only CREATES missing rows
 * and never overwrites content that has been edited in the admin dashboard.
 */

function makeClient() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  return new PrismaClient();
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
  if (await prisma.user.findUnique({ where: { email } })) {
    console.log(`= Admin user ${email} already exists (password left unchanged).`);
    return;
  }

  let password = process.env.ADMIN_INITIAL_PASSWORD;
  let generated = false;
  if (password && !strongEnough(password)) {
    throw new Error("ADMIN_INITIAL_PASSWORD must be at least 12 characters with upper-case, lower-case and a number.");
  }
  if (!password) {
    password = generatePassword();
    generated = true;
  }

  await prisma.user.create({
    data: { email, name: "Administrator", passwordHash: await bcrypt.hash(password, 12), role: "ADMIN" },
  });
  console.log(`+ Created admin user ${email}`);
  if (generated) {
    console.log("\n  ┌──────────────────────────────────────────────────────────┐");
    console.log(`  │ Generated admin password (shown ONCE): ${password}`);
    console.log("  │ Sign in at /admin/login, then store it in a password manager.");
    console.log("  └──────────────────────────────────────────────────────────┘\n");
  }
}

async function main() {
  await seedAdmin();

  // Site settings
  await prisma.siteSetting.upsert({ where: { id: "default" }, create: { id: "default", ...settings }, update: {} });

  // Industries
  for (const [i, ind] of industries.entries()) {
    await prisma.industry.upsert({
      where: { slug: ind.slug },
      create: { ...ind, status: "PUBLISHED", featured: true, displayOrder: i + 1, seoTitle: ind.name },
      update: {},
    });
  }

  // Services (+ links to industries)
  const industryIds = new Map((await prisma.industry.findMany({ select: { id: true, slug: true } })).map((r) => [r.slug, r.id]));
  for (const [i, s] of services.entries()) {
    const { industries: related, capabilities, ...rest } = s;
    const existing = await prisma.service.findUnique({ where: { slug: s.slug }, select: { id: true } });
    if (existing) continue;
    await prisma.service.create({
      data: {
        ...rest,
        capabilities: capabilities.join("\n"),
        status: "PUBLISHED",
        featured: true,
        displayOrder: i + 1,
        industries: {
          create: related.filter((slug) => industryIds.has(slug)).map((slug) => ({ industryId: industryIds.get(slug)! })),
        },
      },
    });
  }

  // Homepage sections
  for (const [key, value] of Object.entries(homepage)) {
    const { items, ...fields } = value as { items?: readonly { title: string; body: string }[] } & Record<string, unknown>;
    const existing = await prisma.homepageSection.findUnique({ where: { key: key as never }, select: { id: true } });
    if (existing) continue;
    await prisma.homepageSection.create({
      data: {
        key: key as never,
        ...(fields as object),
        ...(items ? { items: { create: items.map((it, i) => ({ title: it.title, body: it.body, displayOrder: i + 1 })) } } : {}),
      },
    });
  }

  // Article categories
  for (const c of categories) {
    await prisma.articleCategory.upsert({ where: { slug: c.slug }, create: { ...c }, update: {} });
  }

  // Sample articles (drafts unless SEED_PUBLISH_SAMPLES=true)
  const publish = process.env.SEED_PUBLISH_SAMPLES === "true";
  const categoryIds = new Map((await prisma.articleCategory.findMany()).map((c) => [c.slug, c.id]));
  for (const a of sampleArticles) {
    if (await prisma.article.findUnique({ where: { slug: a.slug }, select: { id: true } })) continue;
    const { category, ...rest } = a;
    await prisma.article.create({
      data: {
        ...rest,
        author: "Luxura Tech Team",
        categoryId: categoryIds.get(category) ?? null,
        status: publish ? "PUBLISHED" : "DRAFT",
        publishedAt: publish ? new Date() : null,
        seoTitle: a.title,
      },
    });
  }

  console.log("✓ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
