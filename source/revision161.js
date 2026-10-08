// Startup welcome is separate from home and never resets the saved journey.
function dismissEntry(){const entry=$('entryScreen');if(!entry||entry.hidden)return;entry.hidden=true;unlockAudio();if(matchMedia('(pointer:coarse)').matches)fullscreen();$('play').focus?.();}
$('entryArtwork').src=$('menuArtwork').src;
$('enterGame').onclick=dismissEntry;
window.addEventListener('keydown',e=>{if(!$('entryScreen').hidden&&(e.code==='Enter'||e.code==='Space')){e.preventDefault();e.stopImmediatePropagation();dismissEntry();}},true);
const playAfterEntry=play;play=function(){if(!$('entryScreen').hidden){dismissEntry();return;}playAfterEntry();};
