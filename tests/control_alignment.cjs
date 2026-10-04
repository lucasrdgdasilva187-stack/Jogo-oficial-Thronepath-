const assert=require('assert');const {createRuntime}=require('./runtime.cjs');
const legacy={left:{x:.075,y:.82,size:64},right:{x:.19,y:.82,size:64},jump:{x:.92,y:.76,size:64}};
for(const saved of [null,{layoutRevision:3,buttons:legacy}]){const r=createRuntime(saved?{'thronepath-settings-v1':JSON.stringify(saved)}:{});for(const [w,h] of [[960,540],[740,360],[1600,720]]){const b=r.run(`controlRects(settings.buttons,${w},${h})`);assert.equal(b.jump.y,b.left.y);assert.equal(b.right.y,b.left.y);}}
const custom=JSON.parse(JSON.stringify(legacy));custom.jump.y=.68;const r=createRuntime({'thronepath-settings-v1':JSON.stringify({layoutRevision:3,buttons:custom})});assert.equal(r.run('settings.buttons.jump.y'),.68);console.log('Default and legacy controls aligned; custom placement preserved');
