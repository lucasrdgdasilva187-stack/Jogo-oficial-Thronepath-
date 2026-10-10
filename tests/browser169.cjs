const {chromium}=require('playwright'),assert=require('assert'),fs=require('fs'),path=require('path');
(async()=>{
 const root=path.resolve(__dirname,process.env.THRONEPATH_PACKAGED?'../android-web':'../web');const server=require('http').createServer((req,res)=>fs.readFile(path.join(root,decodeURIComponent(req.url.split('?')[0])),(e,b)=>{res.writeHead(e?404:200);res.end(e?'':b)}));await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,executablePath:process.env.THRONEPATH_BROWSER||undefined,args:['--no-sandbox']});const dir=path.resolve(__dirname,'../previews/browser169');fs.mkdirSync(dir,{recursive:true});
 for(const [w,h] of [[640,300],[844,390],[1536,691]]){
  const page=await browser.newPage({viewport:{width:w,height:h},hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>!localStorage.getItem('porta2d-v1')&&localStorage.setItem('porta2d-v1',JSON.stringify({unlocked:49,falls:17,best:{0:25,1:38},metrics:{seconds:873,deaths:37,totalSeconds:873},playedDates:['2026-10-08','2026-10-09']})));
  await page.goto('http://127.0.0.1:'+server.address().port+'/index.html');await page.evaluate(()=>ThronepathReady);
  const buttons=await page.locator('#mainButtons button').evaluateAll(bs=>bs.map(b=>b.getBoundingClientRect().bottom));assert(buttons.every(bottom=>bottom<=h),'Menu buttons must fit');
  await page.locator('#openOptions').click();await page.locator('[data-tab="progressSettings"]').click();
  assert.equal(await page.locator('#progressDeaths').innerText(),'37');assert.equal(await page.locator('#progressDays').innerText(),'2');assert((await page.locator('#progressHours').innerText()).includes('14m'));
  assert(await page.locator('#resetAllProgress').isHidden());
  await page.screenshot({path:path.join(dir,`progress-${w}.png`)});
  await page.locator('[data-tab="hudSettings"]').click();await page.locator('#hudModeSetting').selectOption('compact');await page.locator('#phaseTimeSetting').check();await page.evaluate(()=>{goHome();play();load(9);});await page.waitForTimeout(100);
  assert(await page.locator('#phaseTimeHud').isVisible());assert(await page.evaluate(()=>{const before=phaseSeconds;update(1/120);return phaseSeconds>before}));
  await page.evaluate(()=>{window.pauseGame();openOptions();showSettingsTab('hudSettings')});await page.locator('#hudModeSetting').selectOption('hidden');await page.evaluate(()=>{goHome();play()});await page.waitForTimeout(80);assert(await page.locator('#hud').isHidden(),JSON.stringify(await page.evaluate(()=>({mode,hud:settings.hudMode,body:document.body.className,best,completions:metrics.completions}))));assert(await page.locator('#controls').isVisible());
  await page.locator('#hiddenHudMenu').click();assert.equal(await page.evaluate(()=>mode),'pause');
  await page.evaluate(()=>{openOptions();showSettingsTab('hudSettings')});assert.equal(await page.locator('#hudModeSetting').inputValue(),'hidden');await page.locator('#hudModeSetting').selectOption('compact');
  await page.evaluate(()=>{goHome();openHomeSection('achievementsSettings')});await page.locator('#achievementCategory').selectOption('Jornada');await page.locator('#achievementFilter').selectOption('pending');
  assert(await page.locator('.finalAward').count()===1);assert(await page.locator('.achievementRow.unlocked').count()===0);await page.screenshot({path:path.join(dir,`achievements-${w}.png`)});
  await page.evaluate(()=>{goHome();play();load(50);const d=state.level.door;state.p.x=d.x;state.p.y=d.y;state.won=true;finishStage();});assert.equal(await page.evaluate(()=>castleRoom),true);assert.equal(await page.evaluate(()=>awards.includes(150)),false);
  await page.evaluate(()=>{input.right=true;for(let i=0;i<450;i++){if(state.p.x>985)input.right=false;if(state.p.x>585&&state.p.ground&&state.p.on<4)queuedJump=true;update(1/120);}input.right=false;for(let i=0;i<40;i++)update(1/120);draw();});
  assert.equal(await page.evaluate(()=>state.dead),false);assert.equal(await page.evaluate(()=>throneReady()),true);assert(await page.locator('#throneAction').isVisible());await page.screenshot({path:path.join(dir,`throne-${w}.png`)});
  await page.locator('#throneAction').click();assert.equal(await page.evaluate(()=>mode),'ending');assert.equal(await page.evaluate(()=>awards.includes(150)),true);await page.evaluate(()=>updateEnding(4));assert(await page.locator('#creditsPanel').isVisible());
  assert((await page.locator('#creditsContent').innerText()).includes('Kaundeson Santos'));assert((await page.locator('#creditsSummary').innerText()).includes('JORNADA CONCLUÍDA'));
  await page.evaluate(()=>{$('creditsContent').style.animationDelay='-12s'});await page.screenshot({path:path.join(dir,`credits-${w}.png`)});
  await page.evaluate(()=>updateEnding(endingCreditsDuration+4));assert(await page.locator('#postCreditsChoices').isVisible());await page.screenshot({path:path.join(dir,`replay-${w}.png`)});
  await page.locator('#creditsBack').click();await page.locator('#openCredits').click();assert((await page.locator('#creditsContent').innerText()).includes('Lucas Coêlho'));await page.locator('#creditsBack').click();
  await page.reload();await page.evaluate(()=>ThronepathReady);assert.equal(await page.evaluate(()=>settings.showPhaseTime),true);assert.equal(await page.evaluate(()=>awards.includes(150)),true);assert.equal(await page.evaluate(()=>metrics.completions),1);
  await page.locator('#play').click();assert.equal(await page.evaluate(()=>current),0);assert.equal(await page.evaluate(()=>Object.keys(best).length),0);assert.equal(await page.evaluate(()=>awards.includes(150)),true);assert.equal(await page.evaluate(()=>metrics.deaths),37);
  await page.evaluate(()=>{window.pauseGame();openOptions();showSettingsTab('progressSettings')});assert(await page.locator('#resetAllProgress').isVisible());await page.locator('#resetAllProgress').click();assert(await page.locator('#fullResetConfirm').isVisible());await page.screenshot({path:path.join(dir,`reset-${w}.png`)});await page.locator('#cancelFullReset').click();assert.equal(await page.evaluate(()=>awards.includes(150)),true);
  await page.locator('#resetAllProgress').click();await page.locator('#confirmFullReset').click();assert.equal(await page.evaluate(()=>canResetAll()),false);assert.equal(await page.evaluate(()=>awards.length),0);assert.equal(await page.evaluate(()=>metrics.deaths),0);assert.equal(await page.evaluate(()=>metrics.totalSeconds),0);assert.equal(await page.evaluate(()=>playedDates.length),0);assert.equal(await page.evaluate(()=>settings.showPhaseTime),true);
  await page.reload();await page.evaluate(()=>ThronepathReady);assert.equal(await page.evaluate(()=>canResetAll()),false);assert.equal(await page.evaluate(()=>awards.length),0);
  assert.deepEqual(errors,[]);await page.close();
 }
 await browser.close();await new Promise(r=>server.close(r));console.log('1.6.9 browser: lifetime cards, persistent HUD settings, hidden-menu access, phase clock, achievement filters, playable stairs, throne click, full credits and reload persistence passed');
})().catch(e=>{console.error(e);process.exit(1)});
