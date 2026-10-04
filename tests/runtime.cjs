'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const filename=process.env.GAME_HTML||path.resolve(__dirname,'../web/index.html');
const html=fs.readFileSync(filename,'utf8');
const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
assert.equal(scripts.length,3,'The complete game must contain all three scripts.');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,'HTML elements must have unique IDs.');
const requestedIds=[...scripts.join('\n').matchAll(/\$\('([^']+)'\)/g)].map(m=>m[1]);
assert.deepEqual(requestedIds.filter(id=>!ids.includes(id)),[],'The interface must not reference missing elements.');
assert(!/<(?:script|link|img)\b[^>]*(?:src|href)="https?:\/\//i.test(html),'The complete game must not require remote scripts, styles or images.');
const noop=()=>{};
let canvasFactory,CanvasImage;
try{const library=require('@napi-rs/canvas');canvasFactory=library.createCanvas;CanvasImage=library.Image;}catch{
 const context=new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,key)=>key in o?o[key]:noop,set:(o,key,value)=>(o[key]=value,true)});
 canvasFactory=()=>({width:960,height:540,getContext:()=>context});CanvasImage=class{constructor(){this.width=0;this.height=0;this.complete=false;}};
}
class BrowserImage extends CanvasImage{get naturalWidth(){return this.width;}}
function createRuntime(initial={},viewport={}){
 const runtimeCanvas=canvasFactory(960,540),surfaceContexts=new WeakMap();
 function contextFor(surface){if(surfaceContexts.has(surface))return surfaceContexts.get(surface);const raw=surface.getContext('2d');const context=new Proxy(raw,{get:(g,key)=>key==='drawImage'?(source,...args)=>g.drawImage(source?.__canvas||source,...args):typeof g[key]==='function'?g[key].bind(g):g[key],set:(g,key,value)=>(g[key]=value,true)});surfaceContexts.set(surface,context);return context;}
 const elements=new Map(),storage=new Map(Object.entries(initial)),windowEvents={},documentEvents={},styleValues=new Map(),bodyClasses=new Set(),audioLog=[];
 const parameter=name=>({value:1,setValueAtTime(value,time){this.value=value;audioLog.push({name,value,time});},exponentialRampToValueAtTime(value,time){if(!(value>0))throw new RangeError('Exponential ramps require a positive target');this.value=value;audioLog.push({name,value,time});}});
 const audioNode=()=>({connect:next=>next,disconnect:noop});
 class AudioMock{constructor(){this.currentTime=1;this.state='running';this.destination=audioNode();}createGain(){return{...audioNode(),gain:parameter('gain')};}createOscillator(){return{...audioNode(),frequency:parameter('frequency'),start:noop,stop:noop};}createDynamicsCompressor(){return{...audioNode(),threshold:parameter('threshold'),knee:parameter('knee'),ratio:parameter('ratio'),attack:parameter('attack'),release:parameter('release')};}resume(){this.state='running';return Promise.resolve();}suspend(){this.state='suspended';return Promise.resolve();}}
 function element(id){if(elements.has(id))return elements.get(id);const classes=new Set(),node={id,hidden:false,textContent:'',innerHTML:'',value:'',checked:false,disabled:false,dataset:{},style:{setProperty:noop},children:[],events:{},classList:{add:x=>classes.add(x),remove:x=>classes.delete(x),toggle:(x,v)=>v?classes.add(x):classes.delete(x)},addEventListener(type,callback){(this.events[type]||=[]).push(callback);},dispatch(type,event){for(const callback of this.events[type]||[])callback(event);},setAttribute:noop,setPointerCapture:noop,releasePointerCapture:noop,getContext:()=>contextFor(runtimeCanvas),appendChild(c){this.children.push(c);},replaceChildren(){this.children=[];}};if(id==='game'||id==='qualityPreview'||id==='tutorialCanvas'||id.startsWith('generatedCanvas')){const surface=id==='game'?runtimeCanvas:canvasFactory(1,1);node.__canvas=surface;node.getContext=()=>contextFor(surface);for(const axis of ['width','height'])Object.defineProperty(node,axis,{get:()=>surface[axis],set:value=>surface[axis]=value});}elements.set(id,node);return node;}
 for(const match of html.matchAll(/<[^>]+\bid="([^"]+)"[^>]*>/g)){const el=element(match[1]);el.hidden=/\bhidden(?:\s|>|=)/.test(match[0]);}
 for(const match of html.matchAll(/<(h[1-6]|button|p|output)\b[^>]*\bid="([^"]+)"[^>]*>([^<>]*)<\/\1>/g))element(match[2]).textContent=match[3];
 const tabs=[...html.matchAll(/<button data-tab="([^"]+)"/g)].map((m,i)=>{const el=element('tab'+i);el.dataset.tab=m[1];return el;});
 const presets=[...html.matchAll(/data-volume="(\d+)"/g)].map((m,i)=>{const el=element('preset'+i);el.dataset.volume=m[1];return el;});
 const controls=['left','right','jump'].map(key=>{const el=element('control-'+key);el.dataset.control=key;return el;});
 const env={console,Math,JSON,Set,Map,Image:BrowserImage,navigator:{userAgent:'Automated test'},innerWidth:viewport.width||960,innerHeight:viewport.height||540,devicePixelRatio:viewport.dpr||1,document:{hidden:false,getElementById:id=>elements.get(id)||null,querySelectorAll:s=>s==='[data-tab]'?tabs:s==='[data-volume]'?presets:s==='[data-control]'?controls:s==='.settingsTab'?['audioSettings','hudSettings','qualitySettings','tutorialSettings','achievementsSettings','progressSettings'].map(element):[],addEventListener:(type,callback)=>{(documentEvents[type]||=[]).push(callback);},createElement:tag=>element((tag==='canvas'?'generatedCanvas':'generated')+elements.size),documentElement:{style:{setProperty:(key,value)=>styleValues.set(key,String(value))}},body:{classList:{add:x=>bodyClasses.add(x),remove:x=>bodyClasses.delete(x),contains:x=>bodyClasses.has(x),toggle:(x,v)=>v?bodyClasses.add(x):bodyClasses.delete(x)}}},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},matchMedia:()=>({matches:Boolean(viewport.touch)}),requestAnimationFrame:callback=>(env.pendingFrame=callback,1),setTimeout:()=>1,clearTimeout:noop,screen:{},addEventListener:(type,callback)=>{(windowEvents[type]||=[]).push(callback);},confirm:()=>true};if(viewport.audio)env.AudioContext=AudioMock;env.window=env;env.globalThis=env;vm.createContext(env);scripts.forEach(s=>vm.runInContext(s,env,{timeout:10000}));return{canvas:runtimeCanvas,env,elements,storage,styleValues,bodyClasses,windowEvents,documentEvents,audioLog,frame(t){const callback=env.pendingFrame;env.pendingFrame=null;callback(t);},run:s=>vm.runInContext(s,env),E:env.PortaEngine};
}
module.exports={createRuntime,html,scripts,ids};
