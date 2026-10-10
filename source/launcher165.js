function drawMachine(m){
 const x=m.x-camX,y=m.y-camY;
 if(m.type==='laser'){rr(x-6,y-5,18,8,2,'#4d5163');rr(x-6,y+m.h-3,18,8,2,'#4d5163');if(m.active){line(x+3,y,x+3,y+m.h,'#e271ea',9);line(x+3,y,x+3,y+m.h,'#fff3ff',3);}else{ctx.setLineDash([3,7]);line(x+3,y,x+3,y+m.h,m.warning?'#f0bf68':'#8b779c80',2);ctx.setLineDash([]);}return;}
 ctx.save();ctx.translate(x,y);
 // Bolted pedestal, pivot and reinforced steel launch tube.
 rr(-18,20,40,8,3,'#273743');rr(-14,17,32,5,2,'#a0adb1');
 for(const bx of [-10,13]){ellipse(bx,21,2,2,'#dae0d7');line(bx-1,20,bx+1,22,'#4a5b65',1);}
 polygon([[-9,18],[-5,-1],[8,-1],[14,18]],'#526b79');ellipse(2,4,10,10,'#263846');ellipse(2,4,7,7,'#bac3bf');ellipse(2,4,3,3,'#637b87');
 ctx.translate(2,4);if(m.direction==='vertical')ctx.rotate(Math.PI/2);else if(m.dir>0)ctx.rotate(Math.PI);
 const metal=ctx.createLinearGradient(0,-11,0,11);metal.addColorStop(0,'#d4dfdc');metal.addColorStop(.3,'#8fa6ad');metal.addColorStop(1,'#354e60');
 rr(-29,-10,42,20,4,metal);rr(-32,-12,7,24,2,'#566e7a');ellipse(-32,0,4,9,'#20303c');ellipse(-33,0,2,6,'#111d27');
 rr(3,-11,7,22,2,'#d6b773');line(-21,-7,-3,-7,'#edf1dc',1.5);line(-20,6,-1,6,'#536b79',2);
 for(const bx of [-19,-2]){ellipse(bx,0,2,2,'#415664');}
 rr(12,-6,7,12,2,'#263b47');ellipse(16,-2,2,2,m.warning?'#ffcf75':'#70b9ac');
 if(m.warning){ctx.globalAlpha=.3+.2*Math.sin(clock*18);ellipse(-35,0,7,10,'#ffc776');ctx.globalAlpha=1;}
 ctx.restore();
}
