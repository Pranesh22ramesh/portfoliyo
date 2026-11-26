import { test, expect } from '@playwright/test';

test.beforeEach(async ({page})=> {
  await page.addInitScript(()=>{if(!localStorage.getItem('developer-world-preferences-v1'))localStorage.setItem('developer-world-preferences-v1',JSON.stringify({seenIntro:true}));});
});

test('desktop city controls, map, GPS, progress, paint and photos',async({page},info)=>{
  const errors: string[]=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',e=>{if(e.type()==='error')errors.push(e.text()+' '+e.location().url);});
  await page.goto('/');
  const world=page.getByRole('region',{name:'Developer World driving game'});
  await expect(world.locator('canvas')).toBeVisible({timeout:15000});
  await expect(world.locator('canvas')).toHaveAttribute('data-roadster','gltf',{timeout:15000});
  await expect(page.getByRole('button',{name:'Exit car'})).toBeVisible({timeout:20000});
  await world.focus();
  await page.keyboard.down('w');
  await expect(world.getByLabel(/^[1-9][0-9]* kilometres per hour$/)).toBeVisible({timeout:10000});
  await page.keyboard.up('w');
  await page.keyboard.down('Space');
  await expect(world.getByLabel('0 kilometres per hour',{exact:true})).toBeVisible();
  await page.keyboard.up('Space');
  await page.keyboard.press('f');
  await expect(world.getByRole('status')).toHaveText('On foot');
  await expect(page.getByRole('button',{name:'Enter car'})).toBeVisible();
  await page.keyboard.press('f');
  await expect(page.getByRole('button',{name:'Exit car'})).toBeVisible();
  await page.screenshot({path:info.outputPath('desktop.png')});
  await page.getByRole('button',{name:'Open city map'}).click();
  const dialog=page.getByRole('dialog');
  await dialog.getByRole('button',{name:'Project Lab',exact:true}).last().click();
  await dialog.getByRole('button',{name:'Set GPS'}).click();
  await expect(world.getByRole('button',{name:'Clear GPS'})).toBeVisible();
  await page.getByRole('button',{name:'Open city map'}).click();
  await dialog.getByRole('button',{name:'Fast travel'}).click();
  await expect(page.getByRole('button',{name:'Talk',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Talk',exact:true}).click();
  await expect(dialog.getByText('Software Developer',{exact:true})).toBeVisible();
  await dialog.getByRole('button',{name:'Close panel'}).click();
  await page.getByRole('button',{name:'Passport'}).click();
  await expect(dialog.getByText('✓ Project Explorer',{exact:true})).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Settings'}).click();
  const perf=dialog.getByTestId('world-performance');
  await expect(perf).toBeVisible();
  console.log('desktop software renderer',await perf.innerText());
  await dialog.getByLabel('Lighting',{exact:true}).selectOption('night');
  await dialog.getByRole('button',{name:'Sky blue'}).click();
  await dialog.getByRole('button',{name:'Audio off'}).click();
  await expect(dialog.getByRole('button',{name:'Audio on'})).toBeVisible();
  await dialog.getByRole('button',{name:'Audio on'}).click();
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Photo mode'}).click();
  await dialog.getByRole('slider',{name:'Camera zoom'}).fill('2.15');
  const downloaded=page.waitForEvent('download');
  await dialog.getByRole('button',{name:'Download photo'}).click();
  expect((await downloaded).suggestedFilename()).toBe('developer-world.png');
  await page.reload();
  await page.getByRole('button',{name:'Settings'}).click();
  await expect(dialog.getByLabel('Lighting',{exact:true})).toHaveValue('night');
  await expect(dialog.getByRole('button',{name:'Sky blue'})).toHaveAttribute('aria-pressed','true');
  expect(errors).toEqual([]);
});

test('in-game directory, deep links, credentials and invalid routes',async({page,request})=>{
  await page.goto('/#portfolio');
  const dialog=page.getByRole('dialog');
  await expect(dialog.getByRole('heading',{name:'Destination directory'})).toBeVisible();
  await expect(page.locator('#recruiter, .dw-recruiter')).toHaveCount(0);
  const search=dialog.getByRole('searchbox');
  await search.fill('twincord');
  await expect(dialog.getByRole('button',{name:/IT Park/})).toBeVisible();
  await expect(dialog.getByRole('button',{name:/Project Lab/})).toHaveCount(0);
  await search.fill('something-unknown');
  await expect(dialog.getByText('No matching destinations.',{exact:false})).toBeVisible();
  await search.fill('forensiq');
  await dialog.getByRole('button',{name:/Project Lab/}).click();
  const forensiq=dialog.getByRole('article').filter({has:page.getByRole('heading',{name:'ForensIQ',exact:true})});
  await forensiq.getByRole('link',{name:'Read case study'}).click();
  await expect(dialog.getByRole('heading',{name:'ForensIQ'})).toBeVisible();
  await expect(dialog.getByRole('link',{name:'View GitHub repository'})).toHaveCount(0);
  await page.goto('/#portfolio');
  await search.fill('cisco');
  await dialog.getByRole('button',{name:/Achievement Museum/}).click();
  await expect(dialog.getByRole('heading',{name:'Achievement Museum'})).toBeVisible();
  expect(new URL(page.url()).hash).toBe('#achievements');
  await page.locator('a[href="/credentials/threat-management"]').click();
  await expect(dialog.getByRole('heading',{name:'Cyber Threat Management'})).toBeVisible();
  expect(new URL(page.url()).hash).toBe('#credential/threat-management');
  await expect(dialog.getByRole('img')).toBeVisible();
  await expect(page.getByRole('link',{name:'Verify credential'})).toHaveAttribute('href',/credly\.com/);
  await page.getByRole('button',{name:'Fullscreen preview'}).click();
  await expect(page.getByRole('button',{name:'Exit fullscreen'})).toBeVisible();
  await page.getByRole('button',{name:'Exit fullscreen'}).click();
  const pdf=await request.get('/resume.pdf');
  expect((await pdf.body()).subarray(0,5).toString()).toBe('%PDF-');
  await page.goto('/projects/Certificate_Generator');
  await expect(page.getByRole('heading',{name:'Architecture'})).toBeVisible();
  await page.goto('/#research');
  await dialog.getByRole('link',{name:'Read case study'}).and(dialog.locator('a[href="/projects/api_downtime_anlyzes"]')).click();
  await expect(dialog.getByRole('heading',{name:'API Downtime Analyzer'})).toBeVisible();
  await dialog.getByRole('button',{name:'Back to destination'}).click();
  await expect(dialog.getByRole('heading',{name:'Research Center'})).toBeVisible();
  expect((await request.get('/credentials/unknown')).status()).toBe(404);
});

test('mobile touch controls and layout',async({browser},info)=>{
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,hasTouch:true,isMobile:true});
  await context.addInitScript(()=>localStorage.setItem('developer-world-preferences-v1',JSON.stringify({seenIntro:true,quality:'low'})));
  const page=await context.newPage();
  await page.goto(process.env.PLAYWRIGHT_BASE_URL??'http://127.0.0.1:3000/');
  const stick=page.getByLabel('Touch joystick');
  await expect(stick).toBeVisible({timeout:20000});
  const b=(await stick.boundingBox())!;
  const cdp=await context.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:b.x+b.width/2,y:b.y+10}]});
  await expect(page.getByLabel(/^[1-9][0-9]* kilometres per hour$/)).toBeVisible();
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await page.screenshot({path:info.outputPath('mobile.png')});
  const speed = (await page.locator('.dw-speed').boundingBox())!;
  const action = (await page.locator('.dw-game-actions').boundingBox())!;
  expect(speed.y + speed.height).toBeLessThan(action.y);
  const overflow=await page.evaluate(()=>({x:document.documentElement.scrollWidth-innerWidth,y:document.documentElement.scrollHeight-innerHeight}));
  expect(overflow).toEqual({x:0,y:0});
  await page.getByRole('button',{name:'Settings'}).click();
  console.log('mobile software renderer',await page.getByTestId('world-performance').innerText());
  await page.getByRole('button',{name:'Close panel'}).click();
  await page.goto('/#research');
  await expect(page.getByRole('dialog').getByRole('button',{name:'Enter building'})).toBeEnabled({timeout:20000});
  await page.getByRole('dialog').getByRole('button',{name:'Enter building'}).tap();
  const world=page.getByRole('region',{name:'Developer World driving game'});
  await expect(world).toHaveAttribute('data-room','research');
  await page.getByRole('button',{name:'Jump',exact:true}).tap();
  await expect(world).toHaveAttribute('data-pace','airborne');
  await page.getByRole('button',{name:'Exit building'}).tap();
  await expect(page.getByRole('button',{name:'Exit car'})).toBeVisible();
  await context.close();
});

test('WebGL unavailable keeps the in-game directory accessible',async({page})=>{
  await page.addInitScript(()=>{
    const original=HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext=function(this:HTMLCanvasElement,type:string,...args:unknown[]){
      if(type.startsWith('webgl'))return null;
      return Reflect.apply(original,this,[type,...args]);
    } as typeof original;
  });
  await page.goto('/');
  await expect(page.getByText('3D is unavailable')).toBeVisible({timeout:20000});
  await page.getByRole('button',{name:'Browse destinations'}).click();
  const dialog=page.getByRole('dialog');
  await dialog.getByRole('button',{name:/University/}).click();
  await expect(dialog).toContainText('7.12/10');
});

test('first visit intro can be skipped and context loss can recover',async({page})=>{
  await page.addInitScript(()=>localStorage.setItem('developer-world-preferences-v1',JSON.stringify({seenIntro:false})));
  await page.goto('/');
  await page.getByRole('button',{name:'Skip intro'}).click();
  await expect(page.getByRole('button',{name:'Skip intro'})).toHaveCount(0);
  await page.locator('canvas').evaluate(canvas=>{
    const gl=(canvas as HTMLCanvasElement).getContext('webgl2')!;
    gl.getExtension('WEBGL_lose_context')!.loseContext();
  });
  await expect(page.getByText('3D is unavailable')).toBeVisible();
  await page.getByRole('button',{name:'Retry 3D'}).click();
  await expect(page.getByRole('button',{name:'Exit car'})).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(1);
});

test('professional sections render with JavaScript disabled',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});
  const page=await context.newPage();
  await page.goto((process.env.PLAYWRIGHT_BASE_URL??'http://127.0.0.1:3000')+'/#contact');
  await expect(page.locator('#experience')).toContainText('JAC MediaLand');
  await expect(page.getByRole('link',{name:'Download Resume',exact:true})).toHaveAttribute('href','/resume.pdf');
  await page.locator('#contact summary').click();
  await expect(page.getByRole('link',{name:'Email Pranesh'})).toHaveAttribute('href',/^mailto:/);
  await expect(page.locator('#home a[download]')).toHaveAttribute('href','/resume.pdf');
  expect(await page.evaluate(()=>document.documentElement.scrollHeight)).toBe(await page.evaluate(()=>innerHeight));
  await expect(page.locator('canvas')).toHaveCount(0);
  await context.close();
});

test('a nearby neighbor opens their own dialogue',async({page})=>{
  await page.goto('/');
  const world=page.getByRole('region',{name:'Developer World driving game'});
  await expect(page.getByRole('button',{name:'Exit car'})).toBeVisible({timeout:20000});
  await page.getByRole('button',{name:'Open city map'}).click();
  const dialog=page.getByRole('dialog');
  await dialog.getByRole('button',{name:'Garage',exact:true}).last().click();
  await dialog.getByRole('button',{name:'Fast travel'}).click();
  await page.getByRole('button',{name:'Exit car'}).click();
  await expect(page.getByRole('button',{name:'Enter car'})).toBeVisible();
  await world.focus();
  await page.keyboard.down('w');
  const greeting=page.getByTitle('Talk to Nila');
  try {await expect(greeting).toBeVisible({timeout:10000});}
  finally {await page.keyboard.up('w');}
  await greeting.click();
  await expect(dialog.getByRole('heading',{name:'Nila'})).toBeVisible();
  await expect(dialog.getByText('Security guard',{exact:true})).toBeVisible();
});

test('viewport and overlays stay scroll-contained after resize',async({page})=>{
  await page.goto('/');
  const world=page.getByRole('region',{name:'Developer World driving game'});
  await expect(page.getByRole('button',{name:'Exit car'})).toBeVisible({timeout:20000});
  for(const [width,height] of [[1280,720],[390,844],[844,390],[320,568]]){
    await page.setViewportSize({width,height});
    const bounds=(await world.boundingBox())!;
    expect(bounds).toEqual({x:0,y:0,width,height});
    await page.evaluate(()=>window.scrollTo(800,800));
    expect(await page.evaluate(()=>[scrollX,scrollY,document.documentElement.scrollWidth,document.documentElement.scrollHeight])).toEqual([0,0,width,height]);
  }
  await page.getByRole('button',{name:'Resume',exact:true}).click();
  const dialog=page.getByRole('dialog');
  await expect(dialog.locator('iframe')).toHaveAttribute('src',/resume\.pdf/);
  const download=page.waitForEvent('download');
  await dialog.getByRole('link',{name:'Download Resume'}).click();
  expect((await download).suggestedFilename()).toBe('resume.pdf');
  await page.keyboard.press('Escape');
  await page.goto('/#experience');
  await expect(dialog.getByRole('heading',{name:'IT Park'})).toBeVisible();
  await expect(dialog.getByRole('heading',{name:'IGBC Domain Expert & Sustainability Assessor'})).toBeVisible();
  await expect(dialog).toContainText('Twincord');
  await dialog.getByRole('button',{name:'All destinations'}).click();
  await dialog.getByRole('searchbox').fill('wasd');
  await expect(world.locator('.dw-speed')).toHaveAttribute('aria-label','0 kilometres per hour');
  expect(await page.evaluate(()=>scrollY)).toBe(0);
});

test('walk, sprint, jump and explore the Garage interior',async({page},info)=>{
  await page.goto('/#garage');
  const world=page.getByRole('region',{name:'Developer World driving game'});
  const dialog=page.getByRole('dialog');
  await expect(dialog.getByRole('button',{name:'Enter building'})).toBeEnabled({timeout:25000});
  await dialog.getByRole('button',{name:'Enter building'}).click();
  await expect(world).toHaveAttribute('data-room','garage');
  await expect(page.getByText('Garage showroom',{exact:true})).toBeVisible();
  await page.screenshot({path:info.outputPath('garage-showroom.png')});
  await world.focus();
  await page.keyboard.press('Space');
  await expect(world).toHaveAttribute('data-pace','airborne');
  await expect(world).toHaveAttribute('data-pace','idle');
  await page.keyboard.down('Shift');
  await page.keyboard.down('w');
  await expect(world).toHaveAttribute('data-pace','sprint',{timeout:10000});
  await page.keyboard.up('w');
  await page.keyboard.up('Shift');
  await page.getByRole('button',{name:'Exit building'}).click();
  await expect(world).not.toHaveAttribute('data-room','garage');
  await expect(page.getByRole('button',{name:'Exit car'})).toBeVisible();
});

test('traffic renders and a phone mission can be completed and saved',async({page},info)=>{
  await page.goto('/');
  const world=page.getByRole('region',{name:'Developer World driving game'});
  const dialog=page.getByRole('dialog');
  await expect(page.getByRole('button',{name:'Exit car'})).toBeVisible({timeout:20000});
  await expect(world.locator('canvas')).toHaveAttribute('data-traffic',/^[1-9]/);
  await page.getByRole('button',{name:'Field phone',exact:true}).click();
  await expect(dialog.getByRole('heading',{name:'Field phone'})).toBeVisible();
  await page.screenshot({path:info.outputPath('field-phone.png')});
  const mission=dialog.getByRole('listitem').filter({hasText:'First build'});
  await mission.getByRole('button',{name:'Set mission GPS'}).click();
  await expect(world.getByRole('button',{name:'Clear GPS'})).toBeVisible();
  await world.getByRole('button',{name:'Clear GPS'}).click();
  await page.getByRole('button',{name:'Field phone',exact:true}).click();
  await mission.getByRole('button',{name:'Set mission GPS'}).click();
  await page.getByRole('button',{name:'Open city map'}).click();
  await dialog.getByRole('button',{name:'Project Lab',exact:true}).last().click();
  await dialog.getByRole('button',{name:'Fast travel'}).click();
  await expect(page.getByText('Mission complete: First build',{exact:true})).toBeVisible();
  await page.reload();
  await page.getByRole('button',{name:'Field phone',exact:true}).click();
  await expect(mission.getByRole('button',{name:'Completed'})).toBeDisabled();
});
