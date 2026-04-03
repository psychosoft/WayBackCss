import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const HOST='127.0.0.1';
const PORT=5173;
const URL=`http://${HOST}:${PORT}`;
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));

async function reachable(){ try{ const r=await fetch(URL); return r.ok; } catch { return false; } }
async function waitServer(){ const s=Date.now(); while(Date.now()-s<30000){ if(await reachable()) return; await sleep(250);} throw new Error('server timeout'); }

let dev=null;
if(!(await reachable())){ dev=spawn(`npm run dev -- --host ${HOST} --port ${PORT} --strictPort`,{shell:true,stdio:'ignore'}); await waitServer(); }

const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1400,height:1000}});
await page.goto(URL,{waitUntil:'networkidle'});

for (const theme of ['default','crt','c64','msdos']) {
  await page.selectOption('label:has-text("Theme") select', theme);
  await page.waitForTimeout(150);

  const field = page.locator('.headless-field', { hasText: 'Headless select' }).first();
  const button = field.locator('button.headless-btn').first();

  const before = (await button.innerText()).trim();
  await button.click();
  await page.waitForTimeout(120);

  const beta = page.locator('.headless-menu-items [role="option"]', { hasText: 'Beta' }).first();
  const count = await beta.count();
  let clicked = false;
  if (count > 0) {
    await beta.click({ timeout: 1500 });
    clicked = true;
  }
  await page.waitForTimeout(120);

  const after = (await button.innerText()).trim();
  console.log(JSON.stringify({ theme, before, clicked, after, changed: before !== after }));
}

await browser.close();
if(dev?.pid){ spawn('taskkill',['/PID',String(dev.pid),'/T','/F'],{shell:false,stdio:'ignore'}); }
