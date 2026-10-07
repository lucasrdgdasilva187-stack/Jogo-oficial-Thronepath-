window.THRONEPATH_ANDROID=Boolean(window.THRONEPATH_ANDROID||navigator.userAgent.includes('ThronepathAndroid'));
const GAME_VERSION='1.5.2';
const touchBindings=new Map();
const heldKeys=new Set();let sceneDirty=true;
function freshButtonLayout(){return{left:{x:.075,y:.82,size:64},right:{x:.19,y:.82,size:64},jump:{x:.92,y:.82,size:64}};}
function normalizeButtons(value){const result=freshButtonLayout();for(const key of Object.keys(result)){const b=value&&value[key];if(!b)continue;for(const field of ['x','y','size'])if(Number.isFinite(b[field]))result[key][field]=Math.max(field==='size'?40:0,Math.min(field==='size'?140:1,b[field]));}return result;}
const defaults={master:85,music:80,effects:85,mute:false,showDeaths:true,showTime:false,compact:true,hud:100,control:64,gap:28,lift:24,side:24,quality:'high',motion:true,particles:true};
function freshSettings(){return{...defaults,buttons:freshButtonLayout()};}
let settings=freshSettings(),metrics={jumps:0,kills:0,deaths:falls,seconds:0,streak:0,wins:0,clean:0,lateClean:0,springUses:0,softSprings:0,mediumSprings:0,strongSprings:0,movingRides:0,crumbleEscapes:0,gravityFlips:0,keysCollected:0,hazardsPassed:0,pursuitEscapes:0,maxStreak:0,tutorialWatched:0},awards=[],phaseDeaths=0,toastTimer=0,lastStatsSave=0,endingTime=0,endingStartX=0;
try{const prefs=JSON.parse(localStorage.getItem('thronepath-settings-v1')||'{}');for(const k of Object.keys(defaults))if(typeof prefs[k]===typeof defaults[k])settings[k]=prefs[k];const record=JSON.parse(localStorage.getItem('porta2d-v1')||'{}');for(const k of Object.keys(metrics))if(Number.isFinite(record.metrics&&record.metrics[k]))metrics[k]=Math.max(0,record.metrics[k]);awards=Array.isArray(record.awards)?record.awards.filter(v=>Number.isInteger(v)&&v>=1&&v<=150):[];}catch{}
try{const stored=JSON.parse(localStorage.getItem('thronepath-settings-v1')||'{}');settings.buttons=normalizeButtons(stored.buttons);const b=settings.buttons;if((stored.layoutRevision||0)<4&&b.left.y===.82&&b.right.y===.82&&b.jump.y===.76)b.jump.y=.82;}catch{settings.buttons=freshButtonLayout();}
try{const old=JSON.parse(localStorage.getItem('thronepath-settings-v1')||'{}');if(!old.hudRevision){settings.compact=true;settings.showTime=false;}}catch{}settings.hudRevision=1;settings.layoutRevision=4;if(!['soft','high'].includes(settings.quality))settings.quality='soft';
for(const k of ['master','music','effects'])settings[k]=Math.max(0,Math.min(100,settings[k]));
settings.hud=Math.max(80,Math.min(120,settings.hud));settings.control=Math.max(52,Math.min(96,settings.control));settings.gap=Math.max(16,Math.min(50,settings.gap));settings.lift=Math.max(12,Math.min(65,settings.lift));settings.side=Math.max(12,Math.min(70,settings.side));if(!['soft','high'].includes(settings.quality))settings.quality='soft';
muted=settings.mute;
const QUALITY_PROFILES={soft:{detail:1,backgroundWidth:1440,scale:.9,smooth:true,pixelBudget:850000},high:{detail:2,backgroundWidth:1920,scale:1.15,smooth:true,pixelBudget:1600000}};
function qualityProfile(){return QUALITY_PROFILES[settings.quality]||QUALITY_PROFILES.high;}
function qualityDpr(){const profile=qualityProfile(),pixels=Math.max(1,innerWidth*innerHeight);return Math.min(profile.scale,Math.sqrt(profile.pixelBudget/pixels));}
function controlLayout(){
 const unit=Math.max(.68,Math.min(1,innerHeight/430));
 const size=Math.max(44,settings.control*unit),gap=settings.gap*unit,lift=settings.lift*unit,side=settings.side*unit;
 return{size,gap,lift,side,unit};
}
function controlRects(buttons,width,height){const result={},unit=Math.max(.68,Math.min(1,height/430));for(const [key,b] of Object.entries(normalizeButtons(buttons))){const h=Math.min(height,Math.max(40,b.size*unit)),w=Math.min(width,h*(key==='jump'?1:1.14));result[key]={x:Math.max(w/2,Math.min(width-w/2,b.x*width)),y:Math.max(h/2,Math.min(height-h/2,b.y*height)),w,h};}return result;}
function controlAreaBounds(area){const r=area?.getBoundingClientRect?.();return r&&r.width>0&&r.height>0?r:{left:0,top:0,width:innerWidth,height:innerHeight};}
function applyButtonRect(button,r){button.style.left=(r.x-r.w/2)+'px';button.style.top=(r.y-r.h/2)+'px';button.style.width=r.w+'px';button.style.height=r.h+'px';button.style.setProperty('--arrow-size',r.h*.5+'px');}
function applyControlLayout(){const area=controlAreaBounds($('controls')),rects=controlRects(settings.buttons,area.width,area.height);for(const b of document.querySelectorAll('[data-control]'))applyButtonRect(b,rects[b.dataset.control]);if(typeof renderControlEditor==='function')renderControlEditor();}

let cleanPhases=[],tutorialSeen=[];try{const saved=JSON.parse(localStorage.getItem('porta2d-v1')||'{}');cleanPhases=Array.isArray(saved.cleanPhases)?saved.cleanPhases.filter(n=>Number.isInteger(n)&&n>=1&&n<=51):[];tutorialSeen=Array.isArray(saved.tutorialSeen)?saved.tutorialSeen.filter(n=>Number.isInteger(n)&&n>=0&&n<8):[];}catch{}
