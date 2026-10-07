function controlDown(key){return [...heldKeys].some(code=>keyMap[code]===key)||[...touchBindings].some(([button,pointers])=>button.dataset.control===key&&pointers.size>0);}
function syncControl(key){input[key]=controlDown(key);}
window.addEventListener('keydown',e=>{
 if(controlDraft){if(e.code==='Escape'){e.preventDefault();closeControlEditor(false);}return;}const key=keyMap[e.code];if(key&&mode==='play'){e.preventDefault();if(e.repeat)return;const wasDown=controlDown(key);heldKeys.add(e.code);syncControl(key);if(key==='jump'&&!wasDown)queuedJump=true;unlockAudio();}
 if(e.code==='Escape'&&!e.repeat){if(mode==='play')window.pauseGame();else if(mode==='pause'&&!$('menuPanel').hidden)play();}
 if(e.code==='Enter'&&!e.repeat&&!$('menuPanel').hidden&&mode!=='play'){e.preventDefault();play();}
 if(e.code==='KeyR'&&!e.repeat&&mode==='play')restartCurrentPhase();
});
window.addEventListener('keyup',e=>{const key=keyMap[e.code];heldKeys.delete(e.code);if(key)syncControl(key);});
for(const button of document.querySelectorAll('[data-control]')){
 const pointers=new Set();touchBindings.set(button,pointers);
 button.addEventListener('pointerdown',e=>{
  e.preventDefault();if(mode!=='play')return;const key=button.dataset.control,wasDown=controlDown(key);pointers.add(e.pointerId);syncControl(key);if(key==='jump'&&!wasDown)queuedJump=true;button.classList.add('pressed');
  try{button.setPointerCapture(e.pointerId);}catch{}unlockAudio();
 });
 const release=e=>{pointers.delete(e.pointerId);syncControl(button.dataset.control);if(!pointers.size)button.classList.remove('pressed');};
 for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,release);
}
