const assert=require('node:assert/strict');
const {createRuntime}=require('./runtime.cjs');
const r=createRuntime(),E=r.E,levels=Array.from({length:51},(_,n)=>E.makeLevel(n));
const cases=[];function test(name,f){try{f();cases.push({name,passed:true});}catch(e){cases.push({name,passed:false,error:e.message});}}
test('150 unique achievements preserve original awards',()=>{assert.equal(r.run('ACHIEVEMENTS.length'),150);assert.equal(r.run('new Set(ACHIEVEMENTS.map(a=>a[0])).size'),150);assert.equal(r.run('ACHIEVEMENTS.find(a=>a[0]===30)[1]'),'REI DO THRONEPATH');});
test('Every phase 2–20 introduces interactive content',()=>{for(const l of levels.slice(1,20))assert(l.springs.length+l.hazards.length+l.machines.length+l.pads.length+l.platforms.filter(b=>b.type!=='solid').length>=1,'Phase '+(l.n+1));});
test('First five stages contain no hazards or enemies',()=>{for(const l of levels.slice(0,5)){assert.equal(l.hazards.length,0);assert.equal(l.machines.length,0);assert.equal(l.enemies.length,0);}});
test('Stages six to eight mix increasing hazards',()=>{assert(levels[5].hazards.length>=3);assert(levels[6].hazards.length>=4);assert(levels[7].hazards.length>=5);assert(new Set(levels[7].hazards.map(h=>h.type)).size>=3);});
test('Gravity appears before phase 20 and can return to normal',()=>assert(levels.slice(0,20).some(l=>l.pads.length>=2)));
test('Three distinguishable spring strengths',()=>{const powers=new Set(levels.flatMap(l=>l.springs.map(s=>s.power)));assert(powers.has(660)&&powers.has(820)&&powers.has(1040));});
test('Saw reaches a standing character on its support',()=>{const n=levels.findIndex(l=>l.hazards.some(h=>h.type==='saw')),s=E.start(n),h=s.level.hazards.find(h=>h.type==='saw'),b=s.level.platforms[h.platform];s.level.hazards=[h];s.level.enemies=[];s.level.machines=[];s.level.springs=[];s.p.x=b.x+b.w/2-s.p.w/2;s.p.y=b.y-s.p.h;s.p.ground=true;s.p.on=h.platform;for(let i=0;i<960&&!s.dead;i++)E.step(s,{},1/120);assert(s.dead);});
test('Fire vents and jaw traps occur in campaign',()=>{assert(levels.some(l=>l.hazards.some(h=>h.type==='fire')));assert(levels.some(l=>l.hazards.some(h=>h.type==='jaw')));});
test('All saved styles use high graphics',()=>{for(const q of ['low','medium','high']){r.run(`settings.quality='${q}';applySettings()`);assert.equal(r.run('settings.quality'),'high');assert.equal(r.run('qualityProfile().detail'),2);}});
console.log(JSON.stringify(cases,null,2));if(cases.some(c=>!c.passed))process.exitCode=1;

