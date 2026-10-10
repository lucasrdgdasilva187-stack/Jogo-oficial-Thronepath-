const assert=require('assert');const {createRuntime,html}=require('./runtime167.cjs');
assert(!/id="(?:tutorialPrev|tutorialNext|tutorialPlay|tutorialTopic|buildLabel)"/.test(html));
const loading=html.match(/<section id="loadingScreen"[\s\S]*?<\/section>/)[0];
assert.equal(loading.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim(),'Thronepath Caminho do Trono');
const r=createRuntime({}, {touch:true,audio:true});assert.equal(r.run('GAME_VERSION'),'1.6.8');assert.equal(r.run('settings.quality'),'high');
r.run('openHomeSection("tutorialSettings")');
for(let n=0;n<13;n++){
 r.run('setTutorialStep('+n+')');let max=0,dead=false,target=false,demonstrated=false;
 for(let i=0;i<(n===2?1150:780);i++){r.run('tickTutorial(1/120)');max=Math.max(max,r.run('tutorialState.p.x'));dead ||= r.run('tutorialState.dead');target ||= r.run('tutorialState.p.on==='+ (n===2?2:1));if(n===10)demonstrated ||= r.run('tutorialState.sprung===true');if(n===11)demonstrated ||= r.run('tutorialState.level.hazards[0].active');if(n===12)demonstrated ||= r.run('tutorialState.demoJump');}
 r.run('renderTutorial()');
 if([1,2,3,8,9,10,11,12].includes(n))assert(max>650,'Tutorial must cross its obstacle: '+n);
 if(n===2||n===10)assert(target,'Tutorial must land on target platform: '+n);
 if(n>=10){assert(demonstrated,'New tutorial must demonstrate its subject: '+n);assert(!dead,'New tutorial must finish safely: '+n);}
}
const old={layoutRevision:8,buttons:{left:{x:.085,y:.79,size:98},right:{x:.225,y:.79,size:98},jump:{x:.9,y:.79,size:112}}};
assert.equal(createRuntime({'thronepath-settings-v1':JSON.stringify(old)}).run('settings.buttons.left.y'),.9);
const custom={layoutRevision:8,buttons:{left:{x:.14,y:.6,size:110},right:{x:.35,y:.6,size:110},jump:{x:.8,y:.6,size:120}}};
assert.equal(createRuntime({'thronepath-settings-v1':JSON.stringify(custom)}).run('settings.buttons.left.y'),.6);
for(const [width,height] of [[640,300],[844,390],[1536,691]]){
 const a=createRuntime({'thronepath-settings-v1':JSON.stringify(old)},{width,height,touch:true});
 for(const b of ['settings.buttons','{left:{x:.3,y:.9,size:150},right:{x:.32,y:.9,size:150},jump:{x:.92,y:.9,size:100}}']){
  const c=a.run('controlRects('+b+',innerWidth,innerHeight)');assert(c.right.x-c.right.w/2-(c.left.x+c.left.w/2)>=48-1e-6,'Directional controls must keep a touch gap');
 }
}
for(let n=0;n<51;n++)r.run('load('+n+');draw()');
console.log('1.6.8: 13 tutorials, safe new examples, saved control migration, spacing and 51 level renders passed');
