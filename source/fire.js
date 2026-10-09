function paintFlame(x,y,width,height){
 const rich=settings.quality==='high',t=settings.motion?clock:0;
 ctx.save();
 if(rich){const glow=ctx.createRadialGradient(x+width/2,y-28,2,x+width/2,y-28,height);glow.addColorStop(0,'#ffb46850');glow.addColorStop(1,'#ff995000');ctx.fillStyle=glow;ctx.fillRect(x-height/2,y-height,width+height,height+20);}
 for(let i=0;i<4;i++){
  const xx=x+7+i*11,hh=height-8-(Math.sin(t*14+i*2)+1)*9,sway=Math.sin(t*8+i)*4;
  ctx.beginPath();ctx.moveTo(xx-6,y-3);ctx.bezierCurveTo(xx-12,y-hh*.4,xx+9+sway,y-hh*.65,xx+sway,y-hh);ctx.bezierCurveTo(xx-4+sway,y-hh*.55,xx+12,y-hh*.3,xx+6,y-3);ctx.closePath();
  const outer=ctx.createLinearGradient(xx,y,xx,y-hh);outer.addColorStop(0,'#da4520');outer.addColorStop(.45,'#f58b35');outer.addColorStop(1,'#ffd27aa0');ctx.fillStyle=outer;ctx.fill();
  ctx.beginPath();ctx.moveTo(xx-3,y-3);ctx.bezierCurveTo(xx-6,y-hh*.3,xx+4,y-hh*.42,xx+sway*.3,y-hh*.66);ctx.bezierCurveTo(xx-1,y-hh*.35,xx+5,y-hh*.2,xx+3,y-3);ctx.closePath();ctx.fillStyle='#ffe6a7';ctx.fill();ellipse(xx,y-6,2,4,'#fff3d0');
  if(rich&&settings.particles&&settings.motion){for(let j=0;j<2;j++){const age=(t*.7+i*.23+j*.4)%1;ctx.globalAlpha=(1-age)*.7;ellipse(xx+Math.sin(age*8+i)*6,y-12-age*(height-16),1.2,2,'#ffd180');}ctx.globalAlpha=1;}
 }
 ctx.restore();
}
