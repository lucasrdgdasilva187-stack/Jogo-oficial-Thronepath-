const assert=require('assert');const {createRuntime,html}=require('./runtime.cjs');
const r=createRuntime({'thronepath-settings-v1':JSON.stringify({quality:'low'})},{audio:true,touch:true});
assert.equal(r.run('settings.quality'),'high','Old low settings must migrate to high');
assert(!html.includes('id="entryScreen"'),'Go straight from loading to the menu');
assert(!/<select id="qualitySetting"/.test(html),'Remove quality selector');
let count=0,swings=0;
for(let n=9;n<51;n++){const s=r.E.start(n);for(const h of s.level.hazards.filter(h=>h.type==='pendulum')){
 if(h.motion!=='yo-yo'){swings++;continue;}count++;const anchor=[h.anchorX,h.anchorY];let lo=Infinity,hi=-Infinity;
 for(let t=0;t<900;t++){s.dead=false;s.won=false;s.p.x=-10000;r.E.step(s,{},1/120);assert.deepEqual([h.anchorX,h.anchorY],anchor);assert(Math.abs(h.x-h.anchorX)<.001);assert(h.y>h.anchorY+h.r);lo=Math.min(lo,h.y);hi=Math.max(hi,h.y);}assert(hi-lo>70);
}}
assert(count>=5&&swings>=5,'Keep both swinging and retracting hanging saws');
assert.equal(r.run('TUTORIAL_STEPS'),10);r.run("$('openTutorial').onclick();setTutorialStep(8)");
assert(r.run('tutorialState.level.hazards.length')>0);r.run('setTutorialStep(9)');assert(r.run('tutorialState.level.platforms[1].x-tutorialState.level.platforms[0].w')>100);
r.run("awards=[];renderAchievements()");assert(r.elements.get('achievementList').innerHTML.includes('Bloqueada'));
r.run("awards=[ACHIEVEMENTS[0][0]];renderAchievements()");assert(r.elements.get('achievementList').innerHTML.includes('Concluída'));
r.run('unlockAudio();uiClickSound(false)');assert(r.audioLog.some(x=>x.name==='frequency'));
console.log('High-only settings, direct menu, fixed yo-yo pivots, expanded tutorial, achievement states and UI audio passed');
