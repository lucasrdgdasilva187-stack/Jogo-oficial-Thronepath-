const {chromium}=require('playwright'),assert=require('assert'),fs=require('fs'),path=require('path');
(async()=>{const browser=await chromium.launch({headless:true,args:['--no-sandbox']});const dir=path.resolve(__dirname,'../previews/browser160');fs.mkdirSync(dir,{recursive:true});const report=[];
for(const size of [[844,390],[640,360],[1280,800]]){
 const page=await browser.newPage({viewport:{width:size[0],height:size[1]},hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('file://'+path.resolve(__dirname,'../web/index.html'));await page.waitForTimeout(600);
 await page.locator('#play').click();await page.keyboard.down('ArrowRight');await page.waitForTimeout(350);await page.keyboard.press('Space');await page.waitForTimeout(200);await page.keyboard.up('ArrowRight');assert(await page.evaluate(()=>state.p.x>55));
 await page.evaluate(()=>{goHome();$('openTutorial').click()});await page.waitForTimeout(150);
 const layout=await page.evaluate(()=>{const c=$('tutorialCanvas').getBoundingClientRect(),n=$('tutorialNext').getBoundingClientRect();return {top:c.top,bottom:n.bottom,height:innerHeight,width:c.width}});await page.screenshot({path:path.join(dir,`tutorial-${size[0]}.png`)});assert(layout.top>=0&&layout.bottom<=size[1]+1,JSON.stringify(layout));
 for(const quality of ['low','medium','high']){
  await page.evaluate(q=>{settings.quality=q;applySettings();load(10);mode='play';$('overlay').hidden=true;document.body.classList.remove('homeScreen');const b=state.level.platforms[4];state.p.x=b.x+15;state.p.y=b.y-50;state.p.on=4;state.p.ground=true;camX=b.x-180;camY=b.y-330;},quality);await page.waitForTimeout(100);await page.screenshot({path:path.join(dir,`${quality}-${size[0]}.png`)});
 }
 assert.deepEqual(errors,[]);report.push({size,layout,errors});await page.close();
}
fs.writeFileSync(path.join(dir,'report.json'),JSON.stringify(report,null,2));await browser.close();console.log('Real Chromium: touch layouts, keyboard walk/jump, tutorial, all qualities passed');})().catch(e=>{console.error(e);process.exit(1)});
