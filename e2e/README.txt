Development-time browser tests (contact form, spam/rate limits, admin auth, CMS, drafts, settings).
Setup: cd e2e && npm init -y && npm i puppeteer-core @sparticuz/chromium
Run against a running production build (`npm run build && npm start`) on a database seeded with
admin@example.com / ChangeMe-Dev-Only-123!  ->  node t1.mjs && node t2.mjs
They use the mysql CLI (database name "luxura") to verify rows. Adjust lib.mjs if yours differs.
