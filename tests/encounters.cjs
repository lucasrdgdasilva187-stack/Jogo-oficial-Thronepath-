const assert=require('assert');const {createRuntime}=require('./runtime.cjs');const {E}=createRuntime();let checked=0;const failures=[];
for(let n=5;n<51;n++)for(const definition of E.makeLevel(n).hazards){
 let success=false;
 for(let offset=0;offset<8&&!success;offset+=.5){const s=E.start(n),h=s.level.hazards.find(v=>v.platform===definition.platform&&v.type===definition.type),b=s.level.platforms[h.platform];s.level.hazards=[h];s.level.enemies=[];s.level.machines=[];s.level.springs=[];s.level.keys=[];s.level.checkpoints=[];s.level.pads=[];s.pursuits=[];s.level.door={x:1e8,y:1e8,w:1,h:1};s.t=offset;s.reversed=false;s.p.x=b.x+18;s.p.y=b.y-50;s.p.ground=true;s.p.on=h.platform;s.p.vx=300;let jumped=false;
  for(let f=0;f<260&&!s.dead;f++){let jump=false;const distance=h.x-(s.p.x+s.p.w);if(!jumped&&distance<90&&distance>0&&s.p.ground){jump=true;jumped=true;}E.step(s,{right:true,jump},1/120);if(s.p.x>b.x+b.w-38){success=true;break;}}
 }
 if(!success)failures.push({phase:n+1,type:definition.type,platform:definition.platform});checked++;
}
assert.deepEqual(failures,[],'Isolated hazards must allow a normal jump/timing window');console.log(JSON.stringify({passed:true,isolatedHazards:checked}));
