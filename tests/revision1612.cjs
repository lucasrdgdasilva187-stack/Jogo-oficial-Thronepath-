const assert=require('assert'),{createRuntime}=require('./runtime167.cjs');let failures=0;
function test(name,fn){try{fn();console.log('PASS',name)}catch(e){failures++;console.error('FAIL',name,e.message)}}
test('Movement and a quick jump pressed during respawn survive into the new body',()=>{
 const r=createRuntime({}, {touch:true});r.run('play();state.dead=true;update(1/120)');
 const move=r.elements.get('control-right'),jump=r.elements.get('control-jump'),event={pointerId:10,preventDefault(){}};move.dispatch('pointerdown',event);jump.dispatch('pointerdown',{...event,pointerId:11});jump.dispatch('pointerup',{...event,pointerId:11});
 r.run('while(resetTimer>0)update(1/120)');const x=r.run('state.p.x');r.run('update(1/120)');assert(r.run('state.p.x')>x,'held movement was discarded at respawn');assert(r.run('state.p.vy')<0,'quick jump was discarded at respawn');move.dispatch('pointerup',event);assert.equal(r.run('input.right'),false);
});
test('A jump tap takes effect on the next physics tick without needing a click',()=>{const r=createRuntime({}, {touch:true});r.run('play()');const b=r.elements.get('control-jump'),e={pointerId:4,preventDefault(){}};b.dispatch('pointerdown',e);b.dispatch('pointerup',e);r.run('update(1/120)');assert(r.run('state.p.vy')<0);});
test('Normal and tall timed hazards coexist, and taller lasers cover the normal jump arc',()=>{const r=createRuntime();const levels=r.run('Array.from({length:51},(_,n)=>E.makeLevel(n))');const hazards=levels.flatMap(l=>l.hazards),fires=hazards.filter(h=>h.type==='fire'),spikes=hazards.filter(h=>h.type==='spikes');assert(fires.some(h=>h.flameHeight<=40));assert(fires.some(h=>h.barrier&&h.flameHeight>=145));assert(spikes.some(h=>h.barrier&&h.spikeHeight>=145&&h.pulse));assert(levels.flatMap(l=>l.machines).filter(m=>m.type==='laser').every(m=>m.h>=330&&m.w>=12));});
test('Retracted, hidden and closed spikes draw no grey hardware',()=>{const r=createRuntime();r.run("play();camX=0;camY=0;ctx.clearRect(0,0,600,600)");for(const h of [{type:'jaw',active:false,x:200,y:250,w:48},{type:'spikes',retracted:true,x:200,y:250,w:36},{type:'spikes',hidden:true,triggered:false,x:200,y:250,w:36}]){r.env.__hazard=h;r.run('drawHazard(__hazard)');assert.equal(r.run('ctx.getImageData(180,60,100,220).data.some(v=>v!==0)'),false)}});
test('Tall timed barriers block a normal jump while active and permit walking while off',()=>{const r=createRuntime(),E=r.E;
 for(const type of ['fire','spikes','laser']){
  const make=(active)=>{const s=E.start(0),b=s.level.platforms[0];s.level.hazards=[];s.level.machines=[];s.p.x=210;s.p.y=b.y-s.p.h;s.p.on=0;s.p.ground=true;
   const h={type,platform:0,x:280,y:b.y,w:48,offsetX:280,spikeHeight:150,flameHeight:150,barrier:true,pulse:true,hidden:false,phase:active?2.8:0,period:4.4};
   if(type==='laser'){Object.assign(h,{x:b.w*.54,y:b.y-340,w:14,h:340,phase:active?2.5:0});s.p.x=h.x-75;s.level.machines=[h];}else{s.level.hazards=[h];if(type==='spikes')s.t=active?1.7:0;}
   return s;};
  const on=make(true);for(let t=0;t<70&&!on.dead;t++)E.step(on,{right:true,jump:t===0},1/120);assert(on.dead,`${type}: normal jump must not clear the active barrier`);
  const off=make(false),x=off.p.x;for(let t=0;t<60;t++)E.step(off,{right:true},1/120);assert(!off.dead,`${type}: disabled barrier still killed player`);assert(off.p.x>x+120,`${type}: walking through disabled barrier failed`);
 }
});
process.exitCode=failures?1:0;
