function paintAdventurer(g,p,time,options={}){
 const detail=options.detail??qualityProfile().detail,seated=Boolean(options.seated),running=p.ground&&Math.abs(p.vx||0)>30&&!seated,jumping=!p.ground&&!seated,stride=running?Math.sin(p.runPhase??time*14)*Math.min(1,Math.abs(p.vx||0)/240):0;
 const {rr,line,polygon,ellipse}=canvasBrush(g);g.save();g.translate(Math.round(p.x+p.w/2),Math.round(p.y));g.scale(p.face||1,1);const landing=p.landPulse||0,launch=p.launchPulse||0;if(!seated){g.translate(0,50);g.rotate((p.lean||0)*.65*(p.face||1));g.scale(1+landing*.06-launch*.03,1-landing*.06+launch*.035);g.translate(0,-50);if(p.ground)g.translate(0,running?-Math.abs(stride)*1.2:Math.sin(time*2.2)*.45);}
 ellipse(0,51,14,seated?1.3:2.1,'#14292f32');

 const ink='#23313e',skin='#efc79d',blue='#3c819d',darkBlue='#254f68',scarf='#90674f',scarfLight='#b08765',boot='#5b4540';g.lineJoin='round';
 function limb(x,y,angle,length,color,width){g.save();g.translate(x,y);g.rotate(angle);line(0,0,0,length,ink,width+2);line(0,0,0,length,color,width);g.restore();return{x:x-Math.sin(angle)*length,y:y+Math.cos(angle)*length};}
 function arm(x,y,angle,bend){const elbow=limb(x,y,angle,6,blue,5),hand=limb(elbow.x,elbow.y,angle+bend,5,blue,4);ellipse(hand.x,hand.y,3,3,skin);}
 // Feet and backpack stay aligned to the collision body in every animation.
 rr(-16,23,9,15,3,ink);rr(-15,24,7,13,2,'#735345');if(detail===2){rr(-14,27,5,7,1,'#977359');rr(-12,28,2,2,.4,'#b5a186');line(-14,35,-10,35,'#bd987b',.7);}
 if(seated){rr(-8,37,17,6,2,ink);line(-6,39,5,42,'#334d64',5);line(5,42,7,46,boot,5);rr(4,45,9,3,1,ink);}else{
 function leg(x,angle,bend){const knee=limb(x,37,angle,5.5,'#344b60',4.5),ankle=limb(knee.x,knee.y,angle+bend,5.5,'#344b60',4);rr(ankle.x-3,ankle.y-1,8,4,1.5,ink);rr(ankle.x-2,ankle.y,6,2,1,boot);}
 leg(-5,jumping?.65:stride*.48,jumping?-.55:Math.max(0,-stride)*.32);
 leg(5,jumping?-.45:-stride*.48,jumping?.65:Math.max(0,stride)*.32);
 }
 rr(-9,22,19,17,5,ink);const cloth=detail===2?g.createLinearGradient(-8,23,8,37):blue;if(detail===2){cloth.addColorStop(0,'#589bb1');cloth.addColorStop(.55,blue);cloth.addColorStop(1,darkBlue);}rr(-8,23,17,14,4,cloth);
 const swing=jumping?(p.vy<0?1.15:.55):-stride*.55,bend=jumping?(p.vy<0?.85:.3):.12;arm(-9,26,swing,bend);arm(10,26,-swing,-bend);
 if(detail===2){rr(-4,30,11,6,2,'#39718b');line(-2,35,5,35,'#70a6b3',.6);line(-5,26,-6,33,'#73584a',2.2);line(7,26,8,32,'#73584a',2.2);line(-2,24,-2,28,'#e8dac6',.7);line(4,24,4,28,'#e8dac6',.7);}
 rr(-11,20,23,7,3,ink);rr(-10,21,21,5,3,scarf);line(-7,23,8,23,scarfLight,1);polygon([[-10,22],[-18+Math.sin(time*9)*(running?2:jumping?1.4:.35),23+Math.sin(time*6)*.45],[-16+Math.sin(time*9)*(running?2:jumping?1.4:.35),28],[-9,25]],scarf);if(detail===2)line(-14,25,-10,24,scarfLight,.8);
 ellipse(0,12,12,11,ink);ellipse(1,12,10.5,10,skin);ellipse(-10,13,3,4,skin);if(detail===2){ellipse(4,10,7,7,'#f8d7b1');ellipse(6,17,2.7,1.5,'#d9a28055');}
 // Hand-drawn spiky dark hair, inspired by the adventurer reference.
 g.fillStyle='#283444';g.strokeStyle=ink;g.lineWidth=1;g.beginPath();g.moveTo(-11,14);g.quadraticCurveTo(-15,7,-10,2);g.lineTo(-13,1);g.quadraticCurveTo(-8,-2,-6,-1);g.lineTo(-6,-5);g.quadraticCurveTo(-2,-2,3,-3);g.lineTo(7,-6);g.quadraticCurveTo(6,-2,12,0);g.lineTo(10,1);g.quadraticCurveTo(15,5,13,10);g.quadraticCurveTo(7,9,5,5);g.quadraticCurveTo(3,12,-3,12);g.lineTo(-2,8);g.quadraticCurveTo(-7,12,-8,15);g.closePath();g.fill();g.stroke();
 if(detail===2){g.strokeStyle='#49596c';g.lineWidth=1;g.beginPath();g.moveTo(-9,5);g.quadraticCurveTo(-2,-2,2,2);g.moveTo(5,0);g.quadraticCurveTo(10,2,11,6);g.moveTo(-5,5);g.quadraticCurveTo(-4,8,-6,10);g.stroke();}
 const blink=time%4.7<.12;if(blink){line(-3,13,1,13,ink,1.3);line(5,12,9,12,ink,1.3);}else{ellipse(-1,13,2.4,3.4,'#f6efe1');ellipse(7,12,2.4,3.4,'#f6efe1');ellipse(0,13,1.6,2.7,'#45667c');ellipse(8,12,1.6,2.7,'#45667c');ellipse(.5,13,1,2,ink);ellipse(8.4,12,1,2,ink);if(detail===2){ellipse(-.2,11.8,.7,.8,'#fff');ellipse(7.7,10.8,.7,.8,'#fff');line(-3,9,1,9,ink,1);line(5,8,9,8,ink,1);}}
 line(2,18,5,18,'#a07458',.8);g.restore();
}
function drawHero(){if(state.dead&&Math.floor(resetTimer*20)%2)return;paintAdventurer(ctx,{...state.p,x:state.p.x-camX,y:state.p.y-camY},clock,{detail:qualityProfile().detail,seated:mode==='ending'&&endingTime>=1.8});}
function paintCreature(g,e,time,detail=1){
 const {rr,line,polygon,ellipse}=canvasBrush(g),t=Math.sin(time*6+(e.phase||0)),dir=e.dir||1;g.save();g.translate(Math.round(e.x+e.w/2),Math.round(e.y+e.h));g.scale(dir,1);
 if(!e.alive){if(!(e.defeatedTimer>0)){g.restore();return;}g.globalAlpha=Math.min(1,e.defeatedTimer*3);g.scale(1,.28);}
 ellipse(0,-1,e.w*.45,2,'#17302440');
 const eye=(x,y)=>{ellipse(x,y,2,2.5,'#1e3037');if(detail>1)ellipse(x+.3,y-.8,.65,.7,'#f2f6dd');};
 const legs=(centers,color,short=false)=>{for(let i=0;i<centers.length;i++){const q=centers[i],step=Math.sin(time*9+i*2)*2;line(q,-9,q-5+step,short?-3:-5,color,detail?2:3);line(q-5+step,short?-3:-5,q-7+step,-1,color,detail?2:3);}};
 if(e.kind==='ant'){legs([-13,-5,4,10],'#413c2f');ellipse(-12,-13,8,7,'#33473b');ellipse(-12,-14,6,5,'#64864f');ellipse(-2,-15,6,6,'#465c3c');ellipse(11,-17,8,7,'#738d51');line(10,-22,14,-28,'#403d31',2);line(14,-28,20,-26,'#403d31',2);line(4,-23,7,-29,'#403d31',2);eye(14,-18);polygon([[17,-14],[23,-12],[18,-9],[18,-12]],'#c1aa75');if(detail>1){line(-16,-15,-10,-17,'#8eae67',1);line(-6,-16,-1,-18,'#8eae67',1);}}
 else if(e.kind==='beetle'){legs([-12,-3,8],'#705542');ellipse(-4,-13,15,11,'#584a3b');ellipse(-4,-15,13,9,'#c5ad7f');for(let i=0;i<4;i++)line(-15+i*6,-20,-14+i*6,-9,'#87704f',1.5);ellipse(13,-12,8,6,'#b39163');eye(17,-13);line(18,-8,23,-4,'#705542',2);if(detail>1)line(-13,-19,5,-20,'#eee0b5',1);}
 else if(e.kind==='centipede'){for(let i=0;i<6;i++){const x=-21+i*7,yy=-10+Math.sin(time*7+i)*1.3;line(x,yy+2,x-2+t,-1,'#78654f',2);ellipse(x,yy,5.2,6,'#776451');ellipse(x,yy-1,4.3,4.9,'#dec9a2');if(detail>1)line(x-2,yy-3,x+2,yy-3,'#f8e4bd',1);}eye(20,-11);line(21,-15,27,-19,'#a99070',1.5);line(22,-9,28,-7,'#a99070',1.5);}
 else if(e.kind==='wasp'){legs([-10,-1,9],'#354654');ellipse(-10,-11,11,6,'#344653');ellipse(-10,-12,9,4,'#598493');line(-15,-15,-14,-7,'#d3b473',2);line(-9,-16,-8,-8,'#d3b473',2);ellipse(2,-14,8,6,'#344653');ellipse(13,-15,7,6,'#4a7387');eye(16,-15);g.save();g.translate(-1,-17);g.rotate(Math.sin(time*16)*.12);ellipse(-6,-7,12,4,'#da9158d0');ellipse(1,-8,12,4,'#e5b36bc0');g.restore();line(15,-20,18,-26,'#354654',1.5);line(9,-20,12,-27,'#354654',1.5);}
 else if(e.kind==='mushroom'||e.kind==='snowshroom'){const frozen=e.kind==='snowshroom';rr(-8,-15,16,15,4,'#3c3734');rr(-6,-14,12,13,3,'#e5d5b1');rr(-15,-25,30,14,6,frozen?'#365e77':'#572f31');rr(-13,-24,26,11,5,frozen?'#79bad0':'#ae4e51');rr(-9,-22,6,4,2,frozen?'#eefbff':'#e7d7b6');rr(4,-21,5,4,2,frozen?'#eefbff':'#e7d7b6');line(-5,-1,-7-t,-1,'#5c483c',3);line(5,-1,7+t,-1,'#5c483c',3);eye(-3,-9);eye(5,-9);if(detail>1)line(-10,-23,4,-23,frozen?'#c9ebf4':'#d88572',1);}
 else if(e.kind==='snail'){rr(-16,-9,32,9,4,'#3c5256');ellipse(-6,-13,12,12,'#373038');ellipse(-6,-13,10,10,'#ad8060');g.strokeStyle='#704d40';g.lineWidth=2;g.beginPath();g.arc(-6,-13,6,0,Math.PI*1.7);g.stroke();line(9,-7,11,-17,'#3c5256',3);line(14,-7,17,-15,'#3c5256',3);ellipse(11,-18,2.8,2.8,'#dfd9ba');ellipse(17,-16,2.8,2.8,'#dfd9ba');ellipse(12,-18,1.2,1.6,'#293c46');ellipse(18,-16,1.2,1.6,'#293c46');if(detail>1)ellipse(-9,-18,3,2,'#d5a980');}
 else if(e.kind==='skull'){line(-6,-3,-8-t,0,'#ccb991',4);line(6,-3,8+t,0,'#ccb991',4);rr(-13,-25,26,22,7,'#40383c');rr(-11,-24,22,19,6,'#d7c9a4');rr(-8,-19,6,7,2,'#403947');rr(3,-19,6,7,2,'#403947');polygon([[-2,-12],[2,-12],[0,-8]],'#736556');rr(-7,-7,14,6,1,'#b6a27a');for(let q=-4;q<6;q+=4)line(q,-6,q,-2,'#76684f',1);}
 else if(e.kind==='eye'){for(let q=-11;q<14;q+=7)line(q,-9,q+t*2,-1,'#773c5e',3);ellipse(0,-16,14,12,'#613d57');ellipse(0,-16,12,10,'#d9b29e');ellipse(4,-17,6,7,'#ddd1c3');ellipse(5,-17,4,5,'#704a9b');ellipse(6,-17,2,3,'#272538');ellipse(6,-19,1,1,'#fff3df');}
 else{rr(-15,-22,30,22+t,8,'#354c35');rr(-13,-21,26,19+t,7,'#72a85a');rr(-9,-19,17,5,3,'#b1cc82');eye(-3,-10);eye(5,-10);}
 g.restore();
}
