import { launch, BASE, sql, check, summary, sleep, waitText, textOf } from "./lib.mjs";
const b = await launch();
const page = await b.newPage();
await page.setViewport({ width: 1280, height: 900 });
sql("DELETE FROM leads; DELETE FROM rate_limit_buckets;");

console.log("Contact form");
await page.goto(BASE + "/contact", { waitUntil: "networkidle0" });
await page.click("button[type=submit]");
await waitText(page, "Please enter your full name.");
check("client validation shows errors", (await textOf(page)).includes("Please enter a valid email address."));

// too-fast submission (bot-like): fill and submit immediately after load
await page.reload({ waitUntil: "domcontentloaded" }); await page.waitForSelector("#fullName"); await sleep(400);
await page.type("#fullName", "Fast Bot"); await page.type("#email", "bot@example.com"); await page.type("#message", "This is a bot message sent instantly.");
await page.click("button[type=submit]");
await waitText(page, "Thank you");
check("too-fast submit looks successful to bot", true);
check("too-fast submit NOT stored", sql("SELECT COUNT(*) FROM leads") === "0");

// honeypot
await page.reload({ waitUntil: "networkidle0" }); await sleep(3000);
await page.type("#fullName", "Honey Bot"); await page.type("#email", "hp@example.com"); await page.type("#message", "Honeypot filled message here.");
await page.type("#website", "http://spam.example");
await page.click("button[type=submit]");
await waitText(page, "Thank you");
check("honeypot NOT stored", sql("SELECT COUNT(*) FROM leads") === "0");

// genuine
await page.reload({ waitUntil: "networkidle0" }); await sleep(3000);
await page.type("#fullName", "Jane Prospect"); await page.type("#company", "Acme <b>Motors</b>");
await page.type("#email", "Jane@Example.com"); await page.type("#phone", "+1 (415) 555-0100"); await page.type("#country", "United States");
await page.select("#serviceId", await page.$eval("#serviceId option:nth-child(3)", (o) => o.value));
await page.click("input[value=PHONE]", { delay: 10 }).catch(() => {});
await page.type("#message", "We operate a regional fleet and would like to discuss efficiency and technology options.");
await page.click("button[type=submit]");
await waitText(page, "Thank you");
check("genuine lead success message", true);
const row = sql("SELECT fullName,company,email,phone,country,preferredContactMethod,status,IF(serviceId IS NULL,'noservice','service'),IF(notifiedAt IS NULL,'notnotified','notified') FROM leads");
console.log("   row:", row);
check("lead saved with lowercased email + status NEW", row.includes("jane@example.com") && row.includes("\tNEW\t"));
check("lead saved even though email is not configured (notifiedAt NULL)", row.includes("notnotified"));
check("lead linked to service", row.includes("\tservice\t"));
check("company stored as plain text (escaped on output)", row.includes("<b>Motors</b>"));

// rate limit: 5 per hour per visitor. 1 genuine so far (spam attempts also count). Fire more.
let limited = false;
for (let i = 0; i < 6 && !limited; i++) {
  await page.reload({ waitUntil: "domcontentloaded" }); await page.waitForSelector("#fullName"); await sleep(3000);
  await page.type("#fullName", "Rate Test " + i); await page.type("#email", `r${i}@example.com`); await page.type("#message", "Rate limit message number " + i + " here.");
  await page.click("button[type=submit]");
  await sleep(1500);
  limited = (await textOf(page)).includes("received several requests");
}
check("rate limiting kicks in", limited);
await b.close();
process.exit(summary() ? 1 : 0);
