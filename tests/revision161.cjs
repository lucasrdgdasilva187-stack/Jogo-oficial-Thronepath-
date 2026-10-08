const assert=require('assert');
const {createRuntime}=require('./runtime.cjs');
const r=createRuntime({}, {entry:true});
assert.equal(r.elements.get('entryScreen').hidden,false);
r.run('dismissEntry()');
assert.equal(r.elements.get('entryScreen').hidden,true);
assert.equal(r.run('mode'),'menu');
for(let n=0;n<8;n++){
 r.run(`setTutorialStep(${n})`);
 assert(r.elements.get('tutorialStepLabel').textContent.startsWith(`${n+1} / 8`));
}
assert.equal(r.run('GAME_VERSION'),'1.6.1');
console.log('Opening screen, tutorial topics and version passed');
