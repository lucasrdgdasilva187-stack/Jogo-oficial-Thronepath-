// A separate draft prevents dragging a control from moving the player or saving accidentally.
var controlDraft=null,selectedControl='jump',controlDrag=null;
function renderControlEditor(){
 if(!controlDraft)return;
 const area=controlAreaBounds($('controlEditArea')),rects=controlRects(controlDraft,area.width,area.height);
 for(const key of ['left','right','jump']){$('edit-'+key).classList.toggle('selected',key===selectedControl);applyButtonRect($('edit-'+key),rects[key]);$('choose-'+key).setAttribute('aria-pressed',String(key===selectedControl));}
 $('editSize').value=controlDraft[selectedControl].size;$('editSizeValue').textContent=Math.round(controlDraft[selectedControl].size)+' px';
}
function selectEditControl(key){selectedControl=key;renderControlEditor();}
function openControlEditor(){
 clearInputs();controlDraft=normalizeButtons(settings.buttons);controlDrag=null;
 $('overlay').hidden=true;$('controlEditor').hidden=false;$('controlEditorToolbar').hidden=false;document.body.classList.add('editingControls');sceneDirty=true;renderControlEditor();
}
function closeControlEditor(saveDraft){
 if(!controlDraft)return;
 if(saveDraft)settings.buttons=normalizeButtons(controlDraft);
 controlDraft=null;controlDrag=null;clearInputs();$('controlEditor').hidden=true;document.body.classList.remove('editingControls');$('overlay').hidden=false;
 if(saveDraft){applySettings();notifyGame('Posições e tamanhos salvos');}else applyControlLayout();
}
for(const key of ['left','right','jump']){
 const button=$('edit-'+key);$('choose-'+key).onclick=()=>selectEditControl(key);
 button.addEventListener('pointerdown',e=>{
  if(!controlDraft||controlDrag)return;e.preventDefault();selectEditControl(key);
  const area=controlAreaBounds($('controlEditArea')),r=controlRects(controlDraft,area.width,area.height)[key];
  controlDrag={id:e.pointerId,key,dx:e.clientX-area.left-r.x,dy:e.clientY-area.top-r.y};try{button.setPointerCapture(e.pointerId);}catch{}
 });
 button.addEventListener('pointermove',e=>{
  if(!controlDrag||controlDrag.id!==e.pointerId||!controlDraft)return;e.preventDefault();
  const area=controlAreaBounds($('controlEditArea')),b=controlDraft[controlDrag.key];
  b.x=Math.max(0,Math.min(1,(e.clientX-area.left-controlDrag.dx)/area.width));b.y=Math.max(0,Math.min(1,(e.clientY-area.top-controlDrag.dy)/area.height));renderControlEditor();
 });
 const release=e=>{if(controlDrag?.id===e.pointerId)controlDrag=null;};for(const type of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(type,release);
}
$('editSize').oninput=()=>{if(controlDraft){controlDraft[selectedControl].size=Math.max(40,Math.min(140,Number($('editSize').value)||64));renderControlEditor();}};
$('editControls').onclick=openControlEditor;$('saveControls').onclick=()=>closeControlEditor(true);$('cancelControls').onclick=()=>closeControlEditor(false);
$('resetControlDraft').onclick=()=>{controlDraft=freshButtonLayout();renderControlEditor();};
$('toggleControlToolbar').onclick=()=>{$('controlEditorToolbar').hidden=!$('controlEditorToolbar').hidden;};
