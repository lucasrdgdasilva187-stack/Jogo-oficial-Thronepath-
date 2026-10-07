function drawStoryIntro(){
 if(current!==0||state.t>7||mode!=='play')return;
 ctx.save();ctx.globalAlpha=Math.min(1,Math.max(0,7-state.t));
 const w=Math.min(460,viewW-70),x=(viewW-w)/2;
 rr(x,66,w,76,12,'#183644dd');ctx.textAlign='center';ctx.fillStyle='#f3dca4';ctx.font='bold 20px Georgia';ctx.fillText('O primeiro passo',viewW/2,95);
 ctx.fillStyle='#f3eee0';ctx.font='15px sans-serif';ctx.fillText('Deixe a vila. Além da porta, começa o caminho ao trono.',viewW/2,123,w-26);ctx.restore();
}
