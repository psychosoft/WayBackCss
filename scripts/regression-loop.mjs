import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL ?? "http://127.0.0.1:5173";
const THEMES = ["default", "crt", "c64", "msdos"];
const OUT_DIR = path.resolve(process.cwd(), "screenshots", "regression-loop");

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

async function setTheme(page, theme) {
  await page.selectOption('.controls select', theme);
  await page.waitForTimeout(180);
}

async function checkFocusOutline(page, selector, label) {
  const locator = page.locator(selector).first();
  if ((await locator.count()) === 0) {
    return { label, ok: false, reason: "missing" };
  }
  // Put page into keyboard modality before checking :focus-visible styles.
  await page.keyboard.press("Tab");
  await locator.focus();
  const info = await locator.evaluate((el) => {
    const s = getComputedStyle(el);
    return {
      outlineWidth: s.outlineWidth,
      outlineStyle: s.outlineStyle,
      boxShadow: s.boxShadow,
    };
  });
  const outlineVisible =
    (info.outlineStyle && info.outlineStyle !== "none" && info.outlineWidth !== "0px") ||
    (info.boxShadow && info.boxShadow !== "none");
  return { label, ok: !!outlineVisible, ...info };
}

async function stepClick(page, rootSelector, actionSelector, screenshotPath) {
  const root = page.locator(rootSelector).first();
  const action = page.locator(actionSelector).first();
  await root.scrollIntoViewIfNeeded();
  await action.scrollIntoViewIfNeeded();
  await page.waitForTimeout(80);
  const yBefore = await page.evaluate(() => window.scrollY);
  await action.click({ force: true });
  await page.waitForTimeout(120);
  const yAfter = await page.evaluate(() => window.scrollY);
  await page.screenshot({ path: screenshotPath, fullPage: false });
  return { scrollDelta: yAfter - yBefore };
}

async function runTheme(page, theme, themeDir) {
  const results = [];

  await setTheme(page, theme);

  // React Bootstrap dropdown: open + select
  results.push({
    name: "rb-dropdown-open",
    ...(await stepClick(
      page,
      'section:has(h3:has-text("React Bootstrap"))',
      'section:has(h3:has-text("React Bootstrap")) .dropdown-toggle',
      path.join(themeDir, "01-rb-dropdown-open.png")
    )),
  });
  results.push({
    name: "rb-dropdown-select",
    ...(await stepClick(
      page,
      'section:has(h3:has-text("React Bootstrap"))',
      'section:has(h3:has-text("React Bootstrap")) .dropdown-menu.show .dropdown-item:has-text("Another action")',
      path.join(themeDir, "02-rb-dropdown-select.png")
    )),
  });

  // Headless select: open + select
  results.push({
    name: "headless-select-open",
    ...(await stepClick(
      page,
      '.headless-field:has(.headless-label:has-text("Headless select"))',
      '.headless-field:has(.headless-label:has-text("Headless select")) .headless-btn',
      path.join(themeDir, "03-headless-select-open.png")
    )),
  });
  results.push({
    name: "headless-select-choose",
    ...(await stepClick(
      page,
      '.headless-field:has(.headless-label:has-text("Headless select"))',
      '.headless-field:has(.headless-label:has-text("Headless select")) .headless-menu-items [role="option"]:has-text("Gamma")',
      path.join(themeDir, "04-headless-select-choose.png")
    )),
  });

  // Headless combobox: open + select
  results.push({
    name: "headless-combobox-open",
    ...(await stepClick(
      page,
      '.headless-picker:has-text("Headless combobox")',
      '.headless-picker:has-text("Headless combobox") .headless-combobox-toggle',
      path.join(themeDir, "05-headless-combobox-open.png")
    )),
  });
  results.push({
    name: "headless-combobox-choose",
    ...(await stepClick(
      page,
      '.headless-picker:has-text("Headless combobox")',
      '.headless-picker:has-text("Headless combobox") .headless-combobox-options [role="option"]:has-text("rollback")',
      path.join(themeDir, "06-headless-combobox-choose.png")
    )),
  });

  // MUI select: open + select
  results.push({
    name: "mui-select-open",
    ...(await stepClick(
      page,
      ".mui-lab",
      '.mui-lab [role="combobox"]:has-text("MUI dropdown"), .mui-lab [aria-labelledby="mui-select-label"]',
      path.join(themeDir, "07-mui-select-open.png")
    )),
  });
  results.push({
    name: "mui-select-choose",
    ...(await stepClick(
      page,
      ".mui-lab",
      'ul[role="listbox"] li:has-text("Gamma")',
      path.join(themeDir, "08-mui-select-choose.png")
    )),
  });

  // Ant select: open + select
  results.push({
    name: "ant-select-open",
    ...(await stepClick(
      page,
      'section:has(h3:has-text("Ant Design"))',
      'section:has(h3:has-text("Ant Design")) .ant-select',
      path.join(themeDir, "09-ant-select-open.png")
    )),
  });
  results.push({
    name: "ant-select-choose",
    ...(await stepClick(
      page,
      'section:has(h3:has-text("Ant Design"))',
      ".ant-select-dropdown .ant-select-item-option:has-text('Gamma')",
      path.join(themeDir, "10-ant-select-choose.png")
    )),
  });

  const outlineChecks = [];
  outlineChecks.push(
    await checkFocusOutline(
      page,
      'section:has(h3:has-text("React Bootstrap")) .btn.btn-primary',
      "rb-button-outline"
    )
  );
  outlineChecks.push(
    await checkFocusOutline(
      page,
      'section:has(h3:has-text("Headless UI")) .headless-btn',
      "headless-outline"
    )
  );
  outlineChecks.push(
    await checkFocusOutline(
      page,
      'section:has(h3:has-text("Ant Design")) .ant-btn',
      "ant-outline"
    )
  );
  outlineChecks.push(
    await checkFocusOutline(page, ".mui-lab .MuiButtonBase-root", "mui-outline")
  );

  return { results, outlineChecks };
}

async function run() {
  await ensureDir(OUT_DIR);
  const runId = stamp();
  const runDir = path.join(OUT_DIR, runId);
  await ensureDir(runDir);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1500, height: 1100 } });
  const summary = { baseUrl: BASE_URL, runId, themes: {} };

  try {
    await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 30000 });

    for (const theme of THEMES) {
      const themeDir = path.join(runDir, theme);
      await ensureDir(themeDir);
      summary.themes[theme] = await runTheme(page, theme, themeDir);
    }

    const summaryPath = path.join(runDir, "summary.json");
    await writeFile(summaryPath, JSON.stringify(summary, null, 2), "utf8");
    console.log(`Saved ${summaryPath}`);

    let failures = 0;
    for (const theme of THEMES) {
      const themeResult = summary.themes[theme];
      for (const step of themeResult.results) {
        if (Math.abs(step.scrollDelta) > 4) failures += 1;
      }
      for (const outline of themeResult.outlineChecks) {
        if (!outline.ok) failures += 1;
      }
    }

    if (failures > 0) {
      console.log(`Regression loop found ${failures} issues.`);
      process.exitCode = 1;
    } else {
      console.log("Regression loop passed.");
    }
  } finally {
    await browser.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
