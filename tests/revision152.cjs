const assert=require('assert'),{createRuntime,html}=require('./runtime.cjs');const r=createRuntime(),{E}=r;
const s=E.start(0);assert.equal(s.level.platforms.length,1);for(let t=0;t<600&&!s.won;t++)E.step(s,{right:true},1/120);assert(s.won&&!s.dead,'Village can be completed walking without jumping');
const levels=Array.from({length:51},(_,n)=>E.makeLevel(n));for(const l of levels.slice(1)){const occupied=new Set([...l.hazards,...l.machines,...l.springs,...l.enemies].map(e=>e.platform));l.springs.forEach(e=>occupied.add(e.targetPlatform));assert(l.platforms.every((b,i)=>occupied.has(i)||b.w<=240));}
assert(levels.slice(0,5).every(l=>!l.hazards.length&&!l.enemies.length));assert(levels.some(l=>l.hazards.some(h=>h.false)));assert(levels.some(l=>l.enemies.some((e,i)=>l.enemies.some((q,j)=>j!==i&&q.platform===e.platform))));assert(r.run('settings.compact&&!settings.showTime'));r.run('settings.compact=false;applySettings()');assert(!r.bodyClasses.has('compactHud'));assert(html.includes('justify-content:center;padding:0!important'));console.log('Village walking, short empty supports, grouped enemies, fake traps, compact/full HUD and centered controls verified');

assert.equal(r.elements.get('buildLabel').textContent,'v1.6.1');assert.equal(r.elements.get('versionLabel').textContent,'v1.6.1');

