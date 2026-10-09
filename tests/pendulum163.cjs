const assert=require('assert');const {createRuntime}=require('./runtime.cjs');const r=createRuntime();
for(let n=0;n<51;n++){const l=r.E.makeLevel(n);assert(l.platforms.every(b=>b.h<=36),'Platforms should be shorter in height');}
let count=0;
for(let n=9;n<51;n++){
 const s=r.E.start(n);for(const h of s.level.hazards.filter(h=>h.type==='pendulum')){
  count++;const initial=[h.anchorX,h.anchorY];assert(initial.every(Number.isFinite),'Pendulum must start with a physical fixed pivot');
  let min=Infinity,max=-Infinity;
  for(let t=0;t<720;t++){
   s.dead=false;s.won=false;s.p.x=-10000;r.E.step(s,{},1/120);assert.deepStrictEqual([h.anchorX,h.anchorY],initial,'Pivot must never follow the moving saw');
   const rope=Math.hypot(h.x-h.anchorX,h.y-h.anchorY);assert(Math.abs(rope-h.length)<.00001,'Rope length must remain constant');min=Math.min(min,h.x);max=Math.max(max,h.x);
  }
  assert(max-min>40,'Pendulum must swing back and forth');
  assert(!s.level.platforms.some(b=>Math.abs(b.x-h.anchorX)<1&&Math.abs(b.y-h.anchorY)<1),'The pivot must not become a solid block');
 }
}
assert(count>10,'Hanging saws must occur throughout later stages');assert(r.E.makeLevel(9).hazards.some(h=>h.type==='pendulum'),'Introduce hanging saw in phase 10');
console.log('Shorter platforms; visible fixed, non-solid pendulum pivots, constant ropes and back-and-forth movement verified');
