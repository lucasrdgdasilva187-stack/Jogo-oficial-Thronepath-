const assert=require('assert');const {createRuntime}=require('./runtime.cjs');const {E}=createRuntime();const levels=Array.from({length:51},(_,n)=>E.makeLevel(n));
function isolatedPair(n,a,b,startX,direction,time=0){
 const s=E.start(n);s.pursuits=[];s.level.platforms=[{...a,type:'solid',x:a.baseX,y:a.baseY},{...b,type:'solid',x:b.baseX,y:b.baseY}];s.level.training=[];s.level.hazards=[];s.level.enemies=[];s.level.machines=[];s.level.springs=[];s.level.keys=[];s.level.checkpoints=[];s.level.pads=[];s.level.door={x:1e8,y:1e8,w:1,h:1};s.t=time;s.reversed=false;
 s.p.x=startX;s.p.y=a.baseY-s.p.h;s.p.ground=true;s.p.on=0;s.p.vx=direction*300;
 const target=b.baseX+b.w/2-s.p.w/2;
 for(let frame=0;frame<200;frame++){const delta=target-s.p.x,movement=Math.abs(delta)<4?0:Math.sign(delta);E.step(s,{left:movement<0,right:movement>0,jump:frame===0},1/120);if(s.dead)return false;if(s.p.ground&&s.p.on===1)return true;}
 return false;
}
let testedTransitions=0;const impossible=[];
for(const l of levels)for(let i=1;i<l.platforms.length;i++){
 const a=l.platforms[i-1],b=l.platforms[i],direction=Math.sign(b.baseX+b.w/2-a.baseX-a.w/2),starts=direction>=0?[a.baseX+a.w-26,a.baseX+a.w-45,a.baseX+a.w-65,a.baseX+10,a.baseX+a.w/2-12]:[a.baseX+2,a.baseX+20,a.baseX+40,a.baseX+a.w-30,a.baseX+a.w/2-12];
 const commonStart=Math.max(a.baseX+2,Math.min(a.baseX+a.w-26,b.baseX+b.w/2-12));starts.push(commonStart);
 if(!l.springs.some(v=>v.platform===i-1&&v.targetPlatform===i)&&!starts.some(x=>isolatedPair(l.n,a,b,x,direction)))impossible.push({phase:l.n+1,from:i-1,to:i,rise:a.baseY-b.baseY,gap:Math.max(0,b.baseX-a.baseX-a.w,a.baseX-b.baseX-b.w)});testedTransitions++;
}
assert.deepEqual(impossible,[],'Each adjacent pair must have a possible normal jump: '+JSON.stringify(impossible));
let returnTransitions=0,movingTransitions=0;
function movingPair(n,a,b,time,direction){
 const s=E.start(n);s.pursuits=[];s.level.platforms=[{...a},{...b}];for(const key of ['training','hazards','enemies','machines','springs','keys','checkpoints','pads'])s.level[key]=[];s.level.door={x:1e8,y:1e8,w:1,h:1};s.reversed=false;s.t=time;s.p.on=-1;s.p.ground=false;s.p.x=-1e5;E.step(s,{},0);s.dead=false;
 const source=direction>0?s.level.platforms[0]:s.level.platforms[1],targetIndex=direction>0?1:0;
 s.p.x=direction>0?source.x+source.w-35:source.x+5;s.p.y=source.y-s.p.h;s.p.vx=direction*300;s.p.vy=0;s.p.ground=true;s.p.on=direction>0?0:1;s.p.coyote=.13;
 for(let f=0;f<180;f++){const target=s.level.platforms[targetIndex],dx=target.x+target.w/2-s.p.w/2-s.p.x,move=Math.abs(dx)<4?0:Math.sign(dx);E.step(s,{left:move<0,right:move>0,jump:f===0},1/120);if(s.dead)return false;if(s.p.ground&&s.p.on===targetIndex)return true;}
 return false;
}
for(const l of levels)for(let i=1;i<l.platforms.length;i++){
 const a=l.platforms[i-1],b=l.platforms[i],minGap=b.baseX-(b.ampX||0)-a.baseX-a.w-(a.ampX||0);
 assert(minGap>=54,'Whole movement ranges must be separated at phase '+(l.n+1)+' platform '+i);
 const starts=[b.baseX+2,b.baseX+20,b.baseX+40];assert(starts.some(x=>isolatedPair(l.n,b,a,x,-1)),'Returning across a pair must be possible at phase '+(l.n+1)+' platform '+i);returnTransitions++;
 if(a.ampX||a.ampY||b.ampX||b.ampY){for(const dir of [1,-1])assert(Array.from({length:13},(_,q)=>q*.6).some(t=>movingPair(l.n,a,b,t,dir)),'A moving platform needs a crossing window in both directions at phase '+(l.n+1)+' platform '+i);movingTransitions++;}
}

console.log(JSON.stringify({passed:true,forward:testedTransitions,returning:returnTransitions,moving:movingTransitions}));
