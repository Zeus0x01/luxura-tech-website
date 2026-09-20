# Luxura Tech USA LLC — Website & CMS

Next.js 15 (App Router, TypeScript) · Tailwind 4 + shadcn-style UI · Prisma 7 + PostgreSQL (Neon) · Auth.js v5 · React Hook Form + Zod · Resend · Lucide.
One monolithic app: public site + private admin dashboard + lead management. No Docker, Redis or extra services.

## 1. Run locally
```bash
cp .env.example .env        # fill in DATABASE_URL, AUTH_SECRET, AUTH_URL, ADMIN_EMAIL (RESEND_API_KEY optional locally)
npm install                 # also runs `prisma generate`
npm run db:deploy           # applies prisma/migrations
npm run db:seed             # services, industries, homepage, settings, categories, admin user
npm run dev                 # http://localhost:3000   (admin: /admin/login)
```
`AUTH_SECRET`: `openssl rand -base64 32`. Admin password: set `ADMIN_INITIAL_PASSWORD` before seeding, or leave it empty and the seed prints a random one **once**.
Reset later: `ADMIN_NEW_PASSWORD='...' npm run admin:password -- you@example.com`.

## 2. Deploy (Vercel + Neon recommended, or any Node host)

### Vercel + Neon (recommended for this repo)
1. Push this repo to GitHub.
2. Import the repo in Vercel → add Environment Variables:
   - `DATABASE_URL` = your Neon **pooled** connection string
   - `AUTH_SECRET` = `openssl rand -base64 32`
   - `AUTH_URL` = your Vercel URL (e.g. https://luxura-tech-website.vercel.app)
   - `ADMIN_EMAIL` = your email
   - `ADMIN_INITIAL_PASSWORD` = a strong password (optional)
   - `RESEND_API_KEY` (optional)
3. Build Command: `prisma generate && prisma migrate deploy && next build` (or use the existing `build:hostinger` script renamed)
4. After first deploy, run seed once (Vercel CLI or a one-off job): `npx prisma db seed`

### Hostinger / other
1. Push this folder to a GitHub repo (`.env` is git-ignored).
2. hPanel → Databases → create a PostgreSQL or MySQL database (this branch is Postgres/Neon) (or `127.0.0.1`) in `DATABASE_URL`; URL-encode special characters in the password.
3. hPanel → Websites → Add website → **Node.js Apps** → import the GitHub repo. Node 20 or 22.
4. Environment variables (same names as `.env.example`): `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, `RESEND_API_KEY`, `ADMIN_EMAIL` (+ optional `EMAIL_FROM`, `IMAGE_REMOTE_HOSTS`, `ALLOWED_ORIGINS`).
5. Build command: `npm run build:hostinger`  (= install → `prisma generate` → `prisma migrate deploy` → `next build`). Start command: `npm start`.
6. First deploy only, via SSH or the Hostinger terminal: `npm run db:seed` (safe to re-run: it only creates missing rows, never overwrites CMS edits).
7. **Domain last:** set `AUTH_URL` to the final `https://…` domain (no trailing slash) when you go live, then redeploy. If you serve both apex and www, list the second host in `ALLOWED_ORIGINS`. Nothing else in the code mentions a domain.
8. Email: verify your sending domain in Resend and set `EMAIL_FROM`. Without it, Resend's test sender only delivers to your own Resend account address. Leads are always saved first; the dashboard warns if a notification did not go out.

Portability: no Hostinger APIs are used. Any Node 20+ host with PostgreSQL works with the same commands.

## 3. What the owner can do in /admin
Dashboard · Leads (search, filter, sort, paginate, status, private notes, archive, delete) · Homepage (every section, featured services/industries, step lists) · Services and Industries (create, edit, delete, publish/unpublish, feature, reorder) · Insights (articles in Markdown, categories, drafts hidden) · Settings (company details, social links, default SEO). Edits go live immediately (cache tags are purged on save).

## 4. Security notes
Server-side auth in middleware **and** re-checked (against the database) in every admin page and Server Action · bcrypt (cost 12) · DB-backed rate limits on login and contact form · honeypot + minimum-fill-time · Zod validation on client and server · Markdown rendered without raw HTML · CSP/HSTS/frame/nosniff headers · public code only reads explicit `PUBLISHED` DTOs (`src/lib/data/public.ts`) · structured logs with secrets redacted.
Trade-off: the CSP allows `'unsafe-inline'` scripts because a nonce would make every page dynamic and uncacheable.

## 5. Things to check before launch
- `prisma/migrations/…_init` was written by hand (Prisma's engine download was blocked where this was built) and This branch targets PostgreSQL (Neon). Run `npx prisma migrate dev` or `prisma db push` against an empty Neon database.
- Privacy Policy and Terms are plain-language starting drafts. Have counsel review them.
- Sample articles seed as **drafts**, so Insights shows an empty state until you publish. Set `SEED_PUBLISH_SAMPLES=true` before seeding to publish them for staging.
- Phone, address and public email are intentionally empty (Admin → Settings). The brand deck's business card uses a 555 placeholder number.
- Images: CMS image fields take a bundled path (`/images/…`) or an https URL; add remote hosts to `IMAGE_REMOTE_HOSTS` to have them optimized. There is no file-upload feature.

## 6. Layout
`src/app/(public)` public pages · `src/app/admin` dashboard · `src/actions` Server Actions · `src/lib/{auth,db,data,validation,security,email}` · `prisma/{schema.prisma,migrations,seed.ts,seed-data.ts}` · `e2e/` the browser tests used during development (Puppeteer; see `e2e/README.txt`).
