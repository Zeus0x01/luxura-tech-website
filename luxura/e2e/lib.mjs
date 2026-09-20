import { execSync } from "node:child_process";
import { launch } from "./shot.mjs";
export const BASE = "http://localhost:3000";
export const sql = (q) => execSync(`mysql -uroot luxura -N -B -e "${q.replace(/"/g, '\\"')}"`).toString().trim();
let pass = 0, fail = 0;
export function check(name, cond, extra = "") {
  if (cond) { pass++; console.log("  PASS", name); } else { fail++; console.log("  FAIL", name, extra); }
}
export function summary() { console.log(`\n${pass} passed, ${fail} failed`); return fail; }
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export async function status(path) { const r = await fetch(BASE + path, { redirect: "manual" }); return r.status; }
export async function textOf(page) { return page.evaluate(() => document.body.innerText); }
export async function waitText(page, text, timeout = 15000) {
  await page.waitForFunction((t) => document.body.innerText.includes(t), { timeout }, text);
}
export { launch };
