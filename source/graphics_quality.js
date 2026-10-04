
// All quality levels share the same coordinates and collision engine.
// Lower quality reduces the actual canvas and image resolution, not game rules.
const backgroundVariants=new WeakMap();
function canvasBrush(g){
 const rr=(x,y,w,h,r,c)=>{g.fillStyle=c;g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();g.fill();};
 const line=(x,y,x2,y2,c,w=2)=>{g.strokeStyle=c;g.lineWidth=w;g.lineCap='round';g.beginPath();g.moveTo(x,y);g.lineTo(x2,y2);g.stroke();};
 const polygon=(points,c)=>{g.fillStyle=c;g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fill();};
 const ellipse=(x,y,rx,ry,c)=>{g.fillStyle=c;g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fill();};
 return{rr,line,polygon,ellipse};
}
function backgroundSource(image,quality=settings.quality){
 if(!image||!image.complete||!image.naturalWidth)return null;
 const profile=QUALITY_PROFILES[quality]||QUALITY_PROFILES.high;
 if(quality==='high'&&image.width<=profile.backgroundWidth)return image;
 let variants=backgroundVariants.get(image);if(!variants){variants={};backgroundVariants.set(image,variants);}
 if(!variants[quality]){const layer=document.createElement('canvas');layer.width=Math.min(image.width,profile.backgroundWidth);layer.height=Math.max(1,Math.round(image.height*layer.width/image.width));const g=layer.getContext('2d');g.imageSmoothingEnabled=true;g.imageSmoothingQuality='medium';g.drawImage(image,0,0,layer.width,layer.height);
  // Palette simplification is done once, not as a per-frame image filter.
  if(quality!=='high'){const pixels=g.getImageData(0,0,layer.width,layer.height),step=quality==='low'?32:20;for(let q=0;q<pixels.data.length;q+=4){for(let c=0;c<3;c++)pixels.data[q+c]=Math.min(255,Math.round(pixels.data[q+c]/step)*step);}g.putImageData(pixels,0,0);}
  variants[quality]=layer;}
 return variants[quality];
}
function backdropPosition(camera,tileWidth){const offset=settings.motion?camera*.16:0;return{first:Math.floor(offset/tileWidth)-1,offset};}
function paintBackdrop(g,image,biome,width,height,camera,time,quality=settings.quality,groundY=null){
 const profile=QUALITY_PROFILES[quality]||QUALITY_PROFILES.high,source=quality==='soft'?softBackdrop(biome):backgroundSource(image,quality);
 g.save();g.imageSmoothingEnabled=profile.smooth;g.imageSmoothingQuality=quality==='high'?'high':'medium';
 if(!source){g.fillStyle=['#b7dfea','#eec879','#294b63','#7b9cb6','#6b7460','#27394b','#758776','#354e54','#252d3a'][biome];g.fillRect(0,0,width,height);g.restore();return;}
 const street=biome===6&&groundY!==null;const tileW=street?height*1.08*source.width/source.height:Math.max(width*1.35,(source.width/source.height)*(height+30)),tileH=tileW*source.height/source.width;
 const {first,offset}=backdropPosition(camera,tileW),top=street?groundY-tileH*(quality==='soft'?.855:.72):-(tileH-height)*.40;
 // Reflected neighbours meet at identical edges, without a jump when repeating.
 for(let i=first;i*tileW-offset<width;i++){const x=i*tileW-offset;g.save();if(Math.abs(i%2)===1){g.translate(x+tileW,top);g.scale(-1,1);}else g.translate(x,top);if(street&&top>0)g.drawImage(source,0,0,source.width,2,0,-top,tileW,top+1);g.drawImage(source,0,0,tileW,tileH);g.restore();}
 if(profile.detail===2){const wash=g.createLinearGradient(0,0,0,height);wash.addColorStop(0,'#fff0d00c');wash.addColorStop(.6,'#ffffff00');wash.addColorStop(1,'#1224382a');g.fillStyle=wash;g.fillRect(0,0,width,height);
  if(settings.motion&&settings.particles)for(let i=0;i<6;i++){const x=((i*237-camera*.28+time*(biome===3?9:2))%width+width)%width,y=(i*83+time*(biome===3?13:3))%height;const alpha=biome===3?.62:.18;g.globalAlpha=alpha;const {ellipse}=canvasBrush(g);ellipse(x,y,biome===3?1.7:1,biome===3?1.7:1,biome===3?'#f5ffff':'#fff0b2');}g.globalAlpha=1;
 }
 g.restore();
}
function currentBackground(biome=biomeIndex(),progress=state.p.x/state.level.width){const name=({3:'snow',4:'ruins',5:'cave',6:'village',7:'coast'})[biome]||(biome===8?(progress<.43?'castle_outside':'castle_inside'):null);return name?polishedBackgrounds[name]:backgrounds[biome===2?0:biome];}
