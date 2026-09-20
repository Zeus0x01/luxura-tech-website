import { launch, BASE, sql, check, summary, sleep, waitText, textOf, status } from "./lib.mjs";
const b = await launch();
const page = await b.newPage();
await page.setViewport({ width: 1280, height: 900 });
sql("DELETE FROM rate_limit_buckets;");
const EMAIL = "admin@example.com", PW = "ChangeMe-Dev-Only-123!";
const nav = (p) => page.goto(BASE + p, { waitUntil: "domcontentloaded" });

console.log("Admin auth");
for (const p of ["/admin", "/admin/leads", "/admin/services", "/admin/industries", "/admin/articles", "/admin/settings", "/admin/homepage"]) {
  check(`unauthenticated ${p} redirects to login`, (await status(p)) === 307);
}
await nav("/admin/login"); await page.waitForSelector("#email"); await sleep(1200);
await page.type("#email", EMAIL); await page.type("#password", "wrong-password-1");
await page.click("button[type=submit]"); await waitText(page, "Incorrect email or password");
check("wrong password rejected with generic message", true);
await page.waitForFunction(() => document.getElementById("email").value === "admin@example.com", { timeout: 5000 }).catch(() => {});
check("email kept after failed login", await page.$eval("#email", (el) => el.value) === EMAIL);
await page.$eval("#password", (el) => (el.value = "")); await page.type("#password", PW);
await page.click("button[type=submit]");
await page.waitForFunction(() => location.pathname === "/admin", { timeout: 20000 });
await waitText(page, "Recent contact requests");
check("correct password reaches dashboard", page.url().endsWith("/admin"));
const dash = await textOf(page);
check("dashboard shows lead stats", dash.includes("Total leads") && dash.includes("Published services"));
check("dashboard warns about un-notified leads", dash.includes("without an email notification"));

console.log("Leads");
await nav("/admin/leads"); await waitText(page, "Jane Prospect");
check("lead list shows submitted lead", true);
check("XSS: company shown as text not HTML", (await page.content()).includes("Acme &lt;b&gt;Motors&lt;/b&gt;") || (await textOf(page)).includes("<b>Motors</b>"));
await page.type('input[name=q]', "Jane"); await page.click("form[method=get] button[type=submit]"); await page.waitForFunction(() => location.search.includes("q=Jane"), { timeout: 15000 }); await sleep(800);
check("search filters", (await textOf(page)).includes("Jane Prospect") && !(await textOf(page)).includes("Rate Test"));
await page.click('a[href^="/admin/leads/"]');
await waitText(page, "Internal notes");
const leadUrl = page.url();
check("lead detail shows message", (await textOf(page)).includes("regional fleet"));
await sleep(1000);
await page.select('select[name=status]', "IN_PROGRESS");
await sleep(2500);
check("status change persisted", sql("SELECT status FROM leads WHERE fullName='Jane Prospect'") === "IN_PROGRESS");
await page.type("#internalNotes", "Call back Tuesday. Budget discussed.");
await page.evaluate(() => [...document.querySelectorAll("button")].find((x) => x.textContent.includes("Save notes")).click());
await waitText(page, "Notes saved.");
check("internal notes saved", sql("SELECT internalNotes FROM leads WHERE fullName='Jane Prospect'").includes("Call back Tuesday"));
check("internal notes NOT in public HTML", !(await (await fetch(BASE + "/contact")).text()).includes("Call back Tuesday"));

console.log("Homepage CMS");
await nav("/admin/homepage"); await waitText(page, "Hero");
const heroTitle = "Edited From Admin: Technology, Automotive & Business";
await page.$eval("#hero form input[name=title]", (el) => (el.value = ""));
await page.type("#hero form input[name=title]", heroTitle);
await page.evaluate(() => [...document.querySelectorAll("#hero button")].find((x) => x.textContent.includes("Save")).click());
await waitText(page, "Saved. The change is live.");
const homeHtml = await (await fetch(BASE + "/")).text();
check("hero edit appears on public homepage immediately", homeHtml.includes("Edited From Admin"));

console.log("Services CMS");
await nav("/admin/services/new"); await page.waitForSelector("#title"); await sleep(800);
await page.type("#title", "Test Service"); await page.type("#slug", "test-service");
await page.type("#shortDescription", "A short description of the test service.");
await page.type("#description", "A longer description of the test service, long enough to pass validation.");
await page.type("#capabilities", "Alpha\nBeta\nGamma");
await page.evaluate(() => [...document.querySelectorAll("button")].find((x) => x.textContent.includes("Create service")).click());
await page.waitForFunction(() => location.pathname.startsWith("/admin/services/") && !location.pathname.endsWith("/new"), { timeout: 15000 });
check("draft service created", sql("SELECT status FROM services WHERE slug='test-service'") === "DRAFT");
check("draft service is hidden publicly (404)", (await status("/services/test-service")) === 404);
check("draft service absent from /services", !(await (await fetch(BASE + "/services")).text()).includes("Test Service"));
check("draft service absent from sitemap", !(await (await fetch(BASE + "/sitemap.xml")).text()).includes("test-service"));
await nav("/admin/services"); await waitText(page, "Test Service");
await page.evaluate(() => { const li = [...document.querySelectorAll("li")].find((x) => x.textContent.includes("Test Service") && x.querySelector("form")); [...li.querySelectorAll("button")].find((x) => x.textContent.includes("Publish")).click(); });
await sleep(2500);
check("service published", sql("SELECT status FROM services WHERE slug='test-service'") === "PUBLISHED");
check("published service visible (200)", (await status("/services/test-service")) === 200);
check("published service in sitemap", (await (await fetch(BASE + "/sitemap.xml")).text()).includes("/services/test-service"));
// reorder: move it up
const before = sql("SELECT slug FROM services ORDER BY displayOrder,title").split("\n");
await page.evaluate(() => { const b = document.querySelector('button[aria-label="Move Test Service up"]'); b.click(); });
await sleep(2500);
const after = sql("SELECT slug FROM services ORDER BY displayOrder,title").split("\n");
check("reorder moves service up", before.at(-1) === "test-service" && after.at(-2) === "test-service", JSON.stringify({ before, after }));
await page.evaluate(() => { const li = [...document.querySelectorAll("li")].find((x) => x.textContent.includes("Test Service") && x.querySelector("form")); [...li.querySelectorAll("button")].find((x) => x.textContent.includes("Unpublish")).click(); });
await sleep(2500);
check("unpublished service hidden again (404)", (await status("/services/test-service")) === 404);
page.once("dialog", (d) => d.accept());
await page.evaluate(() => document.querySelector('button[aria-label="Delete Test Service"]').click());
await sleep(2500);
check("service deleted", sql("SELECT COUNT(*) FROM services WHERE slug='test-service'") === "0");

console.log("Articles CMS");
await nav("/admin/articles/new"); await page.waitForSelector("#title"); await sleep(800);
await page.type("#title", "E2E Article"); await page.type("#slug", "e2e-article");
await page.type("#excerpt", "An excerpt for the end to end test article.");
await page.type("#content", "## Heading\n\nSome **bold** text and <script>alert(1)</script> and [a link](javascript:alert(1)).");
await page.evaluate(() => [...document.querySelectorAll("button")].find((x) => x.textContent.includes("Create article")).click());
await page.waitForFunction(() => /\/admin\/articles\/[^/]+$/.test(location.pathname) && !location.pathname.endsWith("/new"), { timeout: 15000 });
check("draft article created & hidden (404)", (await status("/insights/e2e-article")) === 404);
await nav("/admin/articles"); await waitText(page, "E2E Article");
await page.evaluate(() => { const li = [...document.querySelectorAll("li")].find((x) => x.textContent.includes("E2E Article") && x.querySelector("form")); [...li.querySelectorAll("button")].find((x) => x.textContent.includes("Publish")).click(); });
await sleep(2500);
check("published article visible", (await status("/insights/e2e-article")) === 200);
const art = await (await fetch(BASE + "/insights/e2e-article")).text();
check("markdown rendered (h2 present)", art.includes("<h2>Heading</h2>"));
check("raw <script> in markdown escaped, not executed", !art.includes("<script>alert(1)</script>"));
check("javascript: links neutralized", !art.includes('href="javascript:'));
check("article listed on /insights", (await (await fetch(BASE + "/insights")).text()).includes("E2E Article"));
check("publishedAt was stamped", sql("SELECT publishedAt IS NOT NULL FROM articles WHERE slug='e2e-article'") === "1");

console.log("Settings");
await nav("/admin/settings"); await page.waitForSelector("#phone"); await sleep(800);
await page.type("#companyEmail", "hello@example.com"); await page.type("#phone", "+1 555 010 0199");
await page.type("#linkedinUrl", "https://www.linkedin.com/company/example");
await page.evaluate(() => [...document.querySelectorAll("button")].find((x) => x.textContent.includes("Save settings")).click());
await waitText(page, "Settings saved.");
const foot = await (await fetch(BASE + "/contact")).text();
check("settings appear in public footer immediately", foot.includes("hello@example.com") && foot.includes("linkedin.com/company/example"));
await page.$eval("#linkedinUrl", (el) => (el.value = "")); await page.type("#linkedinUrl", "javascript:alert(1)");
await page.evaluate(() => [...document.querySelectorAll("button")].find((x) => x.textContent.includes("Save settings")).click());
await waitText(page, "Please fix the highlighted fields");
check("javascript: URL rejected in settings", true);

console.log("Logout");
await page.evaluate(() => [...document.querySelectorAll("button")].find((x) => x.textContent.includes("Sign out")).click());
await page.waitForFunction(() => location.pathname === "/admin/login", { timeout: 15000 });
check("logout returns to login", true);
await nav("/admin/leads"); check("after logout /admin/leads is protected", page.url().includes("/admin/login"));

console.log("Login throttling");
sql("DELETE FROM rate_limit_buckets;");
await nav("/admin/login"); await page.waitForSelector("#email"); await sleep(1200);
let locked = false;
for (let i = 0; i < 8 && !locked; i++) {
  await page.$eval("#email", (el) => (el.value = "")); await page.$eval("#password", (el) => (el.value = ""));
  await page.type("#email", "nobody@example.com"); await page.type("#password", "wrong-pass-" + i);
  await page.click("button[type=submit]"); await sleep(1200);
  locked = (await textOf(page)).includes("Too many sign-in attempts");
}
check("login lockout after repeated failures", locked);

await b.close();
process.exit(summary() ? 1 : 0);
