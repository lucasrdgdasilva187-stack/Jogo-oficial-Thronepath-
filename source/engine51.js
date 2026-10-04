(function(root){
'use strict';
const W=960,H=540,SPEED=300,GRAVITY=1560,JUMP=580;
const profiles=PORTA_ROUTES.map(rows=>rows.map(row=>row.slice()));
// Different rhythm, elevations and platform widths for every added route.
const recipes=[
 'nuvncnnmnunn','nmdnuvcnnnmunn','nnbnuvnmcnnunnn','nucnmdnnvnncnnn',
 'nvnnrncndnmnunn','nmunnbncnnrvnunn','nudnvncnmnubnnnn',
 'nrcnuvndnnmbncnnn','ndnnvnrncbnnumnnn','nubncnndnvrnnmnnn',
 'numnrdncbnvnunncnn','nvncnnmdnrbnucnnnn','ndnrnuvncbnmncnnnn',
 'ncnubnrndnvmnnucnnn','nmdnrcnbnuvncnnnmnn','nuvncdnrbnmncnnbnnnn',
 'nrnmdnuvncbnnucnmnnn','ncbnuvnrdnmnncnubnnn',
 'nmdnucnrvnbnnumncnnnnn','nuvnrdncbnmnucnnbnvrnnnn',
 'nuvncnmdnrbnuvncnnnmdnvrncbnumnnnrnvncdnnmbnnuvnncrnmdnunncbnnrvnnn'
];
for(let k=0;k<recipes.length;k++){
 const n=k+30,pattern=recipes[k],route=[],seed=n*31;let x=0,y=440;
 for(let i=0;i<pattern.length;i++){
  let width=i===0||i===pattern.length-1?240:125+((i*37+seed)%70);
  if(i%6===0)width+=45;
  route.push([x,y,width,pattern[i]]);
  x+=width+58+((i*19+seed)%42);
  y=440+Math.round(Math.sin(i*(.55+k*.017)+k)*60+Math.sin(i*.23+k)*30);
 }
 profiles.push(route);
}
// Reflow the old route rhythm into one readable path. A platform and its whole
// movement range keep an open gap from both neighbours, including on the way back.
const routeLength=rows=>rows.reduce((sum,r,i)=>sum+(i?Math.hypot(r[0]+r[2]/2-rows[i-1][0]-rows[i-1][2]/2,r[1]-rows[i-1][1]):r[2]),0);
function horizontalRange(code,n){return code==='m'?(n<5?62:n<30?85:96):code==='d'?52:code==='r'?58:0;}
function verticalRange(code,n){return code==='v'?(n<20?48:62):code==='d'?30:code==='r'?24:code==='f'?18:0;}
function platformCode(n,i,code){
 if(i===0||n<2)return 'n';
 if(n<5)return i===2?'m':'n';
 if(n<10)return i%6===3?'c':i%5===2?'m':'n';
 if(n<20)return(i+n)%6===1?'m':(i+n)%6===3?'v':(i+n)%6===4?'c':'n';
 if(code!=='n'&&code!=='u')return code;
 const types=['n','m','n','c','v','n','b','n','d','n','r','n'];return types[(i+n)%types.length];
}
function placeRow(rows,n,i){
 const r=rows[i];r[2]=i===0?220:180+(n*13+i*7)%41;
 r[3]=platformCode(n,i,r[3]);
 if(i===0){r[0]=0;r[1]=440;return;}
 const a=rows[i-1];if(horizontalRange(a[3],n)&&horizontalRange(r[3],n))r[3]='n';
 const step=n<3?18:n<10?28:34;
 const direction=(Math.floor((i-1)/4)+n)%2===0?-1:1;
 r[1]=n===0?440:a[1]+direction*step;
 const baseGap=(n<10?56:68)+((i*17+n*11)%(n<10?19:29));
 r[0]=a[0]+a[2]+baseGap+horizontalRange(a[3],n)+horizontalRange(r[3],n);
}
let previousLength=0;
for(let n=0;n<profiles.length;n++){
 const rows=profiles[n];for(let i=0;i<rows.length;i++)placeRow(rows,n,i);
 const growth=n<10?140:n<20?175:n<30?205:n<40?230:260;
 const target=n===50?Math.max(previousLength*1.8,16000):Math.max(routeLength(rows),previousLength+growth);
 let length=routeLength(rows),tail=0;
 while(length<target){
  const types=n<10?['n']:n<20?['n','m','n','c']:n<30?['n','v','c','n']:['n','m','v','c','d','b','r','n'];
  rows.push([0,440,190+(n*13+tail*17)%45,types[(n+tail)%types.length]]);placeRow(rows,n,rows.length-1);tail++;length=routeLength(rows);
 }
 rows[rows.length-1][2]=Math.max(240,rows[rows.length-1][2]);rows[rows.length-1][3]='n';
 previousLength=routeLength(rows);
}
const overlap=(a,b)=>a.x+a.w>b.x&&a.x<b.x+b.w&&a.y+a.h>b.y&&a.y<b.y+b.h;
const circleHit=(p,h)=>{const x=Math.max(p.x+3,Math.min(h.x,p.x+p.w-3)),y=Math.max(p.y+3,Math.min(h.y,p.y+p.h-3));return(x-h.x)**2+(y-h.y)**2<(h.r-2)**2;};

const measuredDistances=[];
function makeLevel(n){
 n=Math.max(0,Math.min(50,n));const platforms=[],hazards=[],machines=[],springs=[],enemies=[],training=[];
 const raw=n===0?[[0,440,920,'n']]:profiles[n].map(r=>r.slice());
 raw.forEach((r,i)=>{
  const names={c:'crumble',m:'move',v:'lift',d:'diagonal',b:'blink',r:'reactive',f:'fake',s:'spring'};
  let type=names[r[3]]||'solid';
  if(n>=25&&n<30&&i>0&&i<raw.length-1&&(i+n)%9===0)type='fake';
  platforms.push({x:r[0],y:r[1],grounded:n===0,w:r[2],h:44+(i%3)*7,type,baseX:r[0],baseY:r[1],timer:-1,triggerTime:-1,active:true,phase:i*.73+n*.13,ampX:horizontalRange(r[3],n),ampY:verticalRange(r[3],n),dx:0,dy:0});
 });
 const pursuits=pursuitDefinitions(n,platforms);
 const pads=[11,15,19,24,30,36,43,48,50].includes(n)?[Math.floor(platforms.length*.3),Math.floor(platforms.length*.68)]:[];
 const keyPlatforms=n>=20?[Math.floor(platforms.length*.35),Math.floor(platforms.length*.72)]:[];
 const checkpointCount=n<44?0:[1,2,2,3,3,4,5][n-44];
 const checkpoints=Array.from({length:checkpointCount},(_,i)=>({platform:Math.floor((i+1)*platforms.length/(checkpointCount+1)),active:false,number:i+1}));
 const safe=new Set([0,platforms.length-1,...keyPlatforms,...pads,...checkpoints.map(c=>c.platform),...pursuits.flatMap(c=>[c.triggerPlatform,c.endPlatform,...(c.type==='rocket'?[c.launchPlatform]:[])])]);
 for(let i=1;i<platforms.length-1;i++)if(Math.sign(platforms[i].x-platforms[i-1].x)!==Math.sign(platforms[i+1].x-platforms[i].x))safe.add(i);
 safe.forEach(i=>{platforms[i].type='solid';platforms[i].ampX=platforms[i].ampY=0;});
 populateCourse(n,platforms,safe,hazards,machines,springs);
 // Wider platforms are reserved for encounters and spring landings.
 const occupied=new Set([...hazards,...machines,...springs].map(v=>v.platform));
 springs.forEach(v=>occupied.add(v.targetPlatform));
 for(let i=0;i<platforms.length;i++)if(occupied.has(i))platforms[i].w=Math.max(platforms[i].w,280);
 // Preserve open movement ranges after changing widths.
 for(let i=1;i<platforms.length;i++){const a=platforms[i-1],b=platforms[i];const x=a.x+a.w+60+(a.ampX||0)+(b.ampX||0);const dx=x-b.x;b.x=b.baseX=x;for(const h of [...hazards,...machines])if(h.platform===i){h.x+=dx;if(Number.isFinite(h.baseX))h.baseX+=dx;}}
 shapeSpringRoutes(n,platforms,springs,hazards,machines);
 const species=n<10?['mushroom','ant']:n<18?['snail','snowshroom']:n<26?['beetle','slime']:n<33?['snail','beetle']:n<41?['centipede','eye']:['skull','wasp','ant'];
 const eligible=platforms.map((b,i)=>({b,i})).filter(({b,i})=>i>0&&i<platforms.length-1&&!safe.has(i)&&b.type==='solid'&&b.w>=160&&!hazards.some(h=>h.platform===i)&&!machines.some(m=>m.platform===i)&&!springs.some(v=>v.platform===i));
 if(n>=5&&eligible.length)for(let j=0;j<Math.min(n>=30?2:1,eligible.length);j++){const {b,i}=eligible[(n+j*3)%eligible.length];if(enemies.some(e=>e.platform===i))continue;const kind=species[(n+j)%species.length],w=kind==='centipede'?52:kind==='ant'||kind==='beetle'?40:kind==='wasp'?38:32,h=kind==='centipede'?22:26;enemies.push({platform:i,kind,x:b.x+b.w/2-w/2,y:b.y-h,w,h,alive:true,defeatedTimer:0,phase:i,dir:j%2?-1:1,speed:22+(n%3)*3});}

 if(n>=9&&n%4===1&&enemies.length){const original=enemies[0],b=platforms[original.platform];if(b.w>=190){original.x=b.x+18;enemies.push({...original,x:b.x+b.w-original.w-18,dir:-original.dir,phase:original.phase+2});}}
 const previous=n>0?(measuredDistances[n-1]??makeLevel(n-1).distance):0;
 const minimum=n===50?previous*1.8:previous+100;
 while(n>0&&routeLength(platforms.map(b=>[b.x,b.y,b.w]))<minimum){const a=platforms[platforms.length-1],x=a.x+a.w+62+(a.ampX||0),y=a.y+(platforms.length%4<2?24:-24);platforms.push({x,y,baseX:x,baseY:y,w:180,h:44,type:'solid',grounded:false,active:true,ampX:0,ampY:0,dx:0,dy:0,timer:-1,triggerTime:-1,phase:0});}
 const last=platforms[platforms.length-1];
 const distance=routeLength(platforms.map(b=>[b.x,b.y,b.w]));measuredDistances[n]=distance;const checkpointPositions=checkpoints.map(c=>platforms[c.platform].x);
 return{n,distance,checkpointPositions,platforms,hazards,machines,springs,enemies,training,checkpoints,pursuits,pads,keys:keyPlatforms.map(i=>({platform:i,x:platforms[i].x+platforms[i].w/2,y:platforms[i].y-30,got:false})),door:{x:last.x+last.w-78,y:last.y-94,w:56,h:94},width:Math.max(...platforms.map(b=>b.x+b.w))+75,maxY:Math.max(...platforms.map(b=>b.y))+45,minY:Math.min(...platforms.map(b=>b.y))-230,inverted:n>=35&&[38,46].includes(n),reverse:n>=35&&[35,42,49].includes(n),chase:false,scroll:false};
}
function start(n){const level=makeLevel(n);return{level,p:{x:55,y:level.platforms[0].y-50,w:30,h:50,vx:0,vy:0,ground:true,on:0,face:1,coyote:.13,jumpBuffer:0},t:0,gravity:level.inverted?-1:1,reversed:level.reverse,checkpoint:-1,flippedPads:[],trail:[],rockets:[],pursuits:startPursuits(level),wall:-320,chaser:{x:-200,y:0,r:40},dead:false,won:false,boostTime:0};}
function respawn(s){
 const next=start(s.level.n);next.t=s.t;next.checkpoint=s.checkpoint;next.gravity=s.gravity;next.flippedPads=s.flippedPads.slice();
 next.level.keys.forEach((k,i)=>k.got=s.level.keys[i].got);
 if(s.checkpoint>=0){next.level.checkpoints.forEach((c,i)=>c.active=i<=s.checkpoint);const b=next.level.platforms[next.level.checkpoints[s.checkpoint].platform];next.p.x=b.x+20;next.p.y=b.y-next.p.h;next.p.ground=true;next.p.on=next.level.checkpoints[s.checkpoint].platform;}
 return next;
}
function step(s,input,dt){
 if(s.dead||s.won)return;s.t+=dt;const p=s.p,l=s.level,wasGrounded=p.ground;p.landPulse=Math.max(0,(p.landPulse||0)-dt*5);p.launchPulse=Math.max(0,(p.launchPulse||0)-dt*7);const jumpPressed=Boolean(input.jump)&&!s.jumpHeld;s.jumpHeld=Boolean(input.jump);
 for(const b of l.platforms){const px=b.x,py=b.y;
  if(b.type==='move'||b.type==='diagonal')b.x=b.baseX+Math.sin(s.t*1.1+b.phase)*b.ampX;
  if(b.type==='lift'||b.type==='diagonal')b.y=b.baseY+Math.sin(s.t*1.3+b.phase)*b.ampY;
  if(b.type==='reactive'){if(b.triggerTime>=0){b.x=b.baseX+Math.sin((s.t-b.triggerTime)*1.5)*b.ampX;b.y=b.baseY+Math.sin((s.t-b.triggerTime)*1.1)*b.ampY;}}
  if(b.type==='fake'&&!b.reveal&&Math.abs(p.x+p.w/2-b.x-b.w/2)<b.w/2+45&&Math.abs(p.y+p.h-b.y)<130){b.reveal=true;b.triggerTime=s.t;}
  if(b.type==='fake'&&b.reveal)b.y=b.baseY+18*Math.min(1,(s.t-b.triggerTime)/.5);
  if(b.type==='crumble'&&b.timer>=0){b.timer+=dt;b.active=b.timer<(l.n<20?.48:.34);if(b.timer>2.4){b.timer=-1;b.active=true;}}
  if(b.type==='blink'){const phase=(s.t+b.phase)%3.8;b.active=phase<2.9;b.blink=phase>2.45&&b.active;}
  b.dx=b.x-px;b.dy=b.y-py;
 }
 for(const v of l.training){const b=l.platforms[v.platform];v.x=b.x+b.w/2+Math.sin(s.t*1.1+v.phase)*(b.w/2-30);v.y=b.y-v.r;}
 for(const h of l.hazards){const b=l.platforms[h.platform];
  if(h.type==='saw'){h.x=b.x+b.w/2+Math.sin(s.t*(h.speed||1)+h.phase)*h.amp;h.y=b.y-10;}
  if(h.type==='pendulum'){const a=Math.sin(s.t*1.4+h.phase)*.8;h.x=b.x+b.w*.6+Math.sin(a)*h.amp;h.y=b.y-150+Math.cos(a)*h.amp;}
  if(h.type==='jaw'||h.type==='fire'){h.x=b.x+h.offsetX;h.y=b.y;const q=(s.t+h.phase)%h.period,on=h.type==='fire'?2.5:2.3;h.warning=q>=on-.7&&q<on;h.active=b.active&&q>=on&&q<on+(h.type==='fire'?1.1:.6);h.cycle=q;}
  if(h.type==='spikes'){h.x=b.x+h.offsetX;h.y=b.y;h.inactive=!b.active;const phase=(s.t+h.platform*.43)%3.2;h.retracted=h.pulse&&phase<1.6;h.pulseWarning=h.pulse&&phase>1.25&&phase<1.6;if(h.hidden&&!h.triggered&&Math.abs(p.x+p.w/2-h.x-h.w/2)<80&&Math.abs(p.y+p.h-h.y)<120){h.triggered=true;h.warning=.55;}h.warning=Math.max(0,h.warning-dt);}
 }
 for(const m of l.machines){const b=l.platforms[m.platform];
  if(m.type==='laser'){m.x=b.x+b.w*.54;m.y=b.y-88;const q=(s.t+m.phase)%3.8;m.active=q>=2.35&&q<3.45;m.warning=q>=2.05&&q<2.35;}
  else{m.x=b.x+b.w-18;m.y=b.y-31;const shot=Math.floor((s.t+m.phase)/m.period);if(shot>m.last){m.last=shot;if(s.t>1)s.rockets.push({x:m.x-10,y:m.y+6,w:22,h:10,dir:-1,speed:85,life:3.1});}}
 }
 s.rockets.forEach(r=>{r.x+=r.dir*r.speed*dt;r.life-=dt;});s.rockets=s.rockets.filter(r=>r.life>0);
 const frameX=p.x,frameY=p.y;
 if(p.ground&&p.on>=0&&l.platforms[p.on]&&l.platforms[p.on].active){p.x+=l.platforms[p.on].dx;p.y+=l.platforms[p.on].dy;}
 p.coyote-=dt;p.jumpBuffer-=dt;if(p.ground)p.coyote=.13;if(jumpPressed)p.jumpBuffer=.18;
 if(p.jumpBuffer>0&&p.coyote>0){p.vy=-JUMP;p.ground=false;p.jumpBuffer=0;p.coyote=0;p.launchPulse=1;s.jumped=true;}
 s.boostTime=Math.max(0,s.boostTime-dt);const target=((input.right?SPEED:0)-(input.left?SPEED:0))*(s.reversed?-1:1),desired=s.boostTime?target+s.boostDir*100:target,turning=desired&&p.vx&&Math.sign(desired)!==Math.sign(p.vx),accel=turning?4500:desired?(p.ground?2800:2100):(p.ground?4000:2300);p.vx+=Math.max(-accel*dt,Math.min(accel*dt,desired-p.vx));if(!desired&&Math.abs(p.vx)<3)p.vx=0;if(p.vx)p.face=Math.sign(p.vx);p.runPhase=(p.runPhase||0)+Math.abs(p.vx)*dt*.05;p.lean=(p.lean||0)+((p.vx/SPEED)*.085-(p.lean||0))*Math.min(1,dt*15);
 const oldX=p.x,oldY=p.y;p.x=Math.max(0,p.x+p.vx*dt);
 for(const b of l.platforms)if(b.active&&overlap(p,b)){const previousX=b.x-b.dx,relativeX=p.x-frameX-b.dx;if(relativeX>0&&frameX+p.w<=previousX+1){p.x=b.x-p.w;p.vx=0;}else if(relativeX<0&&frameX>=previousX+b.w-1){p.x=b.x+b.w;p.vx=0;}}
 p.vy=Math.min(950,p.vy+GRAVITY*dt);const impactSpeed=p.vy;p.y+=p.vy*dt;p.ground=false;p.on=-1;
 for(let i=0;i<l.platforms.length;i++){const b=l.platforms[i];if(!b.active||p.x+p.w<=b.x+1||p.x>=b.x+b.w-1)continue;
  const previousY=b.y-b.dy,relativeY=p.y-frameY-b.dy;
  if(relativeY>=0&&frameY+p.h<=previousY+2&&p.y+p.h>=b.y){p.y=b.y-p.h;p.vy=0;p.ground=true;p.on=i;if(b.type==='crumble'&&b.timer<0)b.timer=0;if(b.type==='reactive'&&b.triggerTime<0)b.triggerTime=s.t;}
  else if(relativeY<0&&frameY>=previousY+b.h-1&&p.y<=b.y+b.h){p.y=b.y+b.h;p.vy=0;}
 }
 if(p.ground&&!wasGrounded&&impactSpeed>80)p.landPulse=Math.min(1,impactSpeed/580);
 for(const v of l.springs){const b=l.platforms[v.platform];v.x=b.x+b.w*(v.offsetRatio||.62);v.y=b.y;v.timer=Math.max(0,v.timer-dt);const near=p.x+p.w>v.x-22&&p.x<v.x+22,cap=b.y-(v.capHeight||32),landed=p.vy>=0&&oldY+p.h<=cap+3&&p.y+p.h>=cap;
  if(b.active&&v.timer===0&&near&&(landed||(p.ground&&p.on===v.platform))){p.y=Math.min(p.y,cap-p.h);p.vy=-v.power;p.ground=false;p.on=-1;p.coyote=0;p.jumpBuffer=0;s.boostDir=v.dir;s.boostTime=.28;v.timer=.32;s.sprung=true;s.springTier=v.tier||0;}}
 for(const e of l.enemies){if(!e.alive){e.defeatedTimer=Math.max(0,(e.defeatedTimer||0)-dt);continue;}const b=l.platforms[e.platform],left=b.x+14,right=b.x+b.w-e.w-14;e.x+=e.dir*e.speed*dt;if(e.x<left){e.x=left;e.dir=1;}if(e.x>right){e.x=right;e.dir=-1;}e.y=b.y-e.h;if(overlap(p,e)){if(p.vy>=0&&oldY+p.h<=e.y+10){e.alive=false;e.defeatedTimer=.5;p.y=e.y-p.h;p.vy=-300;p.ground=false;s.stomped=true;}else s.dead=true;}}
 for(const h of l.hazards){if(h.false)continue;if(h.type==='spikes'){if(h.inactive||h.retracted||h.hidden&&(!h.triggered||h.warning>0))continue;if(overlap(p,{x:h.x+3,y:h.y-22,w:h.w-6,h:22}))s.dead=true;}else if(h.type==='jaw'||h.type==='fire'){if(h.active&&overlap(p,{x:h.x+5,y:h.y-(h.type==='fire'?70:25),w:h.w-10,h:h.type==='fire'?70:25}))s.dead=true;}else if(circleHit(p,h))s.dead=true;}
 for(const m of l.machines)if(m.type==='laser'&&m.active&&overlap(p,m))s.dead=true;
 for(const r of s.rockets)if(overlap(p,r))s.dead=true;
 updatePursuits(s,dt,oldY);
 if(p.ground&&l.pads.includes(p.on)&&!s.flippedPads.includes(p.on)){s.flippedPads.push(p.on);s.gravity*=-1;s.flipped=true;}
 for(const k of l.keys){const b=l.platforms[k.platform];k.x=b.x+b.w/2;k.y=b.y-30;if(!k.got&&overlap(p,{x:k.x-14,y:k.y-14,w:28,h:28})){k.got=true;s.picked=true;}}
 if(p.y>l.maxY+180)s.dead=true;
 if(!s.dead)l.checkpoints.forEach((c,i)=>{if(p.ground&&p.on===c.platform&&i>s.checkpoint){s.checkpoint=i;l.checkpoints.forEach((v,j)=>v.active=j<=i);s.checkpointChanged=true;}});
 if(overlap(p,l.door)&&!s.dead&&l.keys.every(k=>k.got))s.won=true;
}
root.PortaEngine={start,step,respawn,makeLevel,startPursuits,profiles,W,H};
})(typeof window!=='undefined'?window:globalThis);
