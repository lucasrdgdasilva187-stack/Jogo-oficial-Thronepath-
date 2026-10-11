const assert=require('assert'),{createRuntime}=require('./runtime167.cjs');
const r=createRuntime({}, {touch:false});assert.equal(r.run('GAME_VERSION'),'1.6.12');
const seen=new Set();for(let n=0;n<50;n++){r.run(`load(${n});draw();update(.01)`);seen.add(r.run('biomeIndex()'));assert(r.run('Number.isFinite(state.p.x+state.p.y)'));}assert.equal(seen.size,9);
assert.equal(r.run('typeof openCredits'),'undefined');assert.equal(r.run('PLATFORM_THEMES.length'),10);assert.equal(r.run('Object.keys(journeyBackgrounds).length'),8);
r.run('play();load(50)');assert.equal(r.run('state.level.checkpoints.length'),5);assert(r.run('state.level.throneInteraction'));assert.equal(r.run('castleScene().key'),'approach');
for(const [i,key]of[[2,'distant'],[3,'near'],[4,'entrance']]){assert.equal(r.run(`state.p.x=state.level.platforms[state.level.checkpoints[${i}].platform].baseX;castleScene().key`),key);r.run('draw()');}
r.run('state.p.x=state.level.castleStart;state.p.y=state.level.castleFloor-state.p.h;state.p.ground=true');const before=r.run('state.p.x');r.run('enterCastleRoom()');assert.equal(r.run('state.p.x'),before,'Entry must not teleport the player');assert.equal(r.run('state.level.checkpoints.length'),5);assert.equal(r.run('castleScene().key'),'gallery');assert(r.elements.get('creditsPanel').hidden);
r.run('const d=state.level.door;state.p.x=d.x;state.p.y=d.y+d.h-state.p.h;state.p.ground=true;draw()');assert.equal(r.run('castleScene().key'),'throne');assert(r.run('claimThrone()'));r.run('updateEnding(4)');assert(!r.elements.get('creditsPanel').hidden);assert(r.run('awards.includes(150)'));assert(r.run('canResetAll()'));
r.run('goHome();play();load(0);draw();load(5);draw()');assert(r.run('!!sceneBlend.previous'));r.run('settings.motion=false;draw()');assert(r.run('sceneBlend.previous===null'));
console.log('1.6.12: nine environments, matching materials, continuous five-checkpoint castle route, no teleport, throne-only ending and reduced-motion transitions passed.');
