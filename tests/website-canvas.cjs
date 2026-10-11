'use strict';
const assert=require('assert'),{createRuntime}=require('./runtime167.cjs');
for(const [width,height,visibleHeight] of [[1536,864,691],[844,390,300],[390,844,720]]){
 const r=createRuntime({}, {width,height,touch:true,beforeScripts(env){env.ThronepathViewport={width,height:visibleHeight};}});
 assert.deepEqual(Array.from(r.run('[vw,vh]')),[width,visibleHeight],'canvas must use the visible viewport, including browser bars');
 const saved=r.storage.get('thronepath-settings-v1');
 r.env.ThronepathViewport.height=visibleHeight-32;r.run('resize()');
 assert.equal(r.run('vh'),visibleHeight-32);assert.equal(r.storage.get('thronepath-settings-v1'),saved,'resizing must not change saved preferences');
 for(const rect of Object.values(r.run('controlRects(settings.buttons,'+(width-24)+','+(visibleHeight-24)+')'))){assert(rect.x-rect.w/2>=0);assert(rect.y-rect.h/2>=0);assert(rect.x+rect.w/2<=width-24);assert(rect.y+rect.h/2<=visibleHeight-24)}
 console.log('PASS game canvas and control boundaries',width,height,visibleHeight);
}
