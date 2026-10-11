'use strict';
const assert=require('assert'),{createRuntime,html}=require('./runtime167.cjs');
function check(name,fn){fn();console.log('PASS',name)}
check('Simplified options and visible new version',()=>{
 assert(html.includes('name="version" content="1.6.13"'));
 const hud=html.match(/<section id="hudSettings"[\s\S]*?<\/section>/)[0];
 for(const id of ['hudSetting','hudModeSetting','defaultControls','motionSetting','particlesSetting'])assert(!hud.includes('id="'+id+'"'));
 assert(!html.match(/<section id="audioSettings"[\s\S]*?<\/section>/)[0].includes('defaultAudio'));
 const r=createRuntime();assert.equal(r.elements.get('versionLabel').textContent,'v1.6.13');
});
check('Older opacity, positions and progress migrate without hiding the pause',()=>{
 const settings={controlsOpacity:35,hudMode:'hidden',hudOpacity:0,buttons:{left:{x:.15,y:.8,size:99}}};
 const r=createRuntime({'thronepath-settings-v1':JSON.stringify(settings)});
 assert.equal(r.run('settings.buttons.left.opacity'),35);assert.equal(r.run('settings.buttons.left.size'),99);assert.equal(r.run('settings.hudMode'),'compact');
 r.run('play()');assert.equal(r.elements.get('hiddenHudMenu').hidden,false);r.elements.get('hiddenHudMenu').onclick();assert.equal(r.run('mode'),'pause');
});
check('Button size, opacity and visibility save independently; Cancel restores all',()=>{
 const r=createRuntime();r.run('openOptions();openControlEditor();selectedControl="left";controlDraft.left.size=130');
 r.elements.get('buttonOpacitySetting').value=22;r.elements.get('buttonOpacitySetting').oninput();r.elements.get('buttonVisibleSetting').checked=false;r.elements.get('buttonVisibleSetting').onchange();
 assert.equal(r.run('settings.buttons.left.opacity'),100);r.run('closeControlEditor(false)');assert.equal(r.run('settings.buttons.left.size'),82);assert.equal(r.run('settings.buttons.left.enabled'),true);
 r.run('openControlEditor();controlDraft.left.size=130;controlDraft.left.opacity=22;controlDraft.left.enabled=false;closeControlEditor(true)');
 const saved=r.storage.get('thronepath-settings-v1'),again=createRuntime({'thronepath-settings-v1':saved});
 assert.equal(again.run('settings.buttons.left.opacity'),22);assert.equal(again.run('settings.buttons.right.opacity'),100);assert.equal(again.run('settings.buttons.left.size'),130);assert.equal(again.elements.get('control-left').hidden,true);
 again.run('openControlEditor()');again.elements.get('resetControlDraft').onclick();assert.equal(again.run('controlDraft.left.enabled'),true);assert.equal(again.run('controlDraft.left.opacity'),100);assert.equal(again.run('settings.buttons.left.enabled'),false);again.run('closeControlEditor(true)');assert.equal(again.elements.get('control-left').hidden,false);
});
check('Checkboxes control the counters and the permanent totals survive resets',()=>{
 const r=createRuntime();r.run('settings.showDeaths=false;settings.showTime=false;settings.showPhaseTime=false;applySettings();play();recordPlayTime(60)');
 for(const id of ['deaths','timeHud','phaseTimeHud','resetRunTime'])assert.equal(r.elements.get(id).hidden,true);
 r.run('settings.showDeaths=true;settings.showTime=true;settings.showPhaseTime=true;applySettings()');
 for(const id of ['deaths','timeHud','phaseTimeHud','resetRunTime'])assert.equal(r.elements.get(id).hidden,false);
 r.run('resetVisibleTime()');assert.equal(r.run('metrics.totalSeconds'),60);assert.equal(r.run('getJourneyStatistics().averageSeconds'),60);
});
check('Final statistics precede credits and notifications remain 2.5 seconds',()=>{
 const timers=[];const r=createRuntime({}, {beforeScripts(e){e.setTimeout=(fn,delay)=>{timers.push({fn,delay});return timers.length}}});
 r.run('play();recordPlayTime(60);startEnding();updateEnding(4)');assert.equal(r.elements.get('endingSummary').hidden,false);assert.equal(r.elements.get('creditsPanel').hidden,true);
 r.run("showAchievement('Primeiro Passo')");assert.equal(timers.at(-1).delay,2500);timers.at(-1).fn();assert.equal(r.elements.get('toast').hidden,true);
});
