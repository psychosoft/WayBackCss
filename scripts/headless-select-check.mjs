import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const HOST = process.env.HOST ?? "127.0.0.1";
const PORT = Number(process.env.PORT ?? 5173);
const BASE_URL = process.env.BASE_URL ?? `http://${HOST}:${PORT}`;
const THEMES = ["default", "crt", "c64", "msdos"];
const OUT_DIR = path.resolve(process.cwd(), "screenshots", "headless-select");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function reachable(url) {
  try {
    const res = await fetch(url);
    return res.ok;
  } catch {
    return false;
  }
}

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await reachable(url)) return;
    await sleep(250);
  }
  throw new Error(`Server not reachable: ${url}`);
}

function startServer() {
  return spawn(`npm run dev -- --host ${HOST} --port ${PORT} --strictPort`, {
    cwd: process.cwd(),
    shell: true,
    stdio: "ignore",
  });
}

async function stopTree(child) {
  if (!child?.pid) return;
  if (process.platform === "win32") {
    await new Promise((resolve) => {
      const killer = spawn("taskkill", ["/PID", String(child.pid), "/T", "/F"], {
        shell: false,
        stdio: "ignore",
      });
      killer.on("exit", () => resolve());
      killer.on("error", () => resolve());
    });
    return;
  }
  child.kill("SIGTERM");
}

async function run() {
  await mkdir(OUT_DIR, { recursive: true });
  let server = null;
  if (!(await reachable(BASE_URL))) {
    server = startServer();
    await waitForServer(BASE_URL);
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });

  const report = [];
  try {
    await page.goto(BASE_URL, { waitUntil: "networkidle" });

    for (const theme of THEMES) {
      await page.selectOption('label:has-text("Theme") select', theme);
      await page.waitForTimeout(250);

      const field = page.locator('.headless-field', { hasText: 'Headless select' }).first();
      const button = field.locator('button.headless-btn').first();
      await button.click();
      await page.waitForTimeout(220);

      const menu = page.locator('.headless-menu-items').filter({ has: page.locator('[role="option"]') }).first();
      const firstOption = menu.locator('[role="option"]').first();

      const metrics = await page.evaluate(({ menuSel }) => {
        const menus = Array.from(document.querySelectorAll(menuSel));
        const target = menus.find((m) => m.querySelector('[role="option"]'));
        if (!target) return null;
        const option = target.querySelector('[role="option"]');
        if (!option) return null;
        const mcs = getComputedStyle(target);
        const ocs = getComputedStyle(option);
        return {
          menuRadius: mcs.borderRadius,
          optionRadius: ocs.borderRadius,
          menuClientWidth: target.clientWidth,
          optionClientWidth: option.clientWidth,
          widthDelta: target.clientWidth - option.clientWidth,
        };
      }, { menuSel: '.headless-menu-items' });

      const shot = path.join(OUT_DIR, `${theme}-open.png`);
      await page.screenshot({ path: shot, fullPage: true });

      report.push({ theme, shot, metrics });

      await page.keyboard.press('Escape');
      await page.waitForTimeout(120);
    }

    for (const row of report) {
      console.log(JSON.stringify(row));
    }
  } finally {
    await browser.close();
    await stopTree(server);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
