const assert=require('assert');const {createRuntime}=require('./runtime.cjs');const {E}=createRuntime();let passed=0;const failed=[];
for(let n=1;n<51;n++)for(const v of E.makeLevel(n).springs){const s=E.start(n),spring=s.level.springs.find(q=>q.platform===v.platform),source=s.level.platforms[spring.platform],target=s.level.platforms[spring.targetPlatform];
for(const k of ['hazards','enemies','machines','keys','checkpoints','pads','training'])s.level[k]=[];s.pursuits=[];s.reversed=false;s.level.door={x:1e8,y:1e8,w:1,h:1};s.level.springs=[spring];s.p.x=spring.x-80;s.p.y=source.y-50;s.p.vx=300;s.p.ground=true;s.p.on=spring.platform;let landed=false,launched=false;
for(let f=0;f<300&&!s.dead;f++){const destination=target.x+target.w*.3;E.step(s,{right:s.p.x<destination-4,left:s.p.x>destination+4},1/120);launched||=s.sprung;if(s.p.ground&&s.p.on===spring.targetPlatform){landed=true;break;}}
if(!landed||!launched)failed.push({phase:n+1,platform:spring.platform,tier:spring.tier,x:s.p.x,y:s.p.y,targetX:target.x,targetY:target.y,dead:s.dead});else passed++;
}
assert.deepEqual(failed,[]);console.log(JSON.stringify({passed:true,springDestinations:passed}));
