const path=require('path');const previewDir=path.resolve(__dirname,'../previews');
const fs=require('fs');const {createRuntime}=require('./runtime.cjs');
(async()=>{const r=createRuntime();await Promise.all(r.run('[...backgrounds,...Object.values(polishedBackgrounds)]').map(img=>img.decode()));
for(const quality of ['medium','high']){r.run(`settings.quality='${quality}';applySettings();load(10);mode='play';constHere=0;` .replace('constHere=0;',''));
r.run("{const b=state.level.platforms[3];state.p.x=b.x+28;state.p.y=b.y-50;state.p.on=3;state.p.ground=true;camX=b.x-85;camY=b.y-380;draw()}");
fs.writeFileSync(path.join(previewDir,quality+'.png'),r.canvas.toBuffer('image/png'));}
console.log('Decoded and rendered both backgrounds');})().catch(e=>{console.error(e);process.exitCode=1;});
