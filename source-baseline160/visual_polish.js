const PLATFORM_THEMES=[
  {edge:'#273b31',body:'#627063',rock:'#8a9380',shade:'#48554b',cap:'#769449',shine:'#b8c58c'},
  {edge:'#5b3927',body:'#b27d4d',rock:'#d3a268',shade:'#875738',cap:'#e1b477',shine:'#f1d4a0'},
  {edge:'#293b49',body:'#5d6d76',rock:'#84939b',shade:'#455761',cap:'#819996',shine:'#b1c7c5'},
  {edge:'#28465c',body:'#557d97',rock:'#91b7c7',shade:'#385c75',cap:'#cbe4e9',shine:'#f0f8f7'},
  {edge:'#43443c',body:'#7f8070',rock:'#a8a895',shade:'#666757',cap:'#8e9a78',shine:'#d2d0b0'},
  {edge:'#272c40',body:'#42495f',rock:'#6a7286',shade:'#34394f',cap:'#788b9c',shine:'#b0ced8'},
  {edge:'#413b34',body:'#7e7668',rock:'#a8a08e',shade:'#635c51',cap:'#a8a28c',shine:'#d8ceaf'},
  {edge:'#293b3d',body:'#4c6262',rock:'#7c9090',shade:'#3a5052',cap:'#849d84',shine:'#b1c2b1'},
  {edge:'#282d36',body:'#515762',rock:'#808590',shade:'#3d424e',cap:'#8a8c91',shine:'#c6c1b1'}
 ];
// Sharp foreground sprites and biome-coherent materials. The background never
// contains the playable platforms; these shapes are the actual collision plane.
function paintPlatformShape(ctx,b,i,biome,detail,time){
 const {rr,line,polygon,ellipse}=canvasBrush(ctx);
 const x=Math.round(b.x),y=Math.round(b.y),w=b.w,h=b.h;
 const t=PLATFORM_THEMES[biome];
 const rand=seed=>{const r=Math.sin(seed*12.9898+i*78.233)*43758.5453;return r-Math.floor(r);};
 if(!b.active){if(b.type==='blink'){ctx.save();ctx.globalAlpha=.25;ctx.setLineDash([5,7]);line(x,y,x+w,y,'#b6d5dd',1);ctx.restore();}return;}
 if(detail===1){ctx.save();if(b.blink&&Math.floor(time*12)%2)ctx.globalAlpha=.4;if(b.type==='fake'&&b.reveal)ctx.globalAlpha=.45;
 rr(x,y,w,h,7,t.edge);rr(x+3,y+5,w-6,h-8,6,t.body);
 for(let row=0;row<2;row++)for(let q=10+(row%2)*24;q<w-16;q+=48){ellipse(x+q+16,y+18+row*21,19,8,t.rock);line(x+q+4,y+15+row*21,x+q+25,y+15+row*21,t.shine+'90',1);}
 rr(x-1,y-2,w+2,8,3,t.cap);line(x+3,y,x+w-4,y,t.shine,2);
 if(biome===3)for(let q=20;q<w-8;q+=52)polygon([[x+q,y+5],[x+q+9,y+5],[x+q+4,y+20]],'#d8edef');
 if(b.type==='crumble')for(let q=20;q<w;q+=60){line(x+q,y,x+q+7,y+10,t.edge,2);line(x+q+7,y+10,x+q+2,y+20,t.edge,2);}
 ctx.restore();return;}
 if(detail===0){ctx.save();if(b.blink&&Math.floor(time*12)%2)ctx.globalAlpha=.4;if(b.type==='fake'&&b.reveal)ctx.globalAlpha=.45;if(b.timer>=0&&b.active)ctx.translate(Math.sin(time*67)*1.2,0);ctx.fillStyle=t.edge;ctx.fillRect(x,y,w,h);ctx.fillStyle=t.body;ctx.fillRect(x+2,y+5,w-4,h-7);ctx.fillStyle=t.cap;ctx.fillRect(x,y,w,5);for(let row=1;row<3;row++){ctx.fillStyle=t.shade;ctx.fillRect(x,y+row*18,w,2);}if(b.type==='crumble'){line(x+w*.45,y+7,x+w*.5,y+24,t.edge,2);line(x+w*.5,y+24,x+w*.43,y+h,t.edge,2);}if(b.type==='blink'){ctx.strokeStyle='#c3d8ff';ctx.lineWidth=2;ctx.setLineDash([7,7]);ctx.strokeRect(x+1,y+1,w-2,h-2);ctx.setLineDash([]);}ctx.restore();return;}
 ctx.save();if(b.type==='fake'&&b.reveal)ctx.globalAlpha=.45;if(b.blink&&Math.floor(time*12)%2)ctx.globalAlpha=.4;
 if(b.timer>=0&&b.active)ctx.translate(Math.sin(time*67)*1.2,0);
 {
  polygon([[x,y],[x+w,y],[x+w-3,y+h-4],[x+w-12,y+h],[x+8,y+h-2],[x,y+h-8]],t.edge);
  ctx.save();ctx.beginPath();ctx.rect(x+2,y+3,w-4,h-6);ctx.clip();ctx.fillStyle=t.shade;ctx.fillRect(x+2,y+3,w-4,h);
  for(let row=0;row<Math.ceil(h/20);row++)for(let q=-44+(row%2)*29;q<w;q+=58){
   const xx=x+q,yy=y+8+row*20,variation=rand(q+row*41);let material=variation>.55?t.rock:t.body;if(detail===2){const light=ctx.createLinearGradient(xx,yy,xx,yy+18);light.addColorStop(0,variation>.55?t.rock:t.body);light.addColorStop(1,t.shade);material=light;}rr(xx+2,yy+1,54,17,2,material);if(detail===2){line(xx+4,yy+3,xx+4,yy+14,t.shine+'70',1);line(xx+52,yy+4,xx+52,yy+15,t.edge+'85',1);if(variation>.77){line(xx+22,yy+4,xx+28,yy+9,t.shade,1);line(xx+28,yy+9,xx+24,yy+14,t.shade,1);}}
   line(xx+5,yy+2,xx+50,yy+2,t.shine+'60',1);line(xx+4,yy+15,xx+51,yy+15,t.edge+'65',1);
   for(let k=0;k<6;k++){ctx.fillStyle=k%2?t.shine+'25':t.edge+'35';ctx.fillRect(Math.round(xx+7+rand(q+k*19+row*3)*40),Math.round(yy+4+rand(q+k*31)*9),2+rand(k+q)*3,1);}
  }ctx.restore();
  rr(x-1,y-2,w+2,8,1,t.edge);rr(x+1,y-1,w-2,5,1,t.cap);line(x+3,y,x+w-3,y,t.shine,1.5);
  if(biome===0||biome===4||biome===7){for(let q=13;q<w-12;q+=37){const moss=rand(q)>.6;rr(x+q,y+3,moss?13:7,moss?4:2,1,'#6d8753');}}
  if(biome===1){for(let q=25;q<w-20;q+=83){line(x+q,y+12,x+q+4,y+19,t.shade,1);line(x+q+4,y+19,x+q+1,y+25,t.shade,1);}}
  if(biome===3){for(let q=18;q<w-12;q+=47)polygon([[x+q,y+6],[x+q+7,y+6],[x+q+4,y+18+rand(q)*6]],'#c6e6e9');}
  if(biome===5){for(let q=19;q<w-25;q+=97){const c=rand(q)>.5?'#6ebbc9':'#a58db8';polygon([[x+q,y+h-3],[x+q-4,y+h-11],[x+q-1,y+h-18],[x+q+4,y+h-8]],c);}}
 }
 if(b.type==='crumble')for(let q=21;q<w;q+=57){line(x+q,y+5,x+q+4,y+13,t.edge,1.5);line(x+q+4,y+13,x+q-2,y+24,t.edge,1.5);}
 if(b.type==='blink'){ctx.strokeStyle='#c3d8ff';ctx.lineWidth=1.5;ctx.setLineDash([6,5]);ctx.strokeRect(x+1,y+1,w-2,h-4);ctx.setLineDash([]);}
 ctx.restore();
}
const platformTextures=new Map(),platformTextureStats={builds:0};
function paintPlatform(g,b,i,biome,detail,time){
 if(!b.active){if(b.type==='blink'){const {line}=canvasBrush(g);g.save();g.globalAlpha=.25;g.setLineDash([5,7]);line(b.x,b.y,b.x+b.w,b.y,'#b6d5dd',1);g.restore();}return;}
 const key=[biome,detail,b.w,b.h,b.type,i%8].join(':'),padding=4,resolution=detail===2?1.35:1;let texture=platformTextures.get(key);
 if(!texture){const layer=document.createElement('canvas');layer.width=Math.ceil((b.w+padding*2)*resolution);layer.height=Math.ceil((b.h+padding*2)*resolution);const brush=layer.getContext('2d');brush.scale(resolution,resolution);paintPlatformShape(brush,{...b,x:padding,y:padding,active:true,timer:-1,blink:false,reveal:false},i%8,biome,detail,0);texture=layer;platformTextures.set(key,texture);platformTextureStats.builds++;if(platformTextures.size>96)platformTextures.delete(platformTextures.keys().next().value);}
 else{platformTextures.delete(key);platformTextures.set(key,texture);}
 g.save();if(b.type==='fake'&&b.reveal)g.globalAlpha=.45;if(b.blink&&Math.floor(time*12)%2)g.globalAlpha=.4;const shake=b.timer>=0?Math.sin(time*67)*1.2:0;
 g.drawImage(texture,Math.round(b.x)+shake-padding,Math.round(b.y)-padding,texture.width/resolution,texture.height/resolution);g.restore();
}

const foundationTiles=new Map();
function paintFoundation(g,x,y,w,h,biome,detail){
 if(h<=0)return;const key=biome+':'+detail;let tile=foundationTiles.get(key);const t=PLATFORM_THEMES[biome];
 if(!tile){tile=document.createElement('canvas');tile.width=128;tile.height=64;const q=tile.getContext('2d'),{rr,line}=canvasBrush(q);q.fillStyle=t.edge;q.fillRect(0,0,128,64);
  for(let row=0;row<2;row++)for(let col=-1;col<3;col++){const xx=col*64+(row%2)*32,yy=row*32;rr(xx+2,yy+2,60,28,3,(col+row)%2?t.shade:t.body);line(xx+5,yy+4,xx+57,yy+4,t.rock,2);if(detail===2){line(xx+5,yy+7,xx+5,yy+25,t.body,1);line(xx+18,yy+18,xx+23,yy+21,t.edge+'40',1);}}
  foundationTiles.set(key,tile);}
 g.save();g.beginPath();g.rect(x,y,w,h);g.clip();for(let yy=y;yy<y+h;yy+=64)for(let xx=x;xx<x+w;xx+=128)g.drawImage(tile,xx,yy);g.restore();
}
function drawPlatform(b,i){
 const x=b.x-camX,y=b.y-camY;if(x+b.w<-25||x>viewW+25||y>580||y+b.h<-25)return;
 if(b.grounded&&b.active){
  ctx.save();ctx.beginPath();ctx.rect(x,y,b.w,580-y);ctx.clip();ctx.fillStyle='#9b886c';ctx.fillRect(x,y,b.w,580-y);
  // Horizontal paving reads as a street surface, not a floating brick wall.
  const brush=canvasBrush(ctx);for(let row=0,yy=y;yy<580;row++,yy+=18)for(let xx=x-32+(row%2)*30;xx<x+b.w;xx+=62){brush.rr(xx+2,yy+2,58,14,3,(row+Math.floor(xx/62))%3?'#b6a184':'#aa9578');brush.line(xx+6,yy+3,xx+53,yy+3,'#d7c3a3',1);}
  brush.line(x,y,x+b.w,y,'#e6d5b4',3);ctx.restore();return;
 }
 paintPlatform(ctx,{...b,x,y},i,biomeIndex(),qualityProfile().detail,clock);
 if(b.active&&state.level.pads.includes(i)){rr(x+b.w/2-18,y-8,36,8,2,'#a891bf');ctx.fillStyle='#f7e9ff';ctx.font='bold 17px Arial';ctx.fillText('↕',x+b.w/2-6,y-11);}
}
