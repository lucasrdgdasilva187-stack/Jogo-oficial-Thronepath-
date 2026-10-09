const assert=require('assert'),{createRuntime}=require('./runtime.cjs');const r=createRuntime(),E=r.E;
const levels=Array.from({length:51},(_,n)=>E.makeLevel(n));
const ferries=levels.flatMap(l=>l.platforms.map((b,i)=>({l,b,i})).filter(v=>v.b.ferry));assert(ferries.length>=5,'Later stages must include long ferry rides');
const speeds=new Set(levels.flatMap(l=>l.platforms.filter(b=>b.type==='move').map(b=>b.speedX)));assert(speeds.size>=4,'Moving platforms need different speeds');
for(const {l,b,i} of ferries){
 assert(b.ampX>=180);const a=l.platforms[i-1],target=l.platforms[i+1];assert(target.baseX-a.baseX-a.w>500,'Ferry must bridge a gap that cannot be skipped');
 const s=E.start(l.n);s.pursuits=[];s.level.platforms=[{...b},{...target}];for(const k of ['training','hazards','enemies','machines','springs','keys','checkpoints','pads'])s.level[k]=[];s.level.door={x:1e8,y:1e8,w:1,h:1};s.reversed=false;s.p.x=-10000;s.p.on=-1;s.t=0;E.step(s,{},0);s.dead=false;
 const ferry=s.level.platforms[0];s.p.x=ferry.x+ferry.w-35;s.p.y=ferry.y-s.p.h;s.p.ground=true;s.p.on=0;s.p.vx=s.p.vy=0;let jumping=false,arrived=false;
 for(let frame=0;frame<3600;frame++){
  const moving=s.level.platforms[0],landing=s.level.platforms[1],gap=landing.x-moving.x-moving.w;
  const jump=!jumping&&gap<92;jumping||=jump;const dx=landing.x+landing.w/2-s.p.w/2-s.p.x;
  E.step(s,{left:jumping&&dx< -5,right:jumping&&dx>5,jump},1/120);
  assert(!s.dead,'Ferry ride must preserve support, phase '+(l.n+1));
  if(s.p.ground&&s.p.on===1){arrived=true;break;}
 }
 assert(arrived,'Ride must reach the landing, phase '+(l.n+1));
}
assert(levels.flatMap(l=>l.hazards).filter(h=>h.type==='fire').every(h=>h.flameHeight===88),'Fire visual and collision height must be reduced together');
assert.equal(r.run('settings.buttons.left.size'),76);assert.equal(r.run('settings.buttons.jump.size'),80);
assert(r.run('QUALITY_PROFILES.high.backgroundWidth / QUALITY_PROFILES.medium.backgroundWidth')>2.5);
console.log({ferries:ferries.length,speeds:[...speeds],flameHeight:88,largerButtons:true});
