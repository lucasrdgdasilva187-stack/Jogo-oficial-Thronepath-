function paintDemoButton(g,x,y,direction,pressed,keyboard=false){
 const {rr,polygon,ellipse,line}=canvasBrush(g);
 rr(x,y,72,56,15,'#7894a0');rr(x+3,y+3,66,49,12,pressed?'#416f8b':'#193c53e8');
 g.save();g.translate(x+36,y+28);g.rotate(direction==='left'?Math.PI:direction==='jump'?-Math.PI/2:0);polygon([[-13,-15],[12,0],[-13,15]],'#f3f2df');g.restore();
 if(keyboard){g.fillStyle='#dde6d8';g.font='13px sans-serif';g.textAlign='center';g.fillText(direction==='jump'?'Espaço':direction==='left'?'A / ←':'D / →',x+36,y+73);g.textAlign='start';}
 else if(pressed){
  // A complete pointing hand: index, curled fingers, thumb and cuff.
  g.save();g.translate(x+40,y+38);
  g.fillStyle='#edc9a2';g.strokeStyle='#875b46';g.lineWidth=1.5;g.beginPath();g.moveTo(-7,31);g.lineTo(-7,3);g.quadraticCurveTo(-7,-4,-2,-4);g.quadraticCurveTo(3,-4,3,3);g.lineTo(3,17);g.quadraticCurveTo(15,12,17,20);g.lineTo(18,32);g.quadraticCurveTo(18,40,11,43);g.lineTo(-3,43);g.quadraticCurveTo(-11,39,-16,29);g.quadraticCurveTo(-19,22,-14,20);g.quadraticCurveTo(-10,19,-7,25);g.closePath();g.fill();g.stroke();
  line(4,22,4,32,'#bc8f70',1);line(9,22,9,32,'#bc8f70',1);line(14,24,14,32,'#bc8f70',1);rr(-4,40,17,8,2,'#547487');g.restore();
  g.strokeStyle='#ffe5a4aa';g.lineWidth=2;g.beginPath();g.arc(x+38,y+35,15,0,Math.PI*2);g.stroke();
 }
}
function paintTutorialSaw(g,h,time){
 const {rr,line,ellipse}=canvasBrush(g);rr(h.anchorX-9,h.anchorY-5,18,9,2,'#8fa5a8');line(h.anchorX,h.anchorY,h.x,h.y,'#d7c28e',3);
 g.save();g.translate(h.x,h.y);g.rotate(time*5);g.beginPath();for(let i=0;i<36;i++){const a=i*Math.PI/18,r=h.r*(i%3===0?1:.78);g.lineTo(Math.cos(a)*r,Math.sin(a)*r);}g.closePath();g.fillStyle='#c9d9dc';g.fill();g.strokeStyle='#405b6c';g.lineWidth=2;g.stroke();ellipse(0,0,h.r*.5,h.r*.5,'#819fa9');ellipse(0,0,4,4,'#e6cb8e');g.restore();
}
