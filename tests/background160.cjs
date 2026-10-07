const assert=require('assert');const {createRuntime}=require('./runtime.cjs');
(async()=>{const r=createRuntime();await Promise.all(r.run('[...backgrounds,...Object.values(polishedBackgrounds)]').map(i=>i.decode()));let frames=0;
for(const q of ['low','medium','high'])for(const size of [[640,360],[844,390],[1280,800]])for(const camera of [0,960,1727.37,2981.55]){
 r.env.innerWidth=size[0];r.env.innerHeight=size[1];r.run(`settings.quality='${q}';settings.particles=false;applySettings();load(10);camX=${camera};camY=10;ctx.setTransform(1,0,0,1,0,0);paintBackdrop(ctx,currentBackground(),3,canvas.width,canvas.height,camX,2,settings.quality);`);
 const canvas=r.canvas,g=canvas.getContext('2d'),pixels=g.getImageData(0,Math.floor(canvas.height/3),canvas.width,1).data;
 for(let x=0;x<canvas.width;x++){const k=x*4;assert(pixels[k+3]===255,'Transparent background seam');assert(pixels[k]+pixels[k+1]+pixels[k+2]>18,'Black background seam');}frames++;
}
console.log(JSON.stringify({backgroundFrames:frames,seams:0}));})();
