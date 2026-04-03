import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const HOST = process.env.HOST ?? "127.0.0.1";
const PORT = Number(process.env.PORT ?? 5173);
const BASE_URL = process.env.BASE_URL ?? `http://${HOST}:${PORT}`;
const SHOULD_START_SERVER = process.env.START_SERVER !== "0";
const THEMES = ["default", "crt", "c64", "msdos"];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url, { redirect: "follow" });
      if (response.ok) return;
    } catch {
      // Keep polling.
    }
    await sleep(300);
  }
  throw new Error(`Server not reachable at ${url} within ${timeoutMs}ms`);
}

async function isServerReachable(url) {
  try {
    const response = await fetch(url, { redirect: "follow" });
    return response.ok;
  } catch {
    return false;
  }
}

function startViteServer() {
  return spawn(
    "npm run dev -- --host " + HOST + " --port " + String(PORT) + " --strictPort",
    {
      cwd: process.cwd(),
      stdio: "inherit",
      shell: true,
    }
  );
}

async function stopServerTree(child) {
  if (!child?.pid) return;
  if (process.platform === "win32") {
    await new Promise((resolve) => {
      const killer = spawn("taskkill", ["/PID", String(child.pid), "/T", "/F"], {
        stdio: "ignore",
        shell: false,
      });
      killer.on("error", () => resolve());
      killer.on("exit", () => resolve());
    });
    return;
  }
  child.kill("SIGTERM");
}

async function run() {
  let serverProcess = null;
  let browser = null;

  try {
    if (SHOULD_START_SERVER) {
      const alreadyRunning = await isServerReachable(BASE_URL);
      if (alreadyRunning) {
        console.log(`Using existing server at ${BASE_URL}`);
      } else {
        serverProcess = startViteServer();
        await waitForServer(BASE_URL);
      }
    }

    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1600, height: 1100 } });
    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
    await page.locator(".floating-edit-fab").click({ force: true });
    await page.waitForTimeout(120);

    const report = [];

    for (const theme of THEMES) {
      await page.selectOption(".controls select", theme);
      await page.waitForTimeout(120);
      await page.getByRole("button", { name: "Reset dragged layout" }).click({ force: true });
      await page.waitForTimeout(120);

      const img = page.locator(".preview .media-grid figure:first-child img").first();
      await img.scrollIntoViewIfNeeded();
      const ib = await img.boundingBox();
      if (!ib) throw new Error(`Image bbox missing in theme ${theme}`);
      await page.mouse.click(ib.x + ib.width - 24, ib.y + 8);
      await page.waitForTimeout(500);

      const hideOk = await page.evaluate(() => {
        const item = document.querySelector(".manipulated-item");
        if (!item) return { ok: false, reason: "no-item" };
        const state = item.querySelector(".state-pill")?.textContent?.trim().toLowerCase();
        const img = item.querySelector(".manipulated-preview img");
        const src = img?.getAttribute("src") || "";
        const hasDataImage = src.startsWith("data:image/");
        return {
          ok: state === "hidden" && hasDataImage,
          state,
          hasDataImage,
          srcPrefix: src.slice(0, 24),
        };
      });

      const imgRemove = page.locator(".preview .media-grid figure:first-child img").first();
      await imgRemove.scrollIntoViewIfNeeded();
      const rb = await imgRemove.boundingBox();
      if (!rb) throw new Error(`Image bbox missing for remove in theme ${theme}`);
      await page.mouse.click(rb.x + rb.width - 8, rb.y + 8);
      await page.waitForTimeout(900);

      const removeOk = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll(".manipulated-item"));
        const removed = items.find(
          (el) => el.querySelector(".state-pill")?.textContent?.trim().toLowerCase() === "removed"
        );
        if (!removed) return { ok: false, reason: "no-removed-item", count: items.length };
        const img = removed.querySelector(".manipulated-preview img");
        const src = img?.getAttribute("src") || "";
        const hasDataImage = src.startsWith("data:image/");
        return {
          ok: hasDataImage,
          hasDataImage,
          srcPrefix: src.slice(0, 24),
          count: items.length,
        };
      });

      report.push({ theme, hideOk, removeOk });
    }

    await page.screenshot({
      path: path.resolve(process.cwd(), "screenshots", "manipulated-preview-loop-strict.png"),
      fullPage: false,
    });
    console.log(JSON.stringify(report, null, 2));

    const failures = report.filter((r) => !r.hideOk.ok || !r.removeOk.ok);
    if (failures.length > 0) {
      process.exitCode = 1;
    }
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
    if (serverProcess) {
      await stopServerTree(serverProcess);
    }
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
