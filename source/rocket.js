function drawRocket(r){
 const x=r.x-camX+r.w/2,y=r.y-camY+r.h/2,vertical=!!r.vy&&!r.vx;
 const length=vertical?r.h:r.w,diameter=vertical?r.w:r.h,half=length/2;
 ctx.save();ctx.translate(x,y);ctx.rotate(Math.atan2(r.vy||0,r.vx||-1));
 const metal=ctx.createLinearGradient(0,-diameter/2,0,diameter/2);metal.addColorStop(0,'#ecf4f6');metal.addColorStop(.38,'#9aafb9');metal.addColorStop(.6,'#dbe5e9');metal.addColorStop(1,'#4d6878');
 rr(-half+3,-diameter/2,length-8,diameter,diameter*.32,metal);
 polygon([[half-5,-diameter/2],[half+2,0],[half-5,diameter/2]],'#bc5550');
 polygon([[-half+8,-diameter/2+1],[-half-2,-diameter/2-4],[-half+1,-2]],'#556e83');
 polygon([[-half+8,diameter/2-1],[-half-2,diameter/2+4],[-half+1,2]],'#556e83');
 rr(-half,-diameter*.3,4,diameter*.6,1,'#293d4e');line(-half+7,-diameter*.32,half-8,-diameter*.32,'#ffffffb0',1);
 rr(half-11,-diameter/2,3,diameter,1,'#bc5550');ellipse(0,0,2.5,2.5,'#274e68');ellipse(.5,-.6,1,1,'#a9e9ff');
 const tail=8+(settings.motion?Math.sin(clock*27+r.x)*3:0);
 if(settings.quality==='high'){const glow=ctx.createRadialGradient(-half-3,0,0,-half-3,0,22);glow.addColorStop(0,'#ffae6545');glow.addColorStop(1,'#ffae6500');ctx.fillStyle=glow;ctx.fillRect(-half-25,-22,44,44);}
 polygon([[-half, -3],[-half-tail-3,0],[-half,3]],'#ee743fe0');polygon([[-half,-2],[-half-tail*.65,0],[-half,2]],'#fff2c5');
 if(settings.quality==='high'&&settings.particles&&settings.motion){for(let i=0;i<5;i++){const age=(clock*4+i*.2)%1;ctx.globalAlpha=(1-age)*.22;ellipse(-half-10-age*30,Math.sin(i+clock)*2,2+age*4,2+age*3,'#b9c2c7');}ctx.globalAlpha=1;}
 ctx.restore();
}
