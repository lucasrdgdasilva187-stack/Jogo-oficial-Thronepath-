// Pursuits belong to short marked regions. They cannot follow the player forever.
function pursuitDefinitions(n,platforms){
 const result=[];
 const add=(type,nearDoor)=>{const triggerPlatform=nearDoor?Math.max(2,platforms.length-5):Math.max(2,Math.floor(platforms.length*.62));result.push({type,triggerPlatform,launchPlatform:Math.max(0,triggerPlatform-1),endPlatform:Math.min(platforms.length-1,triggerPlatform+4),speed:type==='rocket'?170:180,duration:type==='rocket'?8:12,delay:1.2});};
 if([23,32,39,48,50].includes(n))add('rocket',n>=39);
 if([27,36,44,49,50].includes(n))add('hopper',n===49);
 return result;
}
function startPursuits(level){return(level.pursuits||[]).map(c=>({...c,x:0,y:0,w:c.type==='rocket'?28:36,h:c.type==='rocket'?14:30,triggered:false,active:false,finished:false,warning:0,life:c.duration,platform:Math.max(0,c.triggerPlatform-1),jumping:false,flight:0,jumpDuration:1,vx:0,vy:0}));}
function updatePursuits(s,dt,oldY){
 const p=s.p,l=s.level;
 for(const c of s.pursuits||[]){
  if(c.finished)continue;const marker=l.platforms[c.triggerPlatform],end=l.platforms[c.endPlatform];
  if(!marker||!end||s.won||p.x>=end.x+end.w*.65){c.finished=true;c.active=false;continue;}
  if(!c.triggered){
   if(p.x<marker.x+marker.w*.5)continue;
   c.triggered=true;c.warning=c.delay;c.platform=c.launchPlatform??Math.max(0,c.triggerPlatform-1);
   const b=l.platforms[c.platform];c.x=b.x+b.w*.55-c.w/2;c.y=b.y-c.h-(c.type==='rocket'?64:0);c.vx=c.type==='rocket'?c.speed:0;
  }
  if(c.warning>0){c.warning=Math.max(0,c.warning-dt);continue;}
  c.active=true;c.life-=dt;
  if(c.life<=0){c.finished=true;c.active=false;continue;}
  if(c.type==='rocket'){
   const dx=p.x+p.w/2-c.x-c.w/2,dy=p.y+p.h*.35-c.y-c.h/2,dist=Math.max(1,Math.hypot(dx,dy));
   const tx=c.speed*dx/dist,ty=Math.max(-c.speed*.45,Math.min(c.speed*.45,c.speed*dy/dist));
   c.vx+=Math.max(-450*dt,Math.min(450*dt,tx-c.vx));c.vy+=Math.max(-180*dt,Math.min(180*dt,ty-c.vy));
   const velocity=Math.hypot(c.vx,c.vy);if(velocity>c.speed&&velocity>0){c.vx*=c.speed/velocity;c.vy*=c.speed/velocity;}
   c.x+=c.vx*dt;c.y+=c.vy*dt;
   if(l.platforms.some(b=>b.active&&overlap(c,b))){c.finished=true;c.active=false;continue;}
  }else{
   const b=l.platforms[c.platform];if(!b||!b.active){c.finished=true;c.active=false;continue;}
   if(c.jumping){
    c.flight+=dt;const u=Math.min(1,c.flight/c.jumpDuration),target=l.platforms[c.targetPlatform];
    if(!target||!target.active){c.finished=true;c.active=false;continue;}
    c.targetX=target.x+target.w*.5-c.w/2;c.targetY=target.y-c.h;
    c.x=c.fromX+(c.targetX-c.fromX)*u;c.y=c.fromY+(c.targetY-c.fromY)*u-Math.sin(Math.PI*u)*112;
    if(u===1){c.platform=c.targetPlatform;c.x=target.x+target.w*.5-c.w/2;c.y=target.y-c.h;c.jumping=false;}
   }else{
    c.y=b.y-c.h;const direction=p.x>=c.x?1:-1,next=c.platform+direction;
    const edge=direction>0?b.x+b.w-c.w-8:b.x+8;c.x+=direction*c.speed*dt;
    c.x=Math.max(b.x+8,Math.min(b.x+b.w-c.w-8,c.x));
    if((direction>0?c.x>=edge:c.x<=edge)&&next>=Math.max(0,c.triggerPlatform-1)&&next<=c.endPlatform&&l.platforms[next].active){
     const target=l.platforms[next];c.jumping=true;c.targetPlatform=next;c.fromX=c.x;c.fromY=c.y;c.targetX=target.x+target.w*.5-c.w/2;c.targetY=target.y-c.h;c.flight=0;c.jumpDuration=Math.max(.65,Math.min(1.7,Math.abs(c.targetX-c.x)/c.speed));
    }
   }
  }
  if(c.active&&overlap(p,c)){
   if(c.type==='hopper'&&p.vy>=0&&oldY+p.h<=c.y+10){c.finished=true;c.active=false;p.y=c.y-p.h;p.vy=-300;p.ground=false;s.stomped=true;}
   else s.dead=true;
  }
 }
}
