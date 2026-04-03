import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const HOST='127.0.0.1';
const PORT=5173;
const URL=`http://${HOST}:${PORT}`;
const OUT=path.resolve(process.cwd(),'screenshots','layout-selector-check');
const THEMES=['default','crt','c64','msdos'];
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));

async function ok(){try{const r=await fetch(URL);return r.ok;}catch{return false;}}
async function wait(){const s=Date.now();while(Date.now()-s<30000){if(await ok())return;await sleep(250);}throw new Error('timeout');}

await mkdir(OUT,{recursive:true});
let dev=null;
if(!(await ok())){dev=spawn(`npm run dev -- --host ${HOST} --port ${PORT} --strictPort`,{shell:true,stdio:'ignore'});await wait();}

const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1600,height:1100}});
await page.goto(URL,{waitUntil:'networkidle'});

for(const theme of THEMES){
  await page.selectOption('label:has-text("Theme") select', theme);
  await page.waitForTimeout(250);

  const info = await page.evaluate(() => {
    const sel = document.querySelector('.option-toggle select');
    const body = document.body;
    const pageEl = document.querySelector('main.page');
    if(!sel || !pageEl) return null;
    const cs = getComputedStyle(sel);
    const bodyCs = getComputedStyle(body);
    const br = pageEl.getBoundingClientRect();
    return {
      select: {
        bg: cs.backgroundColor,
        color: cs.color,
        borderColor: cs.borderColor,
        borderWidth: cs.borderWidth,
        boxShadow: cs.boxShadow,
        borderRadius: cs.borderRadius,
      },
      body: {
        bg: bodyCs.backgroundColor,
        border: bodyCs.border,
        boxShadow: bodyCs.boxShadow,
      },
      pageRect: {
        left: br.left,
        right: br.right,
        width: br.width,
      },
      viewportW: window.innerWidth,
      docScrollW: document.documentElement.scrollWidth,
    };
  });

  const controls = page.locator('.controls').first();
  const box = await controls.boundingBox();
  if (box) {
    await page.screenshot({
      path: path.join(OUT, `${theme}-controls.png`),
      clip: {
        x: Math.max(0, box.x - 20),
        y: Math.max(0, box.y - 20),
        width: Math.min(1560, box.width + 40),
        height: Math.min(460, box.height + 60),
      },
    });
  }
  await page.screenshot({ path: path.join(OUT, `${theme}-full.png`), fullPage: true });

  console.log(JSON.stringify({ theme, info }));
}

await browser.close();
if(dev?.pid){spawn('taskkill',['/PID',String(dev.pid),'/T','/F'],{shell:false,stdio:'ignore'});} 
