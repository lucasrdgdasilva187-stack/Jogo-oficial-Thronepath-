// Physics stays at 120 Hz. Hidden previews and covered game frames are not redrawn.
function loop(t){
 const dt=previous?Math.max(0,Math.min(.08,(t-previous)/1000)):0;previous=t;
 if(document.hidden){accumulator=0;music();requestAnimationFrame(loop);return;}
 if(mode==='play'||mode==='ending'||tutorialActive()){
  accumulator=Math.min(.08,accumulator+dt);let steps=0;while(accumulator>=1/120&&steps<10){update(1/120);accumulator-=1/120;steps++;}
 }else{accumulator=0;music();}
 if(mode==='play'||mode==='ending'){draw();sceneDirty=false;}else if(tutorialActive()){renderTutorial();}else if(sceneDirty&&!document.body.classList.contains?.('homeScreen')){draw();sceneDirty=false;}
 requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
