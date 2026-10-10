const {chromium}=require('playwright'),assert=require('assert'),fs=require('fs'),path=require('path');
(async()=>{
 const root=path.resolve(__dirname,process.env.THRONEPATH_PACKAGED?'../android-web':'../web');
 const server=require('http').createServer((req,res)=>fs.readFile(path.join(root,decodeURIComponent(req.url.split('?')[0])),(e,b)=>{res.writeHead(e?404:200);res.end(e?'':b);}));await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});const dir=path.resolve(__dirname,'../previews/browser165');fs.mkdirSync(dir,{recursive:true});
 for(const [w,h] of [[844,390],[640,360],[1280,800]]){
  const page=await browser.newPage({viewport:{width:w,height:h},hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>localStorage.setItem('thronepath-settings-v1',JSON.stringify({quality:'low'})));
  await page.goto('http://127.0.0.1:'+server.address().port+'/index.html',{waitUntil:'domcontentloaded'});
  assert(await page.locator('#loadingScreen').isVisible());await page.waitForTimeout(700);assert(await page.locator('#loadingScreen').isVisible());
  await page.screenshot({path:path.join(dir,`loading-${w}.png`)});await page.evaluate(()=>window.ThronepathReady);assert(await page.locator('#loadingScreen').isHidden());assert.equal(await page.locator('#entryScreen').count(),0);
  assert.equal(await page.evaluate(()=>settings.quality),'high');await page.locator('#openTutorial').click();
  for(const n of [0,8,9]){await page.locator('#tutorialDot'+n).click();await page.waitForTimeout(200);await page.screenshot({path:path.join(dir,`tutorial-${w}-${n}.png`)});}
  const layout=await page.evaluate(()=>{const c=$('tutorialCanvas').getBoundingClientRect(),d=$('tutorialDot0').getBoundingClientRect();return{top:c.top,bottom:d.bottom,height:innerHeight,below:d.top>=c.bottom};});assert(layout.top>=0&&layout.below&&layout.bottom<=h,JSON.stringify(layout));
  await page.evaluate(()=>{goHome();play()});await page.keyboard.down('ArrowRight');await page.waitForTimeout(300);await page.keyboard.press('Space');await page.keyboard.up('ArrowRight');assert(await page.evaluate(()=>state.p.x>55));
  const colors=await page.evaluate(()=>[...document.querySelectorAll('#controls button')].map(b=>getComputedStyle(b).backgroundColor));for(const c of colors){const a=parseFloat(c.match(/,\s*([\d.]+)\)$/)[1]);assert(a>=.4&&a<=.65,c);}
  await page.screenshot({path:path.join(dir,`game-${w}.png`)});
  await page.evaluate(()=>notifyAchievement(ACHIEVEMENTS[0]));assert(await page.locator('#achievementToast').isVisible());await page.screenshot({path:path.join(dir,`achievement-${w}.png`)});
  assert.deepEqual(errors,[]);await page.close();
 }
 await browser.close();await new Promise(r=>server.close(r));console.log('Browser: opening delay, direct menu, fixed high quality, tutorial topics, walk/jump, controls and achievement animation passed');
})().catch(e=>{console.error(e);process.exit(1)});
