from pathlib import Path
import re,base64,json
project=Path(__file__).resolve().parents[1]
s=(project/'web/index.html').read_text()
# Exact replacements retain all embedded assets and existing systems.
for p in (project/'source-baseline160').glob('*.js'):
 before=p.read_text().strip()
 after=(project/'source'/p.name).read_text().strip()
 if p.name=='ui_features.js':
  before=before.replace('function formatTime(', (project/'source-baseline160/achievement_expansion.js').read_text()+'\nfunction formatTime(',1)
  after=after.replace('function formatTime(', (project/'source/achievement_expansion.js').read_text()+'\nfunction formatTime(',1)
 if p.name in ['engine51.js','stage_content.js','pursuit_engine.js']:continue
 if before==after:continue
 assert s.count(before)==1,(p.name,s.count(before))
 s=s.replace(before,after)
blocks=list(re.finditer(r'<script>(.*?)</script>',s,re.S))
engine=(project/'source/engine51.js').read_text().replace('function makeLevel(n){',(project/'source/stage_content.js').read_text()+'\n'+(project/'source/pursuit_engine.js').read_text()+'\nfunction makeLevel(n){',1)
s=s[:blocks[1].start(1)]+engine+s[blocks[1].end(1):]
s=s.replace("if(state.p.ground||state.p.y-camY<140||state.p.y-camY>410){const targetY=state.p.y-(state.p.ground?335:220);camY+=(targetY-camY)*Math.min(1,dt*7);}","const offsetY=state.p.y-camY-335;const deadY=18;const correctionY=offsetY>deadY?offsetY-deadY:offsetY<-deadY?offsetY+deadY:0;camY+=correctionY*(1-Math.exp(-dt*7));")
s=s.replace("E.step(state,{left:input.left,right:input.right,jump:queuedJump},dt)","E.step(state,readActions(),dt)")
s=s.replace('recordCourseActions(state,previousSupport);','recordCourseActions(state,previousSupport);if(state.message){notifyGame(state.message);state.message=null;}effects();')
s=s.replace("a.push('↑ Gravidade')","a.push('↕ GRAVIDADE INVERTIDA')").replace("a.push('⇄ Invertido')","a.push('↔ CONTROLES INVERTIDOS')")
s=s.replace("if(state.flipped){state.flipped=false;", "if(state.flipped){notifyGame(state.gravity<0?'GRAVIDADE INVERTIDA!':'GRAVIDADE NORMAL');state.flipped=false;")
s=s.replace('<option value="soft">Suave — cenário ilustrado e leve</option><option value="high">Alta — cenário e texturas detalhados</option>','<option value="low">Baixa — leve e simplificada</option><option value="medium">Média — clima e detalhes equilibrados</option><option value="high">Alta / Ultra — efeitos e profundidade</option>')
s=s.replace('v1.5.2','v1.6.0').replace('1.5.2-alpha','1.6.0-alpha')
s=s.replace('<div class="tutorialToolbar">','<p id="tutorialCaption">Ande com ← →, A/D ou direcional do controle.</p><div class="tutorialToolbar">',1)
s=s.replace('</style>',(project/'source/revision160.css').read_text()+'\n</style>',1)
s=s.replace('function background(){paintBackdrop', 'function background(){paintBackdrop')
s=s.replace('state.level.training.forEach(drawTraining);','state.level.training.forEach(drawTraining);drawControlZones();')
s=s.replace('drawHero();drawStoryIntro();','drawHero();drawStoryIntro();')
village=project/'art/village_revision160.jpg'
if village.exists():
 s,count=re.subn(r'"village"\s*:\s*"data:image/[^"]+"','"village":'+json.dumps('data:image/jpeg;base64,'+base64.b64encode(village.read_bytes()).decode()),s)
 assert count==1
(project/'web/index.html').write_text(s)

print('Built',len(s.encode()),'bytes')
