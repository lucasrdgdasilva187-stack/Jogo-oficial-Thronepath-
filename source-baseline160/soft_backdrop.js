// Suave uses a deliberately illustrated scenery, cached once per biome.
const softScenes=new Map();
function softBackdrop(biome){
 if(softScenes.has(biome))return softScenes.get(biome);
 const c=document.createElement('canvas');c.width=1440;c.height=810;const g=c.getContext('2d'),{rr,line,polygon,ellipse}=canvasBrush(g);
 const palettes=[['#85c8df','#deefcf','#70a8b1','#3d787e'],['#eccb89','#f6dd9e','#cc9a5b','#a16d45'],['#7597b1','#c2d7d6','#688898','#465f72'],['#304f79','#a4d4df','#7ca2bd','#456b87'],['#849e9c','#d8dbb5','#728d82','#536e65'],['#202c46','#4c6580','#364764','#202f4a'],['#8ebfcf','#e5dabc','#7d9e99','#647d79'],['#537f89','#abc5b3','#4b7576','#365859'],['#202e49','#677991','#384e69','#253750']];
 const p=palettes[biome],sky=g.createLinearGradient(0,0,0,810);sky.addColorStop(0,p[0]);sky.addColorStop(1,p[1]);g.fillStyle=sky;g.fillRect(0,0,1440,810);
 ellipse(1130,115,49,49,biome===3||biome>=5?'#e3efd3':'#fff0b3');if(biome===3)ellipse(1112,99,46,46,p[0]);
 for(let layer=0;layer<3;layer++){const base=440+layer*130;for(let i=-1;i<8;i++){const x=i*230+layer*55,peak=base-150-(i*37+layer*61)%120;polygon([[x-130,810],[x+85,peak],[x+300,810]],layer===0?p[2]:layer===1?p[3]:p[3]+'90');if(biome===3||biome===2)polygon([[x+85,peak],[x+20,peak+104],[x+76,peak+74],[x+112,peak+98],[x+159,peak+104]],'#deeff0');}}
 if(biome===1){for(let j=0;j<3;j++){g.fillStyle=['#e5bb76','#d8a565','#c08b55'][j];g.beginPath();g.moveTo(0,810);for(let x=0;x<=1440;x+=20)g.lineTo(x,555+j*80+Math.sin(x/200+j)*32);g.lineTo(1440,810);g.fill();}for(let i=0;i<5;i++){const x=100+i*310;rr(x,560,15,110,7,'#72825b');line(x+5,612,x-21,598,'#72825b',12);line(x-21,598,x-21,578,'#72825b',12);}}
 else if(biome===5){for(let i=0;i<16;i++){const x=i*103;polygon([[x,0],[x+70,0],[x+38,140+(i%3)*52]],'#1b263b');polygon([[x,810],[x+40,680+(i%3)*29],[x+77,810]],i%2?'#709db5':'#a389b8');}}
 else if(biome===6){for(let i=0;i<8;i++){const x=i*190+10,y=520+(i%3)*24;rr(x,y,135,170,3,'#b3a38a');polygon([[x-12,y],[x+65,y-85],[x+148,y]],'#79694f');for(let j=0;j<3;j++)line(x+12+j*50,y+6,x+12+j*50,y+160,'#786e5d',6);rr(x+52,y+94,35,76,15,'#526369');rr(x+15,y+30,28,35,2,'#7097a0');rr(x+92,y+30,28,35,2,'#7097a0');}polygon([[0,810],[480,650],[960,650],[1440,810]],'#a8a998');}
 else if(biome===4||biome===8){for(let i=0;i<7;i++){const x=90+i*214,y=330+(i%2)*45;rr(x,y,70,420,2,biome===8?'#45516c':'#a1a18a');rr(x-12,y,94,21,2,p[2]);for(let j=0;j<8;j++)line(x,y+j*48,x+70,y+j*48,p[3],2);if(biome===8){rr(x+17,y+45,36,80,17,'#d2ba83');for(let j=0;j<3;j++)rr(x-8+j*35,y-22,20,28,0,p[2]);}}}
 else{for(let i=0;i<11;i++){const x=i*153+35,y=555+(i%3)*41,h=100+(i%4)*25;rr(x-4,y,9,h+80,4,p[3]);if(biome===3){for(let j=0;j<3;j++)polygon([[x,y-110+j*45],[x-42-j*12,y-35+j*45],[x+42+j*12,y-35+j*45]],j%2?'#c6e1e6':'#e1f1ee');}else{ellipse(x,y-25,50,55,biome===7?'#426961':'#568579');ellipse(x-26,y+3,43,37,biome===7?'#426961':'#629787');ellipse(x+30,y+8,42,36,biome===7?'#426961':'#629787');}}}
 softScenes.set(biome,c);return c;
}
