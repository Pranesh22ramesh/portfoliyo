import { existsSync, mkdirSync } from 'node:fs';
import { chromium } from '@playwright/test';

const url=process.env.PLAYWRIGHT_BASE_URL??'http://127.0.0.1:3000';
const dir=process.env.WORLD_QA_DIR??'artifacts/visual-qa';
const prefix=process.argv[2]??'local';
mkdirSync(dir,{recursive:true});
const chrome='C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser=await chromium.launch({executablePath:existsSync(chrome)?chrome:undefined});
const destinations=['Home','Garage','Project Lab','Skill Workshop','University','IT Park','Achievement Museum','Research Center','Post Office','Fun Park'];
for(const mobile of [false,true]){
  const context=await browser.newContext(mobile?{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}:{viewport:{width:1440,height:900}});
  await context.addInitScript(()=>localStorage.setItem('developer-world-preferences-v1',JSON.stringify({seenIntro:true,light:'day'})));
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
  await page.goto(url);
  await page.getByRole('button',{name:'Exit car'}).waitFor({timeout:25000});
  await page.waitForTimeout(650);
  await page.screenshot({path:dir+'/'+prefix+(mobile?'-mobile':'-street')+'.png'});
  if(!mobile){
    const dialog=page.getByRole('dialog');
    for(const name of destinations){
      await page.getByRole('button',{name:'Open city map'}).click();
      await dialog.getByRole('button',{name,exact:true}).last().click();
      await dialog.getByRole('button',{name:'Fast travel'}).click();
      await page.getByRole('button',{name:'Talk',exact:true}).waitFor();
      if(name==='Fun Park'||name==='University'||name==='Garage'){
        await page.getByRole('button',{name:'Photo mode'}).click();
        await dialog.getByRole('slider').first().fill(name==='Fun Park'?'2.8':'2.4');
        await page.waitForTimeout(450);
        const request=page.waitForEvent('download');
        await dialog.getByRole('button',{name:'Download photo'}).click();
        await (await request).saveAs(dir+'/'+prefix+'-'+name.toLowerCase().replaceAll(' ','-')+'.png');
        if(name==='Garage'&&await dialog.getByRole('slider',{name:'Camera zoom'}).count()){
          await dialog.getByRole('slider',{name:'Camera zoom'}).fill('2.15');
          await page.waitForTimeout(450);
          const closeup=page.waitForEvent('download');
          await dialog.getByRole('button',{name:'Download photo'}).click();
          await (await closeup).saveAs(dir+'/'+prefix+'-roadster-closeup.png');
        }
        await dialog.getByRole('button',{name:'Close panel'}).click();
      }
      await page.getByRole('button',{name:'Talk',exact:true}).click();
      await dialog.getByRole('heading',{name,exact:true}).waitFor();
      await dialog.getByRole('button',{name:'Close panel'}).click();
    }
    await page.getByRole('button',{name:'Exit car'}).click();
    await page.getByRole('button',{name:'Enter car'}).waitFor();
    await page.getByRole('button',{name:'Photo mode'}).click();
    await dialog.getByRole('slider').first().fill('4.1');
    await page.waitForTimeout(450);
    const walkingPhoto=page.waitForEvent('download');
    await dialog.getByRole('button',{name:'Download photo'}).click();
    await (await walkingPhoto).saveAs(dir+'/'+prefix+'-walking.png');
    await dialog.getByRole('button',{name:'Close panel'}).click();
    await page.getByRole('button',{name:'Settings'}).click();
    await dialog.getByLabel('Lighting',{exact:true}).selectOption('night');
    await dialog.getByRole('button',{name:'Close panel'}).click();
    await page.waitForTimeout(400);
    await page.screenshot({path:dir+'/'+prefix+'-night.png'});
    await page.goto(url+'/#recruiter');
    await page.getByRole('searchbox').waitFor();
    await page.screenshot({path:dir+'/'+prefix+'-recruiter.png'});
  }
  console.log(prefix,mobile?'mobile':'desktop',await page.title(),{errors});
  if(errors.length)process.exitCode=1;
  await context.close();
}
await browser.close();
