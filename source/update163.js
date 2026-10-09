// Show installed release notes once; never a remote download prompt on startup.
let installedNoticePending=false;
try{
 const previousInstalled=localStorage.getItem('thronepath-installed-version');
 const existingJourney=localStorage.getItem('porta2d-v1');
 installedNoticePending=previousInstalled?previousInstalled!==GAME_VERSION:existingJourney!==null;
 if(!installedNoticePending)localStorage.setItem('thronepath-installed-version',GAME_VERSION);
}catch{}
$('updateNotice').hidden=!installedNoticePending;
function acknowledgeUpdate(){
 try{localStorage.setItem('thronepath-installed-version',GAME_VERSION);}catch{}
 installedNoticePending=false;$('updateNotice').hidden=true;$('enterGame').focus?.();
}
$('ackUpdate').onclick=acknowledgeUpdate;
window.addEventListener('keydown',e=>{if(!$('updateNotice').hidden&&(e.code==='Enter'||e.code==='Space'||e.code==='Escape')){e.preventDefault();e.stopImmediatePropagation();acknowledgeUpdate();}},true);

