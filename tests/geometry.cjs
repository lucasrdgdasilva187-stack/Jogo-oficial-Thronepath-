const assert=require('assert');const {createRuntime}=require('./runtime.cjs');const {E}=createRuntime();const levels=Array.from({length:51},(_,n)=>E.makeLevel(n));
const cases=[];function test(name,f){try{f();cases.push({name,passed:true});}catch(e){cases.push({name,passed:false,error:e.message});}}
test('Stage one is an actual grounded street',()=>{const l=levels[0];assert(l.platforms.every(b=>b.grounded&&b.y===440));});
test('Springs have explicit destinations above normal jump height',()=>{for(const l of levels.slice(1)){for(const s of l.springs){assert(Number.isInteger(s.targetPlatform));const a=l.platforms[s.platform],b=l.platforms[s.targetPlatform];assert(a.y-b.y>110);assert(b.type==='solid');assert(!l.hazards.some(h=>h.platform===s.targetPlatform));}}});
test('Routes contain sustained stairs up and down',()=>{assert(levels.slice(5,20).some(l=>{const delta=l.platforms.slice(1).map((b,i)=>b.y-l.platforms[i].y);return delta.some((d,i)=>d>20&&delta[i+1]>20&&delta[i+2]>20)&&delta.some((d,i)=>d< -20&&delta[i+1]< -20&&delta[i+2]< -20);}));});
test('Pursuit rockets have a visible launcher',()=>{assert(levels.filter(l=>l.pursuits.some(c=>c.type==='rocket')).every(l=>l.pursuits.filter(c=>c.type==='rocket').every(c=>Number.isInteger(c.launchPlatform))));});
console.log(JSON.stringify(cases,null,2));if(cases.some(c=>!c.passed))process.exitCode=1;
