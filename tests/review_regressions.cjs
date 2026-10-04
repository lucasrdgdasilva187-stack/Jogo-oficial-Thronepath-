const assert=require('assert');const {createRuntime}=require('./runtime.cjs');
(async()=>{const r=createRuntime();await Promise.all(r.run('[...backgrounds,...Object.values(polishedBackgrounds)]').map(i=>i.decode()));let failures=[];
try{for(let n=0;n<51;n++){const l=r.E.makeLevel(n);for(const c of l.pursuits.filter(c=>c.type==='rocket')){const b=l.platforms[c.launchPlatform];assert(b.type==='solid'&&!b.ampX&&!b.ampY,`Stage ${n+1}: launcher support ${b.type}`);}}}catch(e){failures.push(e.message);}
try{r.run("settings.particles=false;ctx.fillStyle='#ff00ff';ctx.fillRect(0,0,960,540);paintBackdrop(ctx,polishedBackgrounds.village,6,960,540,0,0,'high',650)");const p=r.canvas.getContext('2d').getImageData(400,10,1,1).data;assert(!(p[0]>220&&p[1]<80&&p[2]>220),'Elevated village leaves uncovered sky');}catch(e){failures.push(e.message);}
console.log({failures});if(failures.length)process.exitCode=1;})();
