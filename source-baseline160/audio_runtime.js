// Original files supplied by the creator, normalized for the mix; no autoplay before a gesture.
const backgroundMusicPlayers=new Map();let backgroundMusicUnlocked=false,activeBackgroundMusic=null;
let nextSawSound=0,nextCreatureSound=0;
function ambientEffects(){
 if(mode!=='play'||document.hidden||muted||!audioContext||audioContext.state!=='running'||settings.effects<=0||settings.master<=0)return;
 const p=state.p,now=audioContext.currentTime,volume=settings.effects/100;
 if(now>=nextSawSound){nextSawSound=now+.18;let distance=Infinity;for(const h of state.level.hazards)if(h.type==='saw'&&!h.false)distance=Math.min(distance,Math.hypot(h.x-p.x,h.y-p.y));if(distance<380)tone(155,now,.14,.025*volume*(1-distance/380),'sawtooth',140);}
 if(now>=nextCreatureSound){nextCreatureSound=now+.65;const nearby=state.level.enemies.some(e=>e.alive&&Math.hypot(e.x-p.x,e.y-p.y)<260)||(state.pursuits||[]).some(c=>c.type==='hopper'&&c.active&&Math.hypot(c.x-p.x,c.y-p.y)<260);if(nearby)tone(95,now,.1,.035*volume,'triangle',72);}
}
function syncBackgroundMusic(){
 if(typeof Audio==='undefined'||!backgroundMusicUnlocked)return false;
 const atHome=document.body.classList.contains?.('homeScreen');
 const active=!document.hidden&&(mode==='play'||mode==='ending'||mode==='menu'||atHome);
 const name=(mode==='play'||mode==='ending')&&[4,5,8].includes(biomeIndex())?'music_underground':'music_piano';
 if(!active){for(const player of backgroundMusicPlayers.values())if(!player.paused)player.pause();return true;}
 let player=backgroundMusicPlayers.get(name);
 if(!player){player=new Audio(backgroundMusicSources[name]);player.loop=true;player.preload='metadata';backgroundMusicPlayers.set(name,player);}
 if(activeBackgroundMusic!==player){for(const other of backgroundMusicPlayers.values())if(other!==player&&!other.paused)other.pause();activeBackgroundMusic=player;}
 player.volume=(muted||settings.mute)?0:Math.max(0,Math.min(1,settings.master/100*settings.music/100));
 if(player.paused&&!player.pendingPlay){player.pendingPlay=true;const promise=player.play();if(promise&&promise.then)promise.then(()=>{player.pendingPlay=false;},()=>{player.pendingPlay=false;});else player.pendingPlay=false;}
 return true;
}
// Zero volume must be a silent channel, never an invalid exponential ramp.
function unlockAudio(){backgroundMusicUnlocked=true;syncBackgroundMusic();try{
 audioContext||=new(window.AudioContext||window.webkitAudioContext)();
 if(!masterGain){masterGain=audioContext.createGain();if(audioContext.createDynamicsCompressor){const limiter=audioContext.createDynamicsCompressor();limiter.threshold.value=-8;limiter.knee.value=8;limiter.ratio.value=4;limiter.attack.value=.003;limiter.release.value=.18;masterGain.connect(limiter);limiter.connect(audioContext.destination);}else masterGain.connect(audioContext.destination);}
 masterGain.gain.value=muted?0:settings.master/100;
 if(audioContext.state==='suspended')audioContext.resume().catch(()=>{});audioLabel();
}catch{}}
function tone(f,t,d,volume,type='triangle',end=f){
 if(!audioContext||!masterGain||!(volume>0)||!Number.isFinite(volume))return;
 const o=audioContext.createOscillator(),g=audioContext.createGain();o.type=type;o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(end,t+d);
 g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.min(.4,volume),t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(masterGain);o.start(t);o.stop(t+d+.02);o.onended=()=>{o.disconnect();g.disconnect();};
}
function sound(f=440,d=.1){if(muted||!audioContext||audioContext.state!=='running')return;tone(f,audioContext.currentTime,d,.24*settings.effects/100,'triangle',f*.65);}
function music(){
 ambientEffects();
 if(syncBackgroundMusic())return;
 if(!audioContext||audioContext.state!=='running'||muted)return;const now=audioContext.currentTime;if(mode!=='play'){musicTime=now;return;}if(musicTime<now)musicTime=now+.02;
 const melody=[72,0,76,79,0,76,74,0,69,0,72,76,0,74,72,0,67,0,71,74,0,71,69,0,65,0,69,72,0,67,69,0];
 while(musicTime<now+.1){const note=melody[musicBeat%32];if(note)tone(440*2**((note-69)/12),musicTime,.34,.14*settings.music/100,'sine');if(musicBeat%4===0){const bass=[48,45,43,41][Math.floor(musicBeat/8)%4];tone(440*2**((bass-69)/12),musicTime,.65,.13*settings.music/100,'triangle');}musicBeat++;musicTime+=.24;}
}
