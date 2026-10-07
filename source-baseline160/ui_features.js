const ACHIEVEMENTS=[
 [1,'Primeiro Passo','Complete a fase 1.','phase',1],
 [2,'Aprendendo o Caminho','Complete 3 fases.','phase',3],
 [3,'Primeiro Salto','Pule 10 vezes.','jumps',10],
 [4,'Primeiro Inimigo','Derrote 1 inimigo.','kills',1],
 [5,'Começando Bem','Complete a fase 5.','phase',5],
 [6,'Saltador','Pule 50 vezes.','jumps',50],
 [7,'Caçador Iniciante','Derrote 5 inimigos.','kills',5],
 [8,'Primeiras Dez','Complete a fase 10.','phase',10],
 [9,'Persistência','Morra 10 vezes.','deaths',10],
 [10,'Pulando Muito','Pule 200 vezes.','jumps',200],
 [11,'Caçador','Derrote 10 inimigos.','kills',10],
 [12,'Sem Cair','Complete uma fase sem morrer.','clean',1],
 [13,'Metade do Primeiro Caminho','Complete a fase 15.','phase',15],
 [14,'Caçador Experiente','Derrote 20 inimigos.','kills',20],
 [15,'Vinte Concluídas','Complete a fase 20.','phase',20],
 [16,'Mestre dos Pulos','Pule 500 vezes.','jumps',500],
 [17,'Metade da Jornada','Complete a fase 25.','phase',25],
 [18,'Sobrevivente','Complete 3 fases seguidas sem morrer.','streak',3],
 [19,'Trinta Concluídas','Complete a fase 30.','phase',30],
 [20,'Caçador Supremo','Derrote 50 inimigos.','kills',50],
 [21,'Mil Saltos','Pule 1.000 vezes.','jumps',1000],
 [22,'Nunca Desiste','Morra 100 vezes.','deaths',100],
 [23,'Entrando no Difícil','Complete a fase 35.','phase',35],
 [24,'Território Perigoso','Complete a fase 40.','phase',40],
 [25,'Imparável','Complete 5 fases seguidas sem morrer.','streak',5],
 [26,'Reta Final','Complete a fase 45.','phase',45],
 [27,'Sobrevivente Supremo','Complete uma fase entre 45 e 50 sem morrer.','lateClean',1],
 [28,'Última Porta','Complete a fase 50.','phase',50],
 [29,'Caminho do Trono','Entre na fase 51.','arrive',51],
 [30,'REI DO THRONEPATH','Complete a fase 51 e alcance o trono.','phase',51]
];

function formatTime(v){v=Math.floor(v);return Math.floor(v/3600)+'h '+String(Math.floor(v/60)%60).padStart(2,'0')+'m '+String(v%60).padStart(2,'0')+'s';}
function notifyGame(message){$('toast').textContent=message;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,3200);}
function achievementValue(a){const type=a[3];if(type==='cleanPhase')return cleanPhases.includes(a[4])?1:0;if(type==='phase')return best[a[4]-1]!==undefined?1:0;if(type==='arrive')return current+1>=a[4]?1:0;return metrics[type]||0;}
function checkAchievements(show=true){let changed=false;for(const a of ACHIEVEMENTS){const type=a[3],value=achievementValue(a),target=['phase','arrive','cleanPhase'].includes(type)?1:a[4];if(!awards.includes(a[0])&&value>=target){awards.push(a[0]);changed=true;if(show)notifyGame('Conquista: '+a[1]);}}if(changed){save();renderAchievements();}}
function renderAchievements(){
 $('achievementCount').textContent=awards.length+' / '+ACHIEVEMENTS.length;
 $('achievementList').innerHTML=ACHIEVEMENTS.map(a=>{const unlocked=awards.includes(a[0]);const measured=!['phase','arrive','cleanPhase'].includes(a[3]);return '<article class="achievementRow '+(unlocked?'unlocked':'')+'"><span class="achievementMark">'+(a[0]===30?'♛':unlocked?'✓':'◇')+'</span><div><strong>'+a[0]+'. '+a[1]+'</strong><p>'+a[2]+'</p></div><span class="achievementStatus">'+(unlocked?'Concluída':measured?Math.min(achievementValue(a),a[4])+' / '+a[4]:'Bloqueada')+'</span></article>';}).join('');
}
function applySettings(){
 settings.layoutRevision=4;if(!['soft','high'].includes(settings.quality))settings.quality='high';$('qualitySetting').value=settings.quality;muted=settings.mute;sceneDirty=true;const style=document.documentElement.style;document.body.classList.toggle('lowQuality',settings.quality==='low');document.body.classList.toggle('highQuality',settings.quality==='high');canvas.style.imageRendering=settings.quality==='low'?'pixelated':'auto';
 applyControlLayout();style.setProperty('--hud-scale',settings.hud/100);
 document.body.classList.toggle('compactHud',settings.compact);$('deaths').hidden=!settings.showDeaths;$('timeHud').hidden=!settings.showTime;
 for(const k of ['master','music','effects','hud']){const v=$(k+'Setting'),out=$(k+'Value');v.value=settings[k];out.textContent=settings[k]+(['control','gap','lift','side'].includes(k)?' px':'%');}
 $('muteSetting').checked=settings.mute;$('deathsSetting').checked=settings.showDeaths;$('timeSetting').checked=settings.showTime;$('compactSetting').checked=settings.compact;$('motionSetting').checked=settings.motion;$('particlesSetting').checked=settings.particles;
 if(masterGain)masterGain.gain.value=muted?0:settings.master/100;
 audioLabel();resize();renderTutorial();try{localStorage.setItem('thronepath-settings-v1',JSON.stringify(settings));}catch{}
}
function syncMenuStyle(){const home=$('settingsPanel').hidden&&!$('menuPanel').hidden&&$('menuTitle').textContent==='THRONEPATH'&&mode!=='play'&&mode!=='ending';document.body.classList.toggle('homeScreen',home);$('openAchievements').hidden=$('openTutorial').hidden=!home;if(home)$('play').textContent='Jogar';}
function showMainPanel(){closeReset();$('settingsPanel').hidden=true;$('creditsPanel').hidden=true;$('menuPanel').hidden=false;syncMenuStyle();}
function openOptions(){if(mode==='ending')return;$('settingsTabs').hidden=false;document.body.classList.remove('homeScreen');clearInputs();if(mode==='play'){mode='pause';$('menuTitle').textContent='Pausa';$('play').textContent='Continuar';$('homeMenu').hidden=false;}$('overlay').hidden=false;$('menuPanel').hidden=true;$('creditsPanel').hidden=true;$('settingsPanel').hidden=false;$('progressSummary').textContent='Fase atual: '+(current+1)+' / 51 · Mortes: '+falls+' · Tempo: '+formatTime(metrics.seconds);showSettingsTab('audioSettings');renderAchievements();applySettings();}
function showSettingsTab(id){for(const p of document.querySelectorAll('.settingsTab'))p.hidden=p.id!==id;for(const b of document.querySelectorAll('[data-tab]')){const active=b.dataset.tab===id;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));}$('settingsHeading').textContent=id==='tutorialSettings'?'Tutorial':id==='achievementsSettings'?'Conquistas':'Opções';if(id==='tutorialSettings')setTutorialStep(0);}
function goHome(){const finished=mode==='ending';document.body.classList.remove('ending');endingTime=0;mode=finished?'win':'menu';menu('THRONEPATH','Jogar');$('homeMenu').hidden=true;}
function startEnding(){
 clearInputs();mode='ending';endingTime=0;endingStartX=state.p.x;document.body.classList.add('ending');$('overlay').hidden=true;$('settingsPanel').hidden=true;$('menuPanel').hidden=true;$('creditsPanel').hidden=true;$('creditsBack').hidden=true;$('creditsSummary').textContent='Você alcançou o trono!\n51 fases · '+formatTime(metrics.seconds)+' · '+falls+' mortes';
}
function updateEnding(dt){
 endingTime+=dt;const d=state.level.door,target=d.x+d.w/2-state.p.w/2;
 if(endingTime<1.8){const q=Math.min(1,endingTime/1.8);state.p.x=endingStartX+(target-endingStartX)*(1-(1-q)**2);state.p.vx=50;state.p.face=1;state.p.ground=true;}else{state.p.x=target;state.p.y=d.y+22;state.p.vx=state.p.vy=0;state.p.ground=false;}
 const targetX=Math.max(0,Math.min(state.level.width-viewW,state.p.x-viewW*.56));camX+=(targetX-camX)*Math.min(1,dt*3);
 if(endingTime>=3&&$('creditsPanel').hidden){$('creditsPanel').hidden=false;$('overlay').hidden=false;}
 if(endingTime>=45)$('creditsBack').hidden=false;
}
function restartCurrentPhase(){if(mode==='ending')return;metrics.streak=0;load(current);phaseDeaths=1;mode='play';$('overlay').hidden=true;notifyGame('Fase reiniciada: checkpoints desativados');}
function finishStage(){
 best[current]=Math.min(best[current]||9999,state.t);metrics.wins++;
 if(phaseDeaths===0){if(!cleanPhases.includes(current+1))cleanPhases.push(current+1);metrics.clean=1;metrics.streak++;metrics.maxStreak=Math.max(metrics.maxStreak,metrics.streak);if(current>=44&&current<=49)metrics.lateClean=1;}else metrics.streak=0;
 unlocked=Math.max(unlocked,Math.min(50,current+1));checkAchievements();save();flash=.2;sound(750,.3);
 if(current===50){startEnding();return;}
 if(current===0||(current+1)%10===0){mode='win';menu('Fase '+(current+1)+' concluída','Continuar','Continuar para a fase '+(current+2)+'?');}else{load(current+1);mode='play';}
}
$('openOptions').onclick=openOptions;$('optionsBack').onclick=showMainPanel;
function openHomeSection(id){if(!$('menuPanel').hidden&&$('menuTitle').textContent==='THRONEPATH'){openOptions();$('settingsTabs').hidden=true;showSettingsTab(id);}}
$('openTutorial').onclick=()=>openHomeSection('tutorialSettings');$('openAchievements').onclick=()=>openHomeSection('achievementsSettings');
$('creditsBack').onclick=goHome;
$('homeMenu').onclick=goHome;
for(const b of document.querySelectorAll('[data-tab]'))b.onclick=()=>showSettingsTab(b.dataset.tab);
for(const k of ['master','music','effects','hud'])$(k+'Setting').oninput=()=>{settings[k]=Number($(k+'Setting').value);applySettings();};
for(const [id,key] of [['mute','mute'],['deaths','showDeaths'],['time','showTime'],['compact','compact'],['motion','motion'],['particles','particles']])$(id+'Setting').onchange=()=>{settings[key]=$(id+'Setting').checked;applySettings();};
for(const b of document.querySelectorAll('[data-volume]'))b.onclick=()=>{settings.master=Number(b.dataset.volume);settings.mute=false;unlockAudio();applySettings();};
$('defaultControls').onclick=()=>{for(const k of ['showDeaths','showTime','compact','hud'])settings[k]=defaults[k];settings.buttons=freshButtonLayout();applySettings();notifyGame('HUD e controles restaurados');};
$('defaultAudio').onclick=()=>{for(const k of ['master','music','effects','mute'])settings[k]=defaults[k];unlockAudio();applySettings();notifyGame('Áudio restaurado');};
$('restoreSettings').onclick=()=>{settings=freshSettings();applySettings();notifyGame('Configurações restauradas');};
$('restartPhase').onclick=restartCurrentPhase;$('retry').onclick=restartCurrentPhase;
$('audio').onclick=()=>{settings.mute=!settings.mute;unlockAudio();applySettings();save();};
$('resetTime').onclick=()=>{if(window.confirm('Zerar o tempo total de jogo?')){metrics.seconds=0;save();$('timeHud').textContent=formatTime(0);$('progressSummary').textContent='Tempo total zerado. As fases e conquistas foram mantidas.';}};
$('newGame').onclick=()=>{showMainPanel();$('grid').hidden=true;$('mainButtons').hidden=true;$('resetConfirm').hidden=false;};
$('hudOptions').onclick=openOptions;
window.ThronepathHost={suspend(){save();clearInputs();window.pauseGame();if(audioContext&&audioContext.state==='running')audioContext.suspend().catch(()=>{});},save(){save();},back(){if(controlDraft){closeControlEditor(false);return true;}save();if(mode==='ending'){if(endingTime>=8)goHome();return true;}if(mode==='play'){window.pauseGame();return true;}if(!$('settingsPanel').hidden){showMainPanel();return true;}if(mode==='pause'){goHome();return true;}return false;}};
$('versionLabel').textContent='v'+GAME_VERSION;$('buildLabel').textContent='v'+GAME_VERSION;
applySettings();renderAchievements();syncMenuStyle();

$('qualitySetting').onchange=()=>{settings.quality=$('qualitySetting').value;applySettings();};
