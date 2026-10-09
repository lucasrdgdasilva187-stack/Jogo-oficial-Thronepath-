from pathlib import Path
root=Path(__file__).resolve().parents[1]
p=root/'web/index.html';s=p.read_text()
def swap(before,after):
 global s
 assert before in s,'Missing baseline: '+before[:90]
 s=s.replace(before,after)
swap('h:44+(i%3)*7','h:28+(i%3)*4')
swap('w:180,h:44','w:180,h:28')
swap('w,h:45,type','w,h:30,type')
swap(' // Guarantee at least one moving or disappearing support'," if(n>=9&&n%3===0&&!hazards.some(h=>h.type==='pendulum'))trap(.6,'pendulum');\n // Guarantee at least one moving or disappearing support")
swap(' const last=platforms[platforms.length-1];'," for(const h of hazards)if(h.type==='pendulum'){const b=platforms[h.platform];h.anchorX=b.x+b.w/2;h.anchorY=b.y-h.length-20;const a=Math.sin(h.phase)*h.arc;h.x=h.anchorX+Math.sin(a)*h.length;h.y=h.anchorY+Math.cos(a)*h.length;h.solidAnchor=false;}\n const last=platforms[platforms.length-1];")
swap('   h.anchorX=center;h.anchorY=b.y-(h.length||150);',"   if(h.type!=='pendulum'){h.anchorX=center;h.anchorY=b.y-(h.length||150);}")
swap("h.x=center+Math.sin(a)*(h.length||150);h.y=h.anchorY+Math.cos(a)*(h.length||150)-20;","h.x=h.anchorX+Math.sin(a)*h.length;h.y=h.anchorY+Math.cos(a)*h.length;")
start=s.index('   const foot=b.x+8-camX;');end=s.index("  }else if(h.motion==='circular')",start)
s=s[:start]+'''   // Fixed eyelet: visual attachment only, never a solid platform.
   drawMount(ax,ay);ellipse(ax,ay+4,5,5,'#c1aa75');ellipse(ax,ay+4,2.5,2.5,'#2c3d48');
   line(ax,ay,x,y,'#27343e',4);line(ax+1,ay,x+1,y,'#baa87c',1.5);
'''+s[end:]
# Stronger high-quality atmosphere, preserving readable foreground geometry.
swap("beam.addColorStop(0,'#fff4cb20');beam.addColorStop(1,'#fff4cb00');","beam.addColorStop(0,'#fff4cb50');beam.addColorStop(1,'#fff4cb00');")
swap('  const count=rich?90:28;','  const count=rich?130:28;')
swap("   else if(rich&&biome===0&&i<15)","   else if(rich&&biome===0&&i<35)")
swap(" if(rich&&weather==='storm'",''' if(rich){
  const haze=g.createLinearGradient(0,h*.58,0,h);haze.addColorStop(0,'#bcd6dc00');haze.addColorStop(1,biome===1?'#ead5ac35':'#adcddc35');g.fillStyle=haze;g.fillRect(0,h*.58,w,h*.42);
  if(settings.particles&&settings.motion){for(let i=0;i<24;i++){const x=((i*177.3+moving*(7+i%5)-camera*.09)%(w+30)+w+30)%(w+30)-15,y=(i*83+Math.sin(moving*.5+i)*18)%(h*.8);const snow=biome===3;g.globalAlpha=.2+.35*Math.abs(Math.sin(moving*.6+i));ellipse(x,y,snow?2:1.5,snow?2:1.5,snow?'#effcff':biome===5||biome===8?'#87b6d1':'#ffe8b5');}g.globalAlpha=1;}
 }
 if(rich&&weather==='storm' ''')
swap(" g.drawImage(texture,Math.round(b.x)"," if(detail===2){g.shadowColor='#08132199';g.shadowBlur=8;g.shadowOffsetY=5;}\n g.drawImage(texture,Math.round(b.x)")
swap("if(!settings.particles||settings.quality==='low')return;for(let i=0;i<num;i++)", "if(!settings.particles||settings.quality==='low')return;num=Math.round(num*(settings.quality==='high'?1.8:1));for(let i=0;i<num;i++)")
# Release notes for an installed update: no notification on first installation.
if 'id="updateNotice"' not in s:
 notice='''<section id="updateNotice" hidden role="dialog" aria-modal="true" aria-labelledby="updateTitle"><div><h2 id="updateTitle">Thronepath atualizado!</h2><p>Você está na versão 1.6.3.</p><p>Plataformas mais baixas, serras penduradas com ponto fixo e novos efeitos na qualidade Alta. Seu progresso foi mantido.</p><button id="ackUpdate">Continuar</button></div></section>'''
 s=s.replace('<section id="entryScreen"',notice+'<section id="entryScreen"',1)
 s=s.replace('</style>',(root/'source/update163.css').read_text()+'</style>',1)
 s=s.replace('// Startup welcome is separate',(root/'source/update163.js').read_text()+'\n// Startup welcome is separate',1)
 s=s.replace('if(!entry||entry.hidden)return;',"if(!entry||entry.hidden||!$('updateNotice').hidden)return;",1)
else:
 s=s.replace('Nova tela de entrada, tutorial com oito demonstrações e melhorias nas plataformas e na qualidade visual. Seu progresso foi mantido.','Plataformas mais baixas, serras penduradas com ponto fixo e novos efeitos na qualidade Alta. Seu progresso foi mantido.')
s=s.replace('1.6.0-alpha','1.6.3-alpha').replace('1.6.1','1.6.3').replace('1.6.2','1.6.3')
p.write_text(s)
print('Thronepath 1.6.3: fixed pendulums, lower platforms, richer high graphics and one-time installed release notes')
