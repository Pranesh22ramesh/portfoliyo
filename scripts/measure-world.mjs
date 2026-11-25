import { chromium } from '@playwright/test';
import { existsSync } from 'node:fs';

const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const url = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3000';
const software = process.argv.includes('--software');
const mobile = process.argv.includes('--mobile');
const browser = await chromium.launch({
  executablePath: existsSync(chrome) ? chrome : undefined,
  args: software ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] : [],
});
try {
  const context = await browser.newContext({
    viewport: mobile ? {width:390,height:844} : {width:1280,height:720},
    deviceScaleFactor: mobile ? 2 : 1,
    hasTouch: mobile,
    isMobile: mobile,
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  if (process.argv.includes('--throttle')) await cdp.send('Emulation.setCPUThrottlingRate',{ rate:4 });
  await page.addInitScript(() => {
    localStorage.setItem('developer-world-preferences-v1',JSON.stringify({seenIntro:true}));
    performance.mark('world-navigation');
  });
  const addresses = [];
  page.on('response', response => {
    if (response.status() >= 400) addresses.push([response.status(), response.url()]);
  });
  await page.goto(url);
  await page.getByRole('button',{name:'Exit car'}).waitFor();
  const startup = await page.evaluate(() => Math.round(performance.now()));
  await page.waitForTimeout(6300);
  const render = await page.evaluate(async () => {
    const gl=document.querySelector('canvas')?.getContext('webgl2');
    const info=gl?.getExtension('WEBGL_debug_renderer_info');
    const frames = [];
    let previous = performance.now();
    const end=previous+2500;
    await new Promise(resolve => {
      function frame(now){
        frames.push(now-previous);
        previous=now;
        if(now>=end)resolve();
        else requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    });
    frames.sort((a,b)=>a-b);
    const bytes=performance.getEntriesByType('resource').reduce((total,entry)=>total+(entry.transferSize||0),0);
    return {
      renderer:info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : 'Unavailable',
      p50:Math.round(frames[Math.floor(frames.length*.5)]),
      p95:Math.round(frames[Math.floor(frames.length*.95)]),
      bytes,
    };
  });
  if (process.env.WORLD_SCREENSHOT) await page.screenshot({path:process.env.WORLD_SCREENSHOT});
  const heap=await cdp.send('Runtime.getHeapUsage');
  await page.getByRole('button',{name:'Settings'}).click();
  const world=await page.getByTestId('world-performance').innerText();
  console.log(JSON.stringify({software,mobile,startup,world,...render,heapMiB:Math.round(heap.usedSize/1048576),errors:addresses},null,2));
} finally {
  await browser.close();
}
