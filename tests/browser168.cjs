const {chromium}=require('playwright'),assert=require('assert'),fs=require('fs'),path=require('path');
(async()=>{
 const root=path.resolve(__dirname,process.env.THRONEPATH_PACKAGED?'../android-web':'../web');
 const server=require('http').createServer((req,res)=>fs.readFile(path.join(root,decodeURIComponent(req.url.split('?')[0])),(e,b)=>{res.writeHead(e?404:200);res.end(e?'':b);}));await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,executablePath:process.env.THRONEPATH_BROWSER||undefined,args:['--no-sandbox','--disable-dev-shm-usage']});const dir=path.resolve(__dirname,'../previews/browser168');fs.mkdirSync(dir,{recursive:true});
 for(const [w,h,dpr] of [[640,300,1],[640,360,1],[844,390,1.82],[1536,691,1]]){
  const page=await browser.newPage({viewport:{width:w,height:h},deviceScaleFactor:dpr,hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>localStorage.setItem('thronepath-settings-v1',JSON.stringify({layoutRevision:8,buttons:{left:{x:.085,y:.79,size:98},right:{x:.225,y:.79,size:98},jump:{x:.9,y:.79,size:112}}})));
  await page.goto('http://127.0.0.1:'+server.address().port+'/index.html',{waitUntil:'domcontentloaded'});
  assert(await page.locator('#loadingScreen').isVisible());assert.equal((await page.locator('#loadingScreen').innerText()).replace(/\s+/g,' ').trim(),'Thronepath Caminho do Trono');
  await page.screenshot({path:path.join(dir,`loading-${w}.png`)});await page.evaluate(()=>window.ThronepathReady);
  assert(await page.locator('#versionLabel').isVisible());assert.equal(await page.locator('#buildLabel').count(),0);await page.locator('#openTutorial').click();
  assert(await page.locator('#versionLabel').isHidden());assert.equal(await page.locator('#tutorialPrev,#tutorialNext,#tutorialPlay,#tutorialTopic').count(),0);
  for(let n=0;n<13;n++){
   await page.locator('#tutorialDot'+n).click();assert.equal(await page.evaluate(()=>tutorialStep),n);
   const layout=await page.evaluate(()=>{const c=$('tutorialCanvas').getBoundingClientRect(),topics=[...document.querySelectorAll('.tutorialDots button')].map(b=>{const r=b.getBoundingClientRect();return{x:r.x,y:r.y,bottom:r.bottom,right:r.right};});return{top:c.top,bottom:c.bottom,height:c.height,topics};});
   assert(layout.top>=0&&layout.height<=h*.34+1,JSON.stringify(layout));assert(layout.top<layout.bottom);
   assert(layout.topics.every(b=>b.x>=0&&b.right<=w&&b.y>=layout.bottom&&b.bottom<=h),JSON.stringify(layout));
  }
  await page.waitForTimeout(300);await page.screenshot({path:path.join(dir,`tutorial-${w}.png`)});
  await page.evaluate(()=>{goHome();play();load(9);state.t=7;draw();});await page.waitForTimeout(70);
  assert(await page.locator('#versionLabel').isHidden());
  const boxes=await page.evaluate(()=>[...document.querySelectorAll('#controls button')].map(b=>{const r=b.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height}}));assert(boxes[1].x-(boxes[0].x+boxes[0].w)>=47.9,JSON.stringify(boxes));
  assert(boxes.every(b=>b.y>h*.7));await page.screenshot({path:path.join(dir,`game-${w}.png`)});
  await page.keyboard.down('ArrowRight');await page.waitForTimeout(300);await page.keyboard.press('Space');await page.keyboard.up('ArrowRight');assert(await page.evaluate(()=>state.p.x>55));
  assert.deepEqual(errors,[]);await page.close();
 }
 await browser.close();await new Promise(r=>server.close(r));console.log('1.6.8 browser: clean loading, home-only version, 13 compact topics, removed toolbar, saved control spacing, walk and jump passed');
})().catch(e=>{console.error(e);process.exit(1)});
