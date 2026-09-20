# Luxura Tech USA LLC — Website & CMS

Next.js 15 (App Router, TypeScript) · Tailwind 4 + shadcn-style UI · Prisma 7 + PostgreSQL (Neon) · Auth.js v5 · React Hook Form + Zod · Resend · Lucide.
One monolithic app: public site + private admin dashboard + lead management. No Docker, Redis or extra services.

## 1. Run locally
```bash
cp .env.example .env        # fill in DATABASE_URL (Neon pooled), AUTH_SECRET, AUTH_URL, ADMIN_EMAIL
npm install
npx prisma db push          # or prisma migrate dev
npm run db:seed
npm run dev
```
Open http://localhost:3000 and /admin/login

## 2. Deploy (Vercel + Neon recommended)

1. This repo is ready for Vercel.
2. Import in Vercel → Environment Variables:
   - `DATABASE_URL` = Neon **pooled** connection string (the one ending in -pooler)
   - `AUTH_SECRET` = generate with `openssl rand -base64 32`
   - `AUTH_URL` = https://your-project.vercel.app  (update after first deploy if needed)
   - `ADMIN_EMAIL` = your email
   - `ADMIN_INITIAL_PASSWORD` = strong password (optional; otherwise random is printed on seed)
   - `RESEND_API_KEY` (optional)
3. Build Command: `prisma generate && prisma migrate deploy && next build` (already set in package.json)
4. After first successful deploy, seed the database once (Vercel → Deployments → ... or local with the same DATABASE_URL):
   ```bash
   npx prisma db seed
   ```
5. Login at /admin/login with the ADMIN_EMAIL and the password from seed.

See original README for more details on admin features, security, and pre-launch checks.

**Note:** Images from the original project should be placed in `public/images/`. The conversion from MySQL to PostgreSQL is complete in this branch.
