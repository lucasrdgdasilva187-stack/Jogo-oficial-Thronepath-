from pathlib import Path
root=Path(__file__).resolve().parents[1]
p=root/'web/index.html';s=p.read_text()
assert 'id="loadingScreen"' not in s
markup='''<section id="loadingScreen" aria-label="Carregando Thronepath" aria-busy="true"><img id="loadingArtwork" alt="Vila, montanhas e castelo de Thronepath" draggable="false"><div class="loadingContent"><div class="loadingCrown" aria-hidden="true">♛</div><h1>THRONEPATH</h1><p class="loadingTranslation">Caminho do Trono</p><p class="loadingJourney">Da vila ao castelo. Uma jornada até o trono.</p><div id="loadingProgress" class="loadingTrack" role="progressbar" aria-label="Carregamento" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span id="loadingBar"></span></div><p id="loadingStatus">Preparando seu caminho…</p></div></section>'''
s=s.replace('<section id="updateNotice"',markup+'<section id="updateNotice"',1)
s=s.replace('</style>',(root/'source/loading.css').read_text()+'\n</style>',1)
s=s.replace('</script></body>',(root/'source/loading.js').read_text()+'\n</script></body>',1)
def swap(before,after):
 global s
 assert before in s,before[:80]
 s=s.replace(before,after)
swap("medium:{detail:1,backgroundWidth:1280", "medium:{detail:1,backgroundWidth:960")
swap("high:{detail:2,backgroundWidth:2048,scale:1.4", "high:{detail:2,backgroundWidth:2560,scale:1.55")
swap("high'?1.8:1", "high'?2.6:1")
swap("for(let i=0;i<24;i++){const x=((i*177.3", "for(let i=0;i<48;i++){const x=((i*177.3")
swap("phase:i*.73+n*.13,ampX:", "speedX:[.45,.7,1.1,1.55][(i+n)%4],speedY:[.55,.85,1.3][(i+n)%3],phase:i*.73+n*.13,ampX:")
swap("Math.sin(s.t*1.1+b.phase)*b.ampX", "Math.sin(s.t*(b.speedX||1.1)+b.phase)*b.ampX")
swap("Math.sin(s.t*1.3+b.phase)*b.ampY", "Math.sin(s.t*(b.speedY||1.3)+b.phase)*b.ampY")
swap(" // Keep positive gaps after", " // Keep positive gaps after") if " // Keep positive gaps after" in s else None
marker=" for(let i=1;i<platforms.length;i++){const a=platforms[i-1],b=platforms[i];const x=a.x+a.w+60+"
swap(marker," if(n>=19&&n%3===1){const ferry=platforms.find((b,i)=>i>1&&i<platforms.length-2&&!safe.has(i)&&b.type==='move');if(ferry){ferry.ferry=true;ferry.ampX=180+(n%3)*20;ferry.speedX=n%2?.4:.8;ferry.phase=-Math.PI/2;}}\n"+marker)
swap("w:48,offsetX:b.w/2-24,active:false", "w:48,flameHeight:type==='fire'?88:25,offsetX:b.w/2-24,active:false")
swap("h.type==='fire'?240:25", "h.type==='fire'?(h.flameHeight||88):25")
start=s.index("   if(h.active)for(let i=0;i<4;i++){const xx=x+7+i*11,tip=y-240")
end=s.index("\n  }else{",start)
s=s[:start]+"   if(h.active)paintFlame(x,y,h.w,h.flameHeight||88);"+s[end:]
start=s.index('function drawRocket(r){');end=s.index('function drawPursuit(c){',start)
s=s[:start]+(root/'source/rocket.js').read_text()+"\n"+s[end:]
swap("if(c.type==='rocket'){ctx.save();if(c.vx>0){ctx.translate((c.x-camX)*2+c.w,0);ctx.scale(-1,1);}drawRocket(c);ctx.restore();}","if(c.type==='rocket'){drawRocket(c);}")
s=s.replace('</script></body>',(root/'source/fire.js').read_text()+'\n</script></body>',1)
swap("function freshButtonLayout(){return{left:{x:.075,y:.82,size:64},right:{x:.19,y:.82,size:64},jump:{x:.92,y:.82,size:64}};}","function freshButtonLayout(){return{left:{x:.075,y:.82,size:76},right:{x:.19,y:.82,size:76},jump:{x:.92,y:.82,size:80}};}")
swap("b.jump.y=.82;}catch", "b.jump.y=.82;if((stored.layoutRevision||0)<5&&b.left.x===.075&&b.right.x===.19&&b.jump.x===.92&&b.left.y===.82&&b.right.y===.82&&b.jump.y===.82&&b.left.size===64&&b.right.size===64&&b.jump.size===64){b.left.size=b.right.size=76;b.jump.size=80;}}catch")
s=s.replace('settings.layoutRevision=4','settings.layoutRevision=5')
s=s.replace('1.6.3','1.6.4')
s=s.replace('Plataformas mais baixas, serras penduradas com ponto fixo e novos efeitos na qualidade Alta. Seu progresso foi mantido.','Nova tela de carregamento, controles maiores e transparentes, foguetes detalhados, fogo mais baixo e plataformas móveis com viagens longas. Seu progresso foi mantido.')
p.write_text(s)
print('Loading screen, transparent controls and version 1.6.4 applied')
