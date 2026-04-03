import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const PORT = Number(process.env.PORT ?? 4173);
const HOST = process.env.HOST ?? "127.0.0.1";
const BASE_URL = process.env.BASE_URL ?? `http://${HOST}:${PORT}`;
const OUT_DIR = path.resolve(process.cwd(), "screenshots");
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
      // Keep polling until timeout.
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
  const child = spawn(
    "npm run dev -- --host " + HOST + " --port " + String(PORT) + " --strictPort",
    {
      cwd: process.cwd(),
      stdio: "inherit",
      shell: true,
    }
  );
  return child;
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

async function setTheme(page, value) {
  await page.selectOption('label:has-text("Theme") select', value);
  await page.waitForTimeout(250);
}

async function run() {
  let serverProcess = null;
  try {
    await mkdir(OUT_DIR, { recursive: true });

    if (SHOULD_START_SERVER) {
      const alreadyRunning = await isServerReachable(BASE_URL);
      if (alreadyRunning) {
        console.log(`Using existing server at ${BASE_URL}`);
      } else {
        serverProcess = startViteServer();
        await waitForServer(BASE_URL);
      }
    }

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
    await page.goto(BASE_URL, { waitUntil: "networkidle" });

    for (const theme of THEMES) {
      await setTheme(page, theme);
      const outPath = path.join(OUT_DIR, `theme-${theme}.png`);
      await page.screenshot({ path: outPath, fullPage: true });
      console.log(`Saved ${outPath}`);
    }

    await browser.close();
  } finally {
    if (serverProcess) {
      await stopServerTree(serverProcess);
    }
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
