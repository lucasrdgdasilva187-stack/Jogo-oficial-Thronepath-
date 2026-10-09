const assert=require('assert');const {createRuntime}=require('./runtime.cjs');const r=createRuntime();
const medium=r.run("particles=[];settings.particles=true;settings.quality='medium';burst(10,10,'#fff',10);particles.length");
const high=r.run("particles=[];settings.quality='high';burst(10,10,'#fff',10);particles.length");assert(high>medium,'High graphics must visibly increase emitted particles');
assert.equal(r.run("particles=[];settings.particles=false;burst(10,10,'#fff',10);particles.length"),0,'Particle opt-out must be respected');
assert.equal(r.run("particles=[];settings.particles=true;settings.quality='low';burst(10,10,'#fff',10);particles.length"),0,'Low graphics must remain light');
console.log({mediumParticles:medium,highParticles:high,particleOptOut:true});
