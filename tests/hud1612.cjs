'use strict';
const assert=require('assert'),{createRuntime}=require('./runtime167.cjs');let failures=0;
function test(name,fn){try{fn();console.log('PASS',name)}catch(e){failures++;console.error('FAIL',name,e.message)}}
test('Editor previews opacity without saving until Save and Cancel restores it',()=>{
 const r=createRuntime({}, {touch:true});r.run('openOptions();openControlEditor()');
 const el=r.elements.get('controlsOpacitySetting');el.value=15;el.oninput();assert.equal(r.run('settings.controlsOpacity'),100,'draft must not change saved settings');
 assert.equal(r.styleValues.get('--controls-opacity'),'0.15');r.run('closeControlEditor(false)');assert.equal(r.styleValues.get('--controls-opacity'),'1');
 r.run('openControlEditor()');el.value=35;el.oninput();r.run('closeControlEditor(true)');assert.equal(r.run('settings.controlsOpacity'),35);
 const again=createRuntime({'thronepath-settings-v1':r.storage.get('thronepath-settings-v1')});assert.equal(again.run('settings.controlsOpacity'),35);
});
test('Complete HUD shows phase deaths and both clocks even when compact preferences hide them',()=>{
 const r=createRuntime();r.run("settings.hudMode='full';settings.showTime=false;settings.showPhaseTime=false;settings.showDeaths=false;applySettings();play();recordPlayTime(65);phaseDeaths=4;refreshPlayingHud()");
 for(const id of ['timeHud','phaseTimeHud','deaths','resetRunTime','runCountHud','lifetimeHud'])assert.equal(r.elements.get(id).hidden,false,id+' must appear in complete mode');
 assert(r.elements.get('deaths').textContent.includes('4'));r.run("settings.hudMode='hidden';applySettings();draw()");assert.equal(r.elements.get('hiddenHudMenu').hidden,false);r.elements.get('hiddenHudMenu').onclick();assert.equal(r.run('mode'),'pause');
});
test('Resetting visible deaths and time preserves real totals and per-game averages',()=>{
 const r=createRuntime();assert.equal(r.run('typeof getJourneyStatistics'),'function','persistent statistics are required');
 r.run('play();recordPlayTime(120);phaseDeaths=3;metrics.deaths=3;recordRegisteredDeaths(3);refreshPlayingHud();resetVisibleDeaths();resetVisibleTime()');
 assert.equal(r.run('getJourneyStatistics().totalSeconds'),120);assert.equal(r.run('getJourneyStatistics().totalDeaths'),3);assert.equal(r.run('getJourneyStatistics().averageSeconds'),120);assert.equal(r.run('getJourneyStatistics().averageDeaths'),3);assert.equal(r.run('displayPhaseDeaths()'),0);assert.equal(r.run('metrics.seconds'),0);assert.equal(r.run('phaseDeaths'),3,'clean-phase rules must use actual deaths');
 const again=createRuntime({'porta2d-v1':r.storage.get('porta2d-v1')});assert.equal(again.run('getJourneyStatistics().totalDeaths'),3);assert.equal(again.run('getJourneyStatistics().runs'),1);
});
test('Continuing a paused game keeps the same partida and a new journey increments it',()=>{
 const r=createRuntime();assert.equal(r.run('typeof getJourneyStatistics'),'function');r.run("play();recordPlayTime(60);mode='pause';play()");assert.equal(r.run('getJourneyStatistics().runs'),1);r.run('newRun();recordPlayTime(120)');assert.equal(r.run('getJourneyStatistics().runs'),2);assert.equal(r.run('getJourneyStatistics().averageSeconds'),90);
});
test('Resetting displayed phase time does not erase the actual phase performance',()=>{const r=createRuntime();r.run('play();recordPlayTime(70);resetVisibleTime()');assert.equal(r.run('phaseSeconds'),70);assert(r.elements.get('phaseTimeHud').textContent.includes('0h 00m 00s'));});
test('The completion summary appears before credits and retains official credits',()=>{
 const r=createRuntime();assert(r.elements.has('endingSummary'),'completion summary must exist');r.run('play();recordPlayTime(3600);startEnding();updateEnding(4)');assert.equal(r.elements.get('endingSummary').hidden,false);assert.equal(r.elements.get('creditsPanel').hidden,true);assert(r.elements.get('endingTotalHours').textContent.includes('1h'));r.elements.get('continueToCredits').onclick();assert.equal(r.elements.get('endingSummary').hidden,true);assert.equal(r.elements.get('creditsPanel').hidden,false);
});
test('Achievement toast disappears at 2.5 seconds without extending for simultaneous awards',()=>{
 const timers=[];const r=createRuntime({}, {beforeScripts(env){env.setTimeout=(fn,delay)=>{timers.push({fn,delay});return timers.length}}});r.run("showAchievement('Primeiro Passo');showAchievement('Segundo Passo')");assert.equal(timers.at(-1).delay,2500);assert.equal(timers.filter(t=>t.delay===2500).length,1);timers.at(-1).fn();assert.equal(r.elements.get('toast').hidden,true);assert.equal(r.run('achievementShowing'),false);
});
process.exitCode=failures?1:0;
