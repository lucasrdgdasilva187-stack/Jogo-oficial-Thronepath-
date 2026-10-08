const TUTORIAL_STEPS=8;
const TUTORIAL_NAMES=['Andar','Pular','Plataformas móveis','Plataformas frágeis','Inimigos','Barreiras','Checkpoints','Chaves e porta'];
let tutorialStep=0,tutorialTime=0,tutorialPaused=false,tutorialState=null,tutorialInput={};
function demoBlock(x,y,w,type='solid'){return{x,y,w,h:45,type,baseX:x,baseY:y,timer:-1,triggerTime:-1,active:true,phase:0,ampX:type==='move'?70:0,ampY:0,dx:0,dy:0};}
function makeTutorialScene(step){
 const s=E.start(0),l=s.level;l.n=5;l.platforms=[demoBlock(40,310,860)];for(const k of ['training','hazards','machines','springs','enemies','keys','checkpoints','pads'])l[k]=[];l.width=960;l.minY=50;l.maxY=370;l.door={x:1e8,y:1e8,w:56,h:94};s.reversed=false;s.gravity=1;s.p={x:100,y:260,w:30,h:50,vx:0,vy:0,ground:true,on:0,face:1,coyote:.13,jumpBuffer:0};s.demoJump=false;s.demoRespawn=false;s.demoDeathTime=0;
 if(step===1){l.platforms=[demoBlock(40,310,270),demoBlock(385,280,450)];}
 if(step===2){l.platforms=[demoBlock(35,310,230),demoBlock(355,300,220,'move'),demoBlock(655,280,260)];s.p.x=385;s.p.y=250;s.p.on=1;}
 if(step===3){l.platforms=[demoBlock(40,310,260,'crumble'),demoBlock(380,285,470)];l.platforms[0].timer=0;s.p.x=235;}
 if(step===4){s.p.x=290;l.enemies=[{platform:0,kind:'mushroom',x:480,y:284,w:32,h:26,alive:true,defeatedTimer:0,dir:1,speed:22,phase:0}];}
 if(step===5){s.p.x=360;l.machines=[{type:'laser',platform:0,x:504,y:20,w:6,h:290,phase:2.5,active:true,warning:false}];}
 if(step===6){l.platforms=[demoBlock(40,310,225),demoBlock(345,295,500)];l.checkpoints=[{platform:1,active:false,number:1}];}
 if(step===7){l.keys=[{platform:0,x:470,y:280,got:false}];l.door={x:807,y:216,w:56,h:94};}
 return s;
}
const TUTORIAL_CAPTIONS=['Ande com ← →, A/D ou direcional do controle.','Pule com ↑, espaço, botão na tela ou A do controle.','Espere a plataforma se aproximar antes de saltar.','A plataforma racha: avance antes que ela desapareça.','Caia sobre o topo do inimigo para derrotá-lo.','Observe a barreira e atravesse quando ela apagar.','Ative a bandeira: ela será seu ponto de retorno.','Pegue as chaves e alcance a porta.'];
function setTutorialStep(n){tutorialStep=(n+TUTORIAL_STEPS)%TUTORIAL_STEPS;tutorialTime=0;if($('tutorialTopic'))$('tutorialTopic').value=String(tutorialStep);if($('tutorialStepLabel'))$('tutorialStepLabel').textContent=(tutorialStep+1)+' / '+TUTORIAL_STEPS+' · '+TUTORIAL_NAMES[tutorialStep];$('tutorialCaption').textContent=TUTORIAL_CAPTIONS[tutorialStep];tutorialState=makeTutorialScene(tutorialStep);tutorialInput={};tutorialPaused=false;$('tutorialPlay').textContent='Ⅱ';$('tutorialPlay').setAttribute('aria-label','Pausar animação');for(let i=0;i<TUTORIAL_STEPS;i++)$('tutorialDot'+i).setAttribute('aria-current',String(i===tutorialStep));renderTutorial();}
function tutorialActive(){return !$('overlay').hidden&&!$('settingsPanel').hidden&&!$('tutorialSettings').hidden;}
function tickTutorial(dt){
 if(!tutorialActive()||tutorialPaused)return;if(!tutorialState)tutorialState=makeTutorialScene(tutorialStep);tutorialTime+=dt;
 if(tutorialTime>=7){setTutorialStep(tutorialStep);return;}
 const s=tutorialState,p=s.p,l=s.level;let left=false,right=false,jump=false;
 if(tutorialStep===0){right=tutorialTime<2.45;left=tutorialTime>3&&tutorialTime<5.5;}
 if([1,3,6].includes(tutorialStep)){right=p.x<745;const b=l.platforms[0];if(!s.demoJump&&p.ground&&p.x>=b.x+b.w-75){jump=true;s.demoJump=true;}}
 if(tutorialStep===2){right=tutorialTime>1.7&&p.x<830;const b=l.platforms[1];if(!s.demoJump&&p.ground&&p.x>=b.x+b.w-65&&tutorialTime>1.7){jump=true;s.demoJump=true;}}
 if(tutorialStep===4){const e=l.enemies[0];if(e.alive){const dx=e.x+e.w/2-p.x-p.w/2;if(p.ground&&dx<85&&!s.demoJump){jump=true;s.demoJump=true;}right=dx>4;left=dx<-4;}else right=p.x<810;}
 if(tutorialStep===5){const m=l.machines[0];right=(!m.active&&!m.warning)||p.x>m.x+10;right&&=p.x<805;}
 if(tutorialStep===7)right=p.x<825;
 tutorialInput={left,right,jump};if(jump)s.demoJumpTime=tutorialTime;
 if(tutorialStep===6&&s.checkpoint===0&&!s.demoRespawn&&tutorialTime>3.8){s.dead=true;s.demoDeathTime=tutorialTime;s.demoRespawn=true;}
 if(s.dead){s.demoDeathTime||=tutorialTime;if(tutorialTime-s.demoDeathTime>.45){if(tutorialStep===6){tutorialState=makeTutorialScene(6);tutorialState.checkpoint=0;tutorialState.level.checkpoints[0].active=true;const b=tutorialState.level.platforms[1];tutorialState.p.x=b.x+20;tutorialState.p.y=b.y-tutorialState.p.h;tutorialState.p.on=1;tutorialState.demoRespawn=true;}else{tutorialState=makeTutorialScene(tutorialStep);tutorialTime=0;}}}
 else E.step(s,{left,right,jump},dt);
}
function paintDemoButton(g,x,y,direction,pressed,keyboard=false){const {rr,polygon,ellipse}=canvasBrush(g);rr(x,y,72,56,15,'#7894a0');rr(x+3,y+3,66,49,12,pressed?'#365e75':'#193c53e8');const triangle=[[x+23,y+13],[x+48,y+28],[x+23,y+43]];g.save();g.translate(x+36,y+28);g.rotate(direction==='left'?Math.PI:direction==='jump'?-Math.PI/2:0);g.translate(-x-36,-y-28);polygon(triangle,'#f3f2df');g.restore();if(keyboard)lineUnder();else if(pressed){ellipse(x+43,y+62,8,8,'#3c414b');rr(x+36,y+39,13,25,6,'#f0d4b2');ellipse(x+44,y+67,12,9,'#f0d4b2');g.strokeStyle='#f7d98b90';g.lineWidth=2;g.beginPath();g.arc(x+42,y+43,16,0,Math.PI*2);g.stroke();}function lineUnder(){g.fillStyle='#879dab';g.fillRect(x+14,y+49,44,2);}}
function paintDemoWorld(g,s,time,step){
 const detail=qualityProfile().detail,{rr,line,ellipse,polygon}=canvasBrush(g);paintBackdrop(g,polishedBackgrounds.village,6,960,400,time*60,time);
 for(let i=0;i<s.level.platforms.length;i++)paintPlatform(g,s.level.platforms[i],i,6,detail,time);
 for(const m of s.level.machines){rr(m.x-7,m.y-7,20,9,2,'#687887');rr(m.x-7,m.y+m.h-2,20,9,2,'#687887');if(m.active){line(m.x+3,m.y,m.x+3,m.y+m.h,'#ba62dc',7);line(m.x+3,m.y,m.x+3,m.y+m.h,'#faf0ff',2);}else{g.setLineDash([3,7]);line(m.x+3,m.y,m.x+3,m.y+m.h,'#d8b6e16e',2);g.setLineDash([]);}}
 for(const c of s.level.checkpoints){const b=s.level.platforms[c.platform],x=b.x+23,y=b.y;line(x,y,x,y-46,'#ddc38a',3);polygon([[x+1,y-46],[x+25,y-41],[x+1,y-28]],c.active?'#73d081':'#bebdb0');if(c.active){g.globalAlpha=.22;ellipse(x+12,y-35,29,29,'#a1e6a0');g.globalAlpha=1;}}
 for(const k of s.level.keys)if(!k.got){ellipse(k.x,k.y-5,7,7,'#594b32');ellipse(k.x,k.y-5,5,5,'#f1cf71');line(k.x,k.y+1,k.x,k.y+16,'#f1cf71',4);line(k.x,k.y+12,k.x+6,k.y+12,'#f1cf71',3);}
 if(step===7){const d=s.level.door;rr(d.x-4,d.y-3,d.w+8,d.h+5,23,'#64584c');rr(d.x,d.y,d.w,d.h,20,'#90694b');for(let q=9;q<d.w;q+=12)line(d.x+q,d.y+22,d.x+q,d.y+d.h-3,'#60442f',2);rr(d.x+3,d.y+30,d.w-6,5,1,'#3e464a');rr(d.x+3,d.y+70,d.w-6,5,1,'#3e464a');ellipse(d.x+d.w-11,d.y+54,3,3,'#e6c377');}
 for(const e of s.level.enemies)paintCreature(g,e,time,detail);
 if(!s.dead)paintAdventurer(g,s.p,time,{detail});else{g.globalAlpha=.55;ellipse(s.p.x+15,s.p.y+20,20,20,'#e4a584');g.globalAlpha=1;}
 if(s.stomped||s.won){g.save();g.globalAlpha=.8;for(let i=0;i<5;i++){const x=s.p.x-10+i*12,y=s.p.y-9-Math.sin(time*5+i)*7;polygon([[x,y-4],[x+2,y-1],[x+5,y],[x+2,y+2],[x,y+5],[x-2,y+2],[x-5,y],[x-2,y-1]],'#f9d887');}g.restore();}
 const keyboard=!matchMedia('(pointer:coarse)').matches,jumpActive=tutorialTime-(s.demoJumpTime??-10)<.22;paintDemoButton(g,30,326,'left',tutorialInput.left,keyboard);paintDemoButton(g,124,326,'right',tutorialInput.right,keyboard);paintDemoButton(g,856,326,'jump',jumpActive,keyboard);
}
function renderTutorial(){const surface=$('tutorialCanvas');if(!surface||!tutorialActive())return;if(!tutorialState)tutorialState=makeTutorialScene(tutorialStep);const dpr=qualityProfile().scale;const w=Math.round(960*dpr),h=Math.round(400*dpr);if(surface.width!==w||surface.height!==h){surface.width=w;surface.height=h;}const g=surface.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);g.imageSmoothingEnabled=qualityProfile().smooth;paintDemoWorld(g,tutorialState,tutorialTime,tutorialStep);}
$('tutorialPrev').onclick=()=>setTutorialStep(tutorialStep-1);$('tutorialNext').onclick=()=>setTutorialStep(tutorialStep+1);$('tutorialPlay').onclick=()=>{tutorialPaused=!tutorialPaused;$('tutorialPlay').textContent=tutorialPaused?'▶':'Ⅱ';$('tutorialPlay').setAttribute('aria-label',tutorialPaused?'Continuar animação':'Pausar animação');};for(let i=0;i<TUTORIAL_STEPS;i++)$('tutorialDot'+i).onclick=()=>setTutorialStep(i);


if($('tutorialTopic'))$('tutorialTopic').onchange=()=>setTutorialStep(Number($('tutorialTopic').value));
