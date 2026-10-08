const path=require('path');const previewDir=path.resolve(__dirname,'../previews');
const assert=require('node:assert/strict'),fs=require('fs');
const {createRuntime}=require('./runtime.cjs');const r=createRuntime(),{E,run}=r,levels=Array.from({length:51},(_,n)=>E.makeLevel(n));
assert.equal(new Set(levels.map(l=>JSON.stringify(l.platforms.map(b=>[b.x,b.y,b.w,b.type])))).size,51);
for(let n=1;n<51;n++)assert(levels[n].distance>levels[n-1].distance,'Growing route '+(n+1));
assert.equal(r.elements.get('play').textContent,'Jogar');r.elements.get('play').onclick();assert(run("mode==='play'&&$('overlay').hidden"));
function clear(s){for(const k of ['hazards','enemies','machines','springs','keys','checkpoints','pads','training'])s.level[k]=[];s.pursuits=[];s.reversed=false;s.level.door={x:1e9,y:1e9,w:1,h:1};}
function stand(s,index=0){const b=s.level.platforms[index];s.p.x=b.x+b.w/2-15;s.p.y=b.y-50;s.p.vx=s.p.vy=0;s.p.ground=true;s.p.on=index;return b;}
// Landing on every spring cap produces the selected velocity and visible height.
const springHeights=[];for(const power of [660,820,1040]){const n=levels.findIndex(l=>l.springs.some(v=>v.power===power)),s=E.start(n),v=s.level.springs.find(v=>v.power===power);clear(s);s.level.springs=[v];const b=stand(s,v.platform);s.p.x=v.x-15;s.p.y=b.y-v.capHeight-50-1;s.p.vy=200;s.p.ground=false;s.p.on=-1;E.step(s,{},1/120);assert(s.sprung&&s.p.vy===-power);let top=s.p.y;for(let i=0;i<100;i++){E.step(s,{},1/120);top=Math.min(top,s.p.y);}springHeights.push(b.y-50-top);}
assert(springHeights[0]<springHeights[1]&&springHeights[1]<springHeights[2]);
// Every new floor trap has a telegraphed off interval and lethal active contact.
for(const type of ['fire','jaw']){const n=levels.findIndex(l=>l.hazards.some(h=>h.type===type)),base=E.start(n),h=base.level.hazards.find(h=>h.type===type);let active=false,inactive=false,warning=false;clear(base);base.level.hazards=[h];base.p.x=0;for(let i=0;i<650;i++){base.dead=false;E.step(base,{},1/120);active||=h.active;inactive||=!h.active;warning||=h.warning;}assert(active&&inactive&&warning,type);
 const s=E.start(n),trap=s.level.hazards.find(h=>h.type===type);clear(s);s.level.hazards=[trap];stand(s,trap.platform);s.p.x=trap.x+10;s.t=(type==='fire'?2.6:2.4)-trap.phase;E.step(s,{},1/120);assert(s.dead,type+' contact');
 const safe=E.start(n),off=safe.level.hazards.find(h=>h.type===type);clear(safe);safe.level.hazards=[off];stand(safe,off.platform);safe.p.x=off.x+10;safe.t=off.period-off.phase+.1;E.step(safe,{},1/120);assert(!safe.dead,type+' off interval');}
// Jump clears a rail saw while walking into it is lethal.
const sn=levels.findIndex(l=>l.hazards.some(h=>h.type==='saw'));
let jumpedSaw=false;for(let t=0;t<6&&!jumpedSaw;t+=.25){const s=E.start(sn),h=s.level.hazards.find(h=>h.type==='saw');clear(s);s.level.hazards=[h];const b=stand(s,h.platform);s.t=t;E.step(s,{},0);s.dead=false;s.p.x=h.x-80;s.p.vx=300;let passed=false;for(let f=0;f<100&&!s.dead;f++){E.step(s,{right:true,jump:f===0},1/120);if(s.p.x>h.x+h.r+5){passed=true;break;}}jumpedSaw=passed&&!s.dead;}assert(jumpedSaw);
// Gravity pads flip the view and restore it without changing collision coordinates.
const gn=levels.findIndex(l=>l.pads.length>=2);let gs=E.start(gn);gs.level.hazards=[];gs.level.enemies=[];gs.level.machines=[];gs.level.springs=[];for(const [i,pad] of gs.level.pads.entries()){stand(gs,pad);E.step(gs,{},1/120);assert.equal(gs.gravity,i?1:-1);}
// Original progress and IDs persist, and the new counters survive reopening.
run("metrics.springUses=100;metrics.strongSprings=25;metrics.maxStreak=10;cleanPhases=[1,51];metrics.tutorialWatched=8;checkAchievements(false);settings.quality='medium';applySettings();save()");
const r2=createRuntime(Object.fromEntries(r.storage));assert.equal(r2.run('metrics.springUses'),100);assert(r2.run("settings.quality==='medium'&&cleanPhases.includes(51)&&ACHIEVEMENTS.length===150"));
run("load(1);mode='play';state.p.x=state.level.springs[0].x-15;state.p.y=state.level.platforms[state.level.springs[0].platform].y-50;state.p.ground=true;state.p.on=state.level.springs[0].platform;update(1/120)");assert.equal(run('metrics.springUses'),101);
for(let n=44;n<51;n++){const s=E.start(n);assert.equal(s.level.checkpoints.length,[1,2,2,3,3,4,5][n-44]);for(let i=0;i<s.level.checkpoints.length;i++){stand(s,s.level.checkpoints[i].platform);E.step(s,{},1/120);assert.equal(s.checkpoint,i);assert.equal(E.respawn(s).checkpoint,i);}assert.equal(E.start(n).checkpoint,-1);}
// Settings and home-only sections still open; touch controls accept two fingers.
run("goHome();$('openAchievements').onclick()");assert(!r.elements.get('achievementsSettings').hidden);assert.equal(r.elements.get('achievementCount').textContent.split(' / ')[1],'150');
run("goHome();$('openTutorial').onclick();setTutorialStep(0)");for(let i=0;i<1700;i++)run('update(1/120)');assert.equal(run('tutorialSeen.length'),1,'The selected lesson repeats until the player chooses another');for(let topic=1;topic<8;topic++){run(`setTutorialStep(${topic})`);for(let i=0;i<850;i++)run('update(1/120)');}assert.equal(run('tutorialSeen.length'),8);
run("load(0);mode='play'");const event=id=>({pointerId:id,preventDefault(){}});r.elements.get('control-left').dispatch('pointerdown',event(1));r.elements.get('control-jump').dispatch('pointerdown',event(2));assert(run('input.left&&input.jump'));r.elements.get('control-left').dispatch('pointercancel',event(1));r.elements.get('control-jump').dispatch('pointerup',event(2));assert(run('!input.left&&!input.jump'));
run("openOptions();settings.quality='medium';applySettings()");const small=run('canvas.width*canvas.height');run("settings.quality='high';applySettings()");assert(run('canvas.width*canvas.height')>small);
// Render both styles plus object detail through the real Canvas rasterizer.
fs.mkdirSync(previewDir,{recursive:true});for(const q of ['medium','high']){run(`settings.quality='${q}';applySettings();load(10);mode='play';camX=state.level.platforms[3].x-90;camY=70;draw()`);fs.writeFileSync(path.join(previewDir,q+'.png'),r.canvas.toBuffer('image/png'));}
run("ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#536579';ctx.fillRect(0,0,960,540);camX=camY=0;for(let t=0;t<3;t++)drawSpring({x:150+t*180,y:160,tier:t,capHeight:[32,42,50][t],timer:0});state.level.platforms=[{x:120,y:350,w:300}];drawHazard({type:'saw',platform:0,x:270,y:340,r:28,amp:70,rail:true});drawHazard({type:'fire',x:550,y:350,w:48,active:true});drawHazard({type:'jaw',x:730,y:350,w:48,active:true});");fs.writeFileSync(path.join(previewDir,'objects.png'),r.canvas.toBuffer('image/png'));
console.log(JSON.stringify({passed:true,phases:51,achievements:150,springHeights:springHeights.map(Math.round),sawJump:true,floorTrapCycles:true,saveMigration:true,tutorial:8,checkpoints:true,touch:true,rendered:true},null,2));

