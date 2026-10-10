let menuNoteTime=0,menuBeat=0;
function menuMusic(now){
 if(!backgroundMusicUnlocked||document.hidden||muted||settings.music<=0){menuNoteTime=now;return;}
 if(menuNoteTime<now)menuNoteTime=now+.02;
 const melody=[67,74,79,74,71,74,78,74,64,71,76,71,62,69,74,69];
 while(menuNoteTime<now+.12){tone(440*2**((melody[menuBeat%16]-69)/12),menuNoteTime,.9,.055*settings.music/100,'sine');if(menuBeat%4===0)tone(440*2**(([43,47,40,38][Math.floor(menuBeat/4)%4]-69)/12),menuNoteTime,1.8,.05*settings.music/100,'triangle');menuBeat++;menuNoteTime+=.48;}
}
function uiClickSound(start=false){
 if(muted||!audioContext||audioContext.state!=='running'||settings.effects<=0)return;
 const t=audioContext.currentTime,v=.12*settings.effects/100;
 tone(start?523:880,t,.065,v,'sine',start?659:1047);
 tone(start?784:1175,t+.045,.1,v*.65,'sine');
}
document.addEventListener('pointerdown',e=>{const b=e.target.closest?.('button');if(!b||b.disabled)return;unlockAudio();uiClickSound(b.id==='play');},true);
document.addEventListener('click',e=>{if(e.detail!==0)return;const b=e.target.closest?.('button');if(!b||b.disabled)return;unlockAudio();uiClickSound(b.id==='play');},true);
window.addEventListener('keydown',e=>{if(!e.repeat&&(e.code==='Enter'||e.code==='Space'))unlockAudio();});
