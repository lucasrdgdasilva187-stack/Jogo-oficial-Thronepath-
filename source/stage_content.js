// Mechanics are scheduled deliberately: each early stage adds a readable lesson.
function populateCourse(n,platforms,safe,hazards,machines,springs){
 const pool=platforms.map((b,i)=>({b,i})).filter(({i})=>i>0&&i<platforms.length-1&&!safe.has(i));
 const occupied=new Set();
 function choose(fraction){const free=pool.filter(v=>!occupied.has(v.i)&&!safe.has(v.i));if(!free.length)return null;const target=Math.round(fraction*(platforms.length-1));free.sort((a,b)=>Math.abs(a.i-target)-Math.abs(b.i-target));const v=free[0];occupied.add(v.i);v.b.type='solid';v.b.ampX=v.b.ampY=0;return v;}
 function spring(fraction,tier){const v=choose(fraction);if(!v)return;const {b,i}=v;if(i+1>=platforms.length)return;occupied.add(i+1);safe.add(i+1);platforms[i+1].type='solid';platforms[i+1].ampX=platforms[i+1].ampY=0;const power=[660,820,1040][tier];springs.push({platform:i,x:b.x+b.w*.8,y:b.y,power,tier,offsetRatio:.8,targetPlatform:i+1,dir:0,timer:0,capHeight:[32,42,50][tier]});}
 function trap(fraction,type){const v=choose(fraction);if(!v)return;const {b,i}=v;
  if(type==='saw'){const radius=n<20?22:n<40?27:34;hazards.push({type,platform:i,x:b.x+b.w/2,y:b.y-10,baseX:b.x+b.w/2,baseY:b.y-10,r:radius,amp:Math.max(12,b.w/2-72),phase:0,rail:true,speed:n<20?.9:1.15,false:n>=9&&n%7===2&&hazards.length===0});}
  else if(type==='spikes')hazards.push({type,platform:i,x:b.x+b.w/2-18,y:b.y,w:36,offsetX:b.w/2-18,hidden:false,warning:0,triggered:false,pulse:true});
  else if(type==='jaw'||type==='fire')hazards.push({type,platform:i,x:b.x+b.w/2-24,y:b.y,w:48,offsetX:b.w/2-24,active:false,warning:false,phase:i*.31,period:type==='fire'?4.4:3.8});
  else if(type==='pendulum')hazards.push({type,platform:i,x:b.x+b.w/2,y:b.y-22,baseX:b.x+b.w/2,baseY:b.y-150,r:19,amp:130,phase:i});
  else if(type==='laser')machines.push({type,platform:i,x:b.x+b.w*.54,y:b.y-88,w:6,h:88,phase:i*.43,active:false,warning:false});
  else if(type==='launcher')machines.push({type,platform:i,x:b.x+b.w-18,y:b.y-31,dir:-1,period:3.8,phase:i*.71,last:-1});
 }
 if(n>=1)spring(.28,n>=10?(n%3):n>=6?1:0);
 if(n>=12)spring(.45,(n+1)%3);
 // First five stages are a demonstration. Later stages mix several encounters.
 if(n>=5){
  const kinds=n<7?['saw','spikes']:n<8?['saw','jaw','spikes']:n<14?['fire','saw','jaw','spikes']:n<24?['saw','fire','spikes','laser','jaw']:n<30?['pendulum','jaw','saw','fire','laser','spikes']:['saw','fire','jaw','laser','spikes','pendulum','launcher'];
  const target=n===5?3:n===6?4:n<10?5:Math.max(5,Math.ceil(platforms.length/3));
  const count=Math.min(target,Math.max(0,pool.length-occupied.size-2));
  for(let j=0;j<count;j++)trap(.15+.76*(j+.5)/count,kinds[(j+n)%kinds.length]);
 }
 // Guarantee at least one moving or disappearing support even on short routes.
 if(n>=2){const free=pool.filter(v=>!occupied.has(v.i));if(free.length&&!platforms.some(b=>['move','lift','diagonal'].includes(b.type))){const b=free[0].b;b.type='lift';b.ampY=28;b.phase=0;}}
 return occupied;
}

function shapeSpringRoutes(n,platforms,springs,hazards,machines){
 // Elevated landings have a clear reachable purpose for each spring strength.
 for(const s of springs.sort((a,b)=>a.platform-b.platform)){
  const source=platforms[s.platform],target=platforms[s.targetPlatform];
  const rise=[130,200,290][s.tier],gap=[54,64,80][s.tier];
  const dx=source.x+source.w+gap-target.x,dy=source.y-rise-target.y;
  for(let i=s.targetPlatform;i<platforms.length;i++){const b=platforms[i];b.x+=dx;b.baseX=b.x;b.y+=dy;b.baseY=b.y;for(const h of [...hazards,...machines])if(h.platform===i){h.x+=dx;h.y+=dy;if(Number.isFinite(h.baseX))h.baseX+=dx;if(Number.isFinite(h.baseY))h.baseY+=dy;}}
  s.x=source.x+source.w*s.offsetRatio;s.y=source.y;target.springLanding=true;
 }
}
