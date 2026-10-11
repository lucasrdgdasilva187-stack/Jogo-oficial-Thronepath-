const {chromium}=require('playwright'),assert=require('assert'),fs=require('fs'),path=require('path'),http=require('http');
(async()=>{
 const root=path.resolve(__dirname,process.env.THRONEPATH_WEBSITE?'../website-dist':process.env.THRONEPATH_PACKAGED?'../android-web':'../web');
 const server=http.createServer((req,res)=>fs.readFile(path.join(root,req.url.split('?')[0]),(e,b)=>{res.writeHead(e?404:200);res.end(e?'':b)}));await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,executablePath:process.env.THRONEPATH_BROWSER||undefined,args:['--no-sandbox']});fs.mkdirSync(path.resolve(__dirname,'../previews/1613'),{recursive:true});
 for(const size of [{width:1536,height:691},{width:844,height:390},{width:844,height:300},{width:568,height:240}]){
  const page=await browser.newPage({viewport:size,hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:'+server.address().port+'/index.html');await page.evaluate(()=>ThronepathReady);
  assert.equal(await page.locator('#versionLabel').textContent(),'v1.6.13');
  const art=await page.locator('#menuArtwork').evaluate(el=>({fit:getComputedStyle(el).objectFit,box:el.getBoundingClientRect().toJSON()}));assert.equal(art.fit,'cover');assert.equal(art.box.width,size.width);assert.equal(art.box.x,0);
  for(const el of await page.locator('#mainButtons button').all()){const r=await el.boundingBox();assert(r.y>=0&&r.y+r.height<=size.height,'home button must fit viewport');}
  await page.screenshot({path:path.resolve(__dirname,`../previews/1613/home-${size.width}-${size.height}.png`)});
  await page.locator('#openOptions').click();assert.equal(await page.locator('#defaultAudio').isVisible(),false);await page.locator('[data-tab="hudSettings"]').click();
  for(const id of ['hudSetting','hudModeSetting','defaultControls','motionSetting','particlesSetting'])assert.equal(await page.locator('#'+id).isVisible(),false,id+' removed from options');
  assert.equal(await page.locator('#hudSettings input[type=range]').count(),0);
  await page.screenshot({path:path.resolve(__dirname,`../previews/1613/options-${size.width}-${size.height}.png`)});
  await page.locator('#editControls').click();await page.locator('#choose-left').click();
  for(const [id,value]of [['editSize',125],['buttonOpacitySetting',25]])await page.locator('#'+id).evaluate((el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}))},value);
  assert.equal(await page.locator('#edit-left').evaluate(el=>getComputedStyle(el).opacity),'0.25');assert.equal(await page.evaluate(()=>settings.buttons.left.size),82);await page.locator('#cancelControls').click();
  assert.equal(await page.evaluate(()=>settings.buttons.left.opacity),100);await page.locator('#editControls').click();
  await page.locator('#choose-left').click();await page.locator('#buttonVisibleSetting').uncheck();await page.locator('#choose-jump').click();
  await page.locator('#editSize').evaluate(el=>{el.value=110;el.dispatchEvent(new Event('input',{bubbles:true}))});await page.locator('#buttonOpacitySetting').evaluate(el=>{el.value=0;el.dispatchEvent(new Event('input',{bubbles:true}))});
  await page.screenshot({path:path.resolve(__dirname,`../previews/1613/editor-${size.width}-${size.height}.png`)});
  await page.locator('#saveControls').click();await page.reload();await page.evaluate(()=>ThronepathReady);assert.equal(await page.evaluate(()=>settings.buttons.left.enabled),false);assert.equal(await page.evaluate(()=>settings.buttons.jump.opacity),0);assert.equal(await page.evaluate(()=>settings.buttons.jump.size),110);
  await page.locator('#play').click();const jump=page.locator('[data-control="jump"]');assert.equal(await page.locator('[data-control="left"]').isVisible(),false);assert.equal(await jump.evaluate(el=>getComputedStyle(el).opacity),'0');
  const jr=await jump.boundingBox();await page.touchscreen.tap(jr.x+jr.width/2,jr.y+jr.height/2);await page.waitForTimeout(30);assert(await page.evaluate(()=>state.p.vy<0||!state.p.ground),'transparent jump must receive touches');
  const pause=page.locator('#hiddenHudMenu');assert(await pause.isVisible());await pause.click();assert.equal(await page.evaluate(()=>mode),'pause');
  await page.evaluate(()=>{openOptions();showSettingsTab('hudSettings')});await page.locator('#editControls').click();await page.locator('#resetControlDraft').click();await page.locator('#saveControls').click();assert.equal(await page.evaluate(()=>settings.buttons.left.enabled),true);assert.equal(await page.evaluate(()=>settings.buttons.jump.opacity),100);
  assert.deepEqual(errors,[]);console.log('PASS full-width home, simplified options, independent button editor, saved preferences and visible pause',size);await page.close();
 }
 await browser.close();await new Promise(r=>server.close(r));
})().catch(e=>{console.error(e);process.exit(1)});
