'use strict';
const assert=require('assert'),fs=require('fs'),vm=require('vm');
const code=fs.readFileSync('website/viewport.js','utf8');
function setup(width,height,visibleHeight=height,safe={top:0,right:0,bottom:0,left:0}){
 const values=new Map(),events={},vvEvents={};
 const root={style:{setProperty:(k,v)=>values.set(k,v)},dataset:{}};
 const viewport={width,height:visibleHeight,offsetTop:0,offsetLeft:0,addEventListener:(k,v)=>vvEvents[k]=v};
 const probe={style:{},remove(){}};
 const env={innerWidth:width,innerHeight:height,visualViewport:viewport,document:{documentElement:root,createElement:()=>probe,body:{appendChild(){}},addEventListener:(k,v)=>events[k]=v},addEventListener:(k,v)=>events[k]=v,getComputedStyle:()=>({paddingTop:safe.top+'px',paddingRight:safe.right+'px',paddingBottom:safe.bottom+'px',paddingLeft:safe.left+'px'})};
 env.window=env;vm.createContext(env);vm.runInContext(code,env);events.DOMContentLoaded();return{env,root,values,viewport,vvEvents};
}
for(const [w,h,vh] of [[1536,864,691],[844,390,300],[932,430,320],[667,375,280],[568,320,240],[390,844,720],[320,568,460],[1280,720,720]]){
 const r=setup(w,h,vh,{top:12,bottom:20,left:24,right:24}),v=r.env.ThronepathViewport;
 assert.equal(v.height,vh);assert.equal(v.width,w);
 const top=parseFloat(r.values.get('--home-menu-top')),button=parseFloat(r.values.get('--home-button-height')),gap=parseFloat(r.values.get('--home-gap')),rows=r.root.dataset.compactMenu==='true'?2:4;
 assert(top>=24);assert(button>=44);assert(top+rows*button+(rows-1)*gap+40+48+20<=vh+.01,'menu must fit '+[w,h,vh]);
 let calls=0;r.env.resize=()=>calls++;r.viewport.height=vh-10;r.viewport.offsetTop=5;r.vvEvents.resize();assert.equal(r.env.ThronepathViewport.height,vh-10);assert.equal(r.values.get('--app-top'),'5px');assert.equal(calls,1);
 console.log('PASS visible viewport and reachable menu',w,h,vh);
}
const r=setup(844,390);r.env.visualViewport=undefined;r.env.innerHeight=280;r.env.ThronepathViewport.sync();assert.equal(r.env.ThronepathViewport.height,280);
console.log('PASS layout viewport fallback');
