const {chromium}=require('playwright'),assert=require('assert'),fs=require('fs'),path=require('path');
(async()=>{
 const root=path.resolve(__dirname,'../android-web');
 const server=require('http').createServer((req,res)=>{const file=path.join(root,decodeURIComponent(req.url.split('?')[0]));fs.readFile(file,(e,b)=>{if(e){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',file.endsWith('.html')?'text/html':'application/octet-stream');res.end(b);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:844,height:390},hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 let release;const gate=new Promise(r=>release=r);
 await page.route('**/media/**',async route=>{await gate;await route.continue();});
 await page.goto('http://127.0.0.1:'+server.address().port+'/index.html',{waitUntil:'domcontentloaded'});
 assert(await page.locator('#loadingScreen').isVisible());assert(await page.locator('.loadingTranslation').textContent()==='Caminho do Trono');
 const dir=path.resolve(__dirname,'../previews/browser160');fs.mkdirSync(dir,{recursive:true});await page.screenshot({path:path.join(dir,'loading164.png')});
 release();await page.evaluate(()=>window.ThronepathReady);await page.waitForTimeout(350);assert(await page.locator('#loadingScreen').isHidden());
 await page.locator('#enterGame').click();await page.locator('#play').click();
 for(const quality of ['low','medium','high']){
  const values=await page.evaluate(q=>{settings.quality=q;applySettings();return [...document.querySelectorAll('#controls button')].map(b=>{b.classList.remove('pressed');const idle=getComputedStyle(b).backgroundColor;b.classList.add('pressed');const pressed=getComputedStyle(b).backgroundColor;b.classList.remove('pressed');return{idle,pressed};});},quality);
  for(const v of values){assert(parseFloat(v.idle.match(/,\s*([\d.]+)\)$/)[1])<=.20,v.idle);assert(parseFloat(v.pressed.match(/,\s*([\d.]+)\)$/)[1])<=.31,v.pressed);}
 }
 await page.screenshot({path:path.join(dir,'controls164.png')});assert.deepEqual(errors,[]);await browser.close();await new Promise(r=>server.close(r));console.log('Real browser: loading follows images, exits, play works, all control states stay transparent');
})().catch(e=>{console.error(e);process.exit(1)});
