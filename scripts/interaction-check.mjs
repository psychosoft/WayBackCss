import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const HOST = process.env.HOST ?? "127.0.0.1";
const PORT = Number(process.env.PORT ?? 5173);
const BASE_URL = process.env.BASE_URL ?? `http://${HOST}:${PORT}`;
const OUT_DIR = path.resolve(process.cwd(), "screenshots");
const SHOULD_START_SERVER = process.env.START_SERVER !== "0";
const THEMES = ["default", "crt", "c64", "msdos"];
const RUN_TIMEOUT_MS = Number(process.env.RUN_TIMEOUT_MS ?? 75000);
const THEME_TIMEOUT_MS = Number(process.env.THEME_TIMEOUT_MS ?? 12000);
const DEBUG = process.env.DEBUG_INTERACTION === "1";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function logStep(startMs, message) {
  if (!DEBUG) return;
  const delta = String(Date.now() - startMs).padStart(5, " ");
  console.log(`[t+${delta}ms] ${message}`);
}

async function withTimeout(work, timeoutMs, label) {
  return Promise.race([
    work(),
    sleep(timeoutMs).then(() => {
      throw new Error(`${label} timed out after ${timeoutMs}ms`);
    }),
  ]);
}

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url, { redirect: "follow" });
      if (response.ok) return;
    } catch {
      // keep polling
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
  return spawn("npm run dev -- --host " + HOST + " --port " + String(PORT) + " --strictPort", {
    cwd: process.cwd(),
    stdio: "inherit",
    shell: true,
  });
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
  await page.waitForTimeout(180);
}

async function safeClick(locator) {
  try {
    await Promise.race([
      (async () => {
        await locator.scrollIntoViewIfNeeded();
        await locator.click({ timeout: 140 });
      })(),
      sleep(260).then(() => {
        throw new Error("click-timeout");
      }),
    ]);
    return true;
  } catch {
    return false;
  }
}

async function runInteractionSteps(page, theme) {
  const steps = [
    { name: "switch", selector: '[role="switch"]' },
    { name: "tab", selector: '[role="tab"]' },
    { name: "accordion", selector: ".MuiAccordionSummary-root" },
    { name: "rb-dropdown", selector: ".dropdown-toggle" },
    { name: "headless-btn", selector: ".headless-btn" },
  ];

  const results = [];
  for (let i = 0; i < steps.length; i += 1) {
    const step = steps[i];
    const locator = page.locator(step.selector).first();
    const exists = (await locator.count()) > 0;
    const clicked = exists ? await safeClick(locator) : false;
    await page.waitForTimeout(40);

    const shotPath = path.join(
      OUT_DIR,
      `interactive-${theme}-${String(i + 1).padStart(2, "0")}-${step.name}.png`
    );
    await withTimeout(
      async () => page.screenshot({ path: shotPath, fullPage: false }),
      3000,
      `Screenshot ${theme}/${step.name}`
    );
    console.log(`Saved ${shotPath}`);

    const bodyText = await page.locator("body").innerText();
    const looksHealthy = bodyText.includes("Injected Container") && bodyText.includes("Ant Design (MIT)");
    results.push(`${step.name}: ${clicked ? "clicked" : "skipped"} (${looksHealthy ? "ok" : "suspect"})`);
    if (!looksHealthy) {
      throw new Error(`Health check failed after ${step.name} in theme ${theme}`);
    }
  }

  for (const entry of [
    { name: "ant-option", selector: ".ant-select-item-option" },
    { name: "rb-item", selector: ".dropdown-item" },
  ]) {
    const locator = page.locator(entry.selector).first();
    if ((await locator.count()) > 0) {
      await safeClick(locator);
      const shotPath = path.join(OUT_DIR, `interactive-${theme}-extra-${entry.name}.png`);
      await withTimeout(
        async () => page.screenshot({ path: shotPath, fullPage: false }),
        3000,
        `Screenshot ${theme}/${entry.name}`
      );
      console.log(`Saved ${shotPath}`);
    }
  }

  return results;
}

async function run() {
  const startedAt = Date.now();
  let serverProcess = null;
  let browser = null;
  const errors = [];

  try {
    await mkdir(OUT_DIR, { recursive: true });
    logStep(startedAt, "Created screenshots directory");

    if (SHOULD_START_SERVER) {
      const alreadyRunning = await isServerReachable(BASE_URL);
      if (alreadyRunning) {
        console.log(`Using existing server at ${BASE_URL}`);
        logStep(startedAt, "Reused existing dev server");
      } else {
        serverProcess = startViteServer();
        logStep(startedAt, "Started vite dev server");
        await waitForServer(BASE_URL);
        logStep(startedAt, "Dev server reachable");
      }
    }

    browser = await chromium.launch({ headless: true });
    logStep(startedAt, "Chromium launched");
    const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
    logStep(startedAt, "Page created");

    page.on("pageerror", (error) => {
      errors.push(`pageerror: ${error.message}`);
    });
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        const text = msg.text();
        if (text.includes("Failed to load resource") && text.includes("404")) return;
        errors.push(`console.error: ${text}`);
      }
    });

    await withTimeout(async () => {
      await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 15000 });
      logStep(startedAt, "Base page loaded");
      for (const theme of THEMES) {
        logStep(startedAt, `Start theme ${theme}`);
        await setTheme(page, theme);
        try {
          const results = await withTimeout(
            async () => runInteractionSteps(page, theme),
            THEME_TIMEOUT_MS,
            `Theme ${theme}`
          );
          console.log(`[${theme}] ${results.join(" | ")}`);
          logStep(startedAt, `Interactions complete for ${theme}`);
        } catch (error) {
          errors.push(String(error));
          logStep(startedAt, `Interaction timeout/error for ${theme}`);
        }
      }
    }, RUN_TIMEOUT_MS, "Interaction check");

    if (errors.length > 0) {
      console.log("Interaction warnings/errors:");
      for (const entry of [...new Set(errors)]) {
        console.log(`- ${entry}`);
      }
      process.exitCode = 1;
    } else {
      console.log("Interaction check passed with no page/console errors.");
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
