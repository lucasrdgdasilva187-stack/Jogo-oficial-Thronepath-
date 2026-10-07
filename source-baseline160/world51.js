function drawCheckpoint(c){const b=state.level.platforms[c.platform],x=b.x+23-camX,y=b.y-camY;line(x,y,x,y-46,'#d6bb7d',3);polygon([[x+1,y-46],[x+24,y-42],[x+1,y-29]],c.active?'#79cc77':'#b4bdad');ellipse(x,y-47,3,3,'#f2dba0');if(c.active){ctx.globalAlpha=.18+Math.sin(clock*4)*.07;ellipse(x+10,y-35,28,28,'#8dda77');ctx.globalAlpha=1;}}
function drawSpring(v){
 const x=v.x-camX,y=v.y-camY;if(x<-70||x>viewW+70)return;const tier=v.tier||0,rest=v.capHeight||32,compression=v.timer>0?Math.sin(Math.min(1,v.timer/.32)*Math.PI)*.62:0,h=rest*(1-compression),cap=y-h;
 ctx.save();rr(x-23,y-5,46,6,2,'#26333d');rr(x-20,y-4,40,3,1,'#82949b');
 if(tier===2){rr(x-4,cap+6,8,h-7,2,'#728c96');rr(x-2,cap+6,3,h-7,1,'#d1e5e7');}
 ctx.lineJoin='round';ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x-14,y-6);
 for(let k=0;k<=6;k++)ctx.lineTo(x+(k%2?-15:15),y-8-(h-17)*k/6);
 ctx.strokeStyle='#263845';ctx.lineWidth=6;ctx.stroke();ctx.strokeStyle='#b4e4e9';ctx.lineWidth=3;ctx.stroke();
 rr(x-25,cap-2,50,12,3,'#282a38');rr(x-22,cap,44,8,2,tier===2?'#42484c':tier===1?'#d74d89':'#f088af');
 if(tier===2){ctx.save();ctx.beginPath();ctx.rect(x-22,cap,44,8);ctx.clip();for(let i=-22;i<30;i+=15)polygon([[x+i,cap+8],[x+i+6,cap],[x+i+13,cap],[x+i+7,cap+8]],'#efc851');ctx.restore();}else line(x-19,cap+2,x+19,cap+2,'#ffc1d7',2);
 ctx.restore();
}
function drawMachine(m){const x=m.x-camX,y=m.y-camY;if(m.type==='laser'){rr(x-6,y-5,18,8,2,'#4d5163');rr(x-6,y+m.h-3,18,8,2,'#4d5163');if(m.active){line(x+3,y,x+3,y+m.h,'#e271ea',9);line(x+3,y,x+3,y+m.h,'#fff3ff',3);}else{ctx.setLineDash([3,7]);line(x+3,y,x+3,y+m.h,m.warning?'#f0bf68':'#8b779c80',2);ctx.setLineDash([]);}}else{rr(x-12,y-3,25,26,4,'#313f49');rr(x-18,y+3,28,10,2,'#75848c');ellipse(x-18,y+8,4,4,'#2b2331');line(x+1,y+21,x+9,y+21,'#d6b471',2);}}
function drawRocket(r){const x=r.x-camX,y=r.y-camY;polygon([[x,y+5],[x+7,y],[x+r.w,y],[x+r.w,y+10],[x+7,y+10]],'#3b4759');rr(x+7,y+2,14,6,1,'#d5bb89');polygon([[x+r.w,y+2],[x+r.w+9+Math.sin(clock*23)*3,y+5],[x+r.w,y+8]],'#e5a065');}
function drawPursuit(c){
 if(c.type==='rocket'){const launch=state.level.platforms[c.launchPlatform];if(launch){const x=launch.x+launch.w*.55-camX,y=launch.y-camY;line(x,y,x,y-76,'#394b54',7);rr(x-18,y-85,36,22,4,'#344550');rr(x-13,y-80,35,10,2,'#a8b6b9');ellipse(x+22,y-75,4,5,'#1e2c36');rr(x-7,y-89,8,4,1,c.triggered&&!c.finished?'#f2bb65':'#b4cdd1');}}
 if(c.finished)return;const b=state.level.platforms[c.triggerPlatform];if(!b)return;
 if(!c.active){const x=b.x+b.w*.5-camX,y=b.y-68-camY;if(x<-30||x>viewW+30)return;const flashing=c.triggered?Math.sin(clock*14)*.25+.75:.65;ctx.save();ctx.globalAlpha=flashing;line(x,b.y-camY,x,y+7,'#655446',3);polygon([[x,y-15],[x-14,y+10],[x+14,y+10]],'#493b39');polygon([[x,y-11],[x-10,y+7],[x+10,y+7]],c.triggered?'#f5b45e':'#ccb783');rr(x-1.5,y-5,3,7,1,'#4a3230');ellipse(x,y+4,1.5,1.5,'#4a3230');ctx.restore();return;}
 if(c.x+c.w<camX-40||c.x>camX+viewW+40)return;
 if(c.type==='rocket'){ctx.save();if(c.vx>0){ctx.translate((c.x-camX)*2+c.w,0);ctx.scale(-1,1);}drawRocket(c);ctx.restore();}
 else paintCreature(ctx,{...c,x:c.x-camX,y:c.y-camY,kind:'mushroom',dir:state.p.x>=c.x?1:-1,alive:true,phase:0},clock,qualityProfile().detail);
}
function drawThrone(){const d=state.level.door,x=d.x-camX,y=d.y-camY;rr(x-7,y+8,d.w+14,d.h-4,5,'#4a2e28');rr(x-4,y+10,d.w+8,d.h-8,4,'#c0923c');rr(x+5,y+18,d.w-10,d.h-25,4,'#a93249');polygon([[x-4,y+12],[x+7,y-3],[x+15,y+7],[x+d.w/2,y-14],[x+d.w-15,y+7],[x+d.w-7,y-3],[x+d.w+4,y+12]],'#e2bb5c');rr(x-10,y+58,d.w+20,11,3,'#e1b65c');rr(x+2,y+62,d.w-4,12,3,'#bf3c51');for(const q of [7,d.w-7])rr(x+q-3,y+72,6,23,2,'#b98a39');ellipse(x+d.w/2,y+11,4,5,'#bd2e4d');}
function drawEnemy(e){if(!e.alive&&!(e.defeatedTimer>0))return;const x=e.x-camX,y=e.y-camY;if(x+e.w<-30||x>viewW+30)return;paintCreature(ctx,{...e,x,y},clock,qualityProfile().detail);}

const originalHazard=drawHazard;
function drawMount(x,y){rr(x-9,y-6,18,9,2,'#30434d');rr(x-7,y-5,14,5,1,'#9babb0');ellipse(x-5,y-2,1.5,1.5,'#e2e8de');ellipse(x+5,y-2,1.5,1.5,'#e2e8de');ellipse(x,y+4,4,4,'#465b66');ellipse(x,y+4,2,2,'#c5d1cd');}
drawHazard=function(h){
 if(h.type==='saw'){
  const b=state.level.platforms[h.platform],x=h.x-camX,y=h.y-camY,mx=b.x+b.w*.55-camX,my=b.y-150-h.amp-h.r-camY;
  if(x<-100||x>viewW+100)return;ctx.save();if(h.false)ctx.globalAlpha=.55;
  if(h.rail){const cy=b.y-camY+2,left=b.x+b.w/2-h.amp-camX,right=b.x+b.w/2+h.amp-camX;line(left,cy,right,cy,'#22313a',8);line(left,cy,right,cy,'#879da6',3);drawMount(left,cy-4);drawMount(right,cy-4);}else{line(mx,my+4,x,y,'#263c47',3);line(mx+1,my+5,x+1,y,'#a7b9b8',1);drawMount(mx,my);}
  ctx.translate(x,y);ctx.rotate(clock*4);ctx.beginPath();for(let i=0;i<36;i++){const a=i*Math.PI/18,r=h.r*(i%3===0?1:.79);ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();ctx.fillStyle='#d0dadd';ctx.fill();ctx.strokeStyle='#384c58';ctx.lineWidth=2;ctx.stroke();ellipse(0,0,h.r*.61,h.r*.61,'#859aa7');ellipse(0,0,h.r*.51,h.r*.51,'#afbec3');for(let i=0;i<4;i++){const a=i*Math.PI/2;line(Math.cos(a)*h.r*.23,Math.sin(a)*h.r*.23,Math.cos(a+.28)*h.r*.49,Math.sin(a+.28)*h.r*.49,'#526b79',2);}ellipse(0,0,5,5,'#b4a178');ellipse(0,0,2,2,'#354751');ctx.restore();return;
 }
 if(h.type==='pendulum'){const b=state.level.platforms[h.platform],x=b.x+b.w*.6-camX,y=b.y-165-camY;line(x,y,h.x-camX,h.y-camY,'#30444f',4);line(x+1,y,h.x-camX+1,h.y-camY,'#a5b5b8',1);drawMount(x,y-4);ellipse(h.x-camX,h.y-camY,h.r,h.r,'#39424b');ellipse(h.x-camX-4,h.y-camY-4,h.r-6,h.r-6,'#a4aeb4');return;}
 if(h.type==='fire'||h.type==='jaw'){
  const x=h.x-camX,y=h.y-camY;if(x+h.w<-50||x>viewW+50)return;
  rr(x-2,y-5,h.w+4,7,2,'#293842');rr(x+2,y-4,h.w-4,3,1,h.warning?'#e9b464':'#93a5aa');
  if(h.type==='fire'){
   for(let i=0;i<4;i++){ellipse(x+7+i*11,y-2,3,2,'#1c2733');if(h.warning){ellipse(x+7+i*11,y-8-Math.sin(clock*13+i)*3,2,3,'#f4c06c');}}
   if(h.active)for(let i=0;i<4;i++){const xx=x+7+i*11,tip=y-58-Math.sin(clock*18+i)*8;polygon([[xx-6,y-4],[xx-9,y-25],[xx,tip],[xx+7,y-29],[xx+6,y-4]],'#e87645');polygon([[xx-3,y-5],[xx-4,y-23],[xx,tip+17],[xx+4,y-18],[xx+3,y-5]],'#ffeab0');}
  }else{
   const lift=h.active?23:h.warning?5+Math.sin(clock*18)*2:4;
   polygon([[x+1,y-4],[x+4,y-lift-5],[x+23,y-6],[x+44,y-lift-5],[x+47,y-4]],'#b4c6cd');
   for(let i=0;i<4;i++){const xx=x+5+i*10;polygon([[xx,y-6],[xx+4,y-lift-9],[xx+8,y-6]],'#dce8e8');}
   ellipse(x+24,y-3,5,4,'#405663');ellipse(x+24,y-3,2,2,'#d7c291');
  }return;
 }
 originalHazard(h);
};
function drawTraining(v){const x=v.x-camX,y=v.y-camY;if(x<-25||x>viewW+25)return;ellipse(x,y,v.r,v.r,'#295c69');ellipse(x-1,y-1,v.r-2,v.r-2,'#67b9bd');ellipse(x-4,y-5,4,3,'#d0ebd4');line(x-6,y+5,x+5,y+5,'#39898d',2);}
