import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
export async function launch() {
  return puppeteer.launch({
    args: [...chromium.args, "--no-sandbox", "--disable-gpu"],
    executablePath: await chromium.executablePath(),
    headless: "shell",
  });
}
if (process.argv[1].endsWith("shot.mjs")) {
  const b = await launch();
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto("http://localhost:3000/", { waitUntil: "networkidle0" });
  await p.screenshot({ path: "/tmp/e2e/home.png" });
  console.log("title:", await p.title());
  await b.close();
}
