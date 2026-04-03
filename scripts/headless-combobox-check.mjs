import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
import path from 'node:path';
import { mkdir } from 'node:fs/promises';

const HOST='127.0.0.1';
const PORT=5173;
const URL=`http://${HOST}:${PORT}`;
const OUT=path.resolve(process.cwd(),'screenshots','headless-combobox');
const THEMES=['default','crt','c64','msdos'];
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));

async function reachable(){try{const r=await fetch(URL);return r.ok;}catch{return false;}}
async function waitServer(){const s=Date.now();while(Date.now()-s<30000){if(await reachable())return;await sleep(250);}throw new Error('server timeout');}

await mkdir(OUT,{recursive:true});
let dev=null;
if(!(await reachable())){dev=spawn(`npm run dev -- --host ${HOST} --port ${PORT} --strictPort`,{shell:true,stdio:'ignore'});await waitServer();}

const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1600,height:1200}});
await page.goto(URL,{waitUntil:'networkidle'});

for(const theme of THEMES){
  await page.selectOption('label:has-text("Theme") select', theme);
  await page.waitForTimeout(250);

  const field = page.locator('.headless-picker', { hasText: 'Headless combobox' }).first();
  const input = field.locator('input.headless-btn').first();

  await input.click();
  await input.fill('deploy');
  await input.press('ArrowDown');
  await page.waitForTimeout(180);

  const info = await page.evaluate(() => {
    const picker = [...document.querySelectorAll('.headless-picker')].find((n) => n.textContent?.includes('Headless combobox'));
    if(!picker) return null;
    const input = picker.querySelector('input.headless-btn');
    const panel = document.querySelector('.headless-combobox-options');
    if(!input || !panel) return null;
    const cs = getComputedStyle(input);
    const ir = input.getBoundingClientRect();
    const ps = getComputedStyle(panel);
    return {
      writingMode: cs.writingMode,
      textOrientation: cs.textOrientation,
      direction: cs.direction,
      whiteSpace: cs.whiteSpace,
      lineHeight: cs.lineHeight,
      fontSize: cs.fontSize,
      inputW: Math.round(ir.width*10)/10,
      inputH: Math.round(ir.height*10)/10,
      panelW: Math.round(panel.getBoundingClientRect().width*10)/10,
      panelOverflowX: ps.overflowX,
      panelOverflowY: ps.overflowY,
    };
  });

  const shot=path.join(OUT,`${theme}.png`);
  await page.screenshot({path:shot,fullPage:true});
  console.log(JSON.stringify({theme,shot,info}));
  await page.keyboard.press('Escape');
}

await browser.close();
if(dev?.pid){spawn('taskkill',['/PID',String(dev.pid),'/T','/F'],{shell:false,stdio:'ignore'});} 
