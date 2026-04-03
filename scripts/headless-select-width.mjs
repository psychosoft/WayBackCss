import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
const HOST='127.0.0.1';
const PORT=5173;
const URL=`http://${HOST}:${PORT}`;
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
async function reachable(){try{const r=await fetch(URL);return r.ok;}catch{return false;}}
async function wait(){const s=Date.now();while(Date.now()-s<30000){if(await reachable())return;await sleep(250);}throw new Error('server timeout');}
let p=null;
if(!(await reachable())){p=spawn(`npm run dev -- --host ${HOST} --port ${PORT} --strictPort`,{shell:true,stdio:'ignore'});await wait();}
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1400,height:1000}});
await page.goto(URL,{waitUntil:'networkidle'});
for(const theme of ['default','crt','c64','msdos']){
 await page.selectOption('label:has-text("Theme") select',theme);
 await page.waitForTimeout(220);
 const field=page.locator('.headless-field',{hasText:'Headless select'}).first();
 const btn=field.locator('button.headless-btn').first();
 await btn.click();
 await page.waitForTimeout(160);
 const result=await page.evaluate(()=>{
  const f=[...document.querySelectorAll('.headless-field')].find(x=>x.textContent?.includes('Headless select'));
  const b=f?.querySelector('button.headless-btn');
  const m=[...document.querySelectorAll('.headless-menu-items')].find(x=>x.querySelector('[role="option"]'));
  if(!b||!m)return null;
  const br=b.getBoundingClientRect();
  const mr=m.getBoundingClientRect();
  return {btnW:br.width,menuW:mr.width,delta:br.width-mr.width};
 });
 console.log(theme, result);
 await page.keyboard.press('Escape');
}
await browser.close();
if(p?.pid){spawn('taskkill',['/PID',String(p.pid),'/T','/F'],{shell:false,stdio:'ignore'});} 
