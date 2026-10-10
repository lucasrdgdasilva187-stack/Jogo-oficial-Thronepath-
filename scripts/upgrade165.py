from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
p=root/'web/index.html';s=p.read_text()
def swap(a,b):
 global s
 assert a in s,a[:100]
 s=s.replace(a,b)
# Keep saved progress and custom controls; migrate every quality setting to high.
s=re.sub(r"if\(!\['low','medium','high'\]\.includes\(settings\.quality\)\)settings\.quality='(?:low|high)';", "settings.quality='high';", s)
swap("$('qualitySetting').onchange=()=>{settings.quality=$('qualitySetting').value;applySettings();};",'')
start=s.index('<section id="qualitySettings"');end=s.index('</section>',start)+10
s=s[:start]+'<section id="qualitySettings" class="settingsTab" hidden><h3>Efeitos visuais</h3><p>Gráficos em alta qualidade.</p><input id="qualitySetting" type="hidden" value="high"><p class="settingNote">As opções de animação e partículas estão em HUD e controles.</p></section>'+s[end:]
swap('data-tab="qualitySettings">Visual','data-tab="qualitySettings">Efeitos')
# Remove the extra welcome page shown in the reference photo.
start=s.index('<section id="entryScreen"');end=s.index('</section>',start)+10
s=s[:start]+s[end:]
start=s.index('// Startup welcome is separate');end=s.index('// Load local artwork',start)
s=s[:start]+'function dismissEntry(){}\n'+s[end:]
swap("$('enterGame').focus?.()", "$('play').focus?.()")
# A short decorative opening remains independent of asset/network completion.
start=s.index('function startLoadingScreen(){');end=s.index('startLoadingScreen();',start)+len('startLoadingScreen();')
s=s[:start]+(root/'source/loading165.js').read_text()+s[end:]
swap('rgba(20,45,62,.18)','rgba(20,45,62,.42)')
swap('rgba(44,83,108,.30)','rgba(44,83,108,.60)')
swap('border-color:#c4d9e455;border-bottom-color:#c4d9e455','border-color:#d6e5dda0;border-bottom-color:#d6e5dda0')
# Some later hanging saws retract vertically while retaining a fixed, non-solid eyelet.
swap("motion:'pendulum',length:110+(i%3)*35", "motion:n>=12&&n%2===1?'yo-yo':'pendulum',length:110+(i%3)*35")
swap("const a=Math.sin(h.phase)*h.arc;h.x=h.anchorX+Math.sin(a)*h.length;h.y=h.anchorY+Math.cos(a)*h.length;", "const a=Math.sin(h.phase)*h.arc;h.x=h.motion==='yo-yo'?h.anchorX:h.anchorX+Math.sin(a)*h.length;h.y=h.anchorY+(h.motion==='yo-yo'?34+(h.length-34)*(Math.sin(h.phase)+1)/2:Math.cos(a)*h.length);")
swap("else if(h.motion==='pendulum'||h.type==='pendulum'){const a=Math.sin(t)", "else if(h.motion==='yo-yo'){h.x=h.anchorX;h.y=h.anchorY+34+(h.length-34)*(Math.sin(t)+1)/2;}\n   else if(h.motion==='pendulum'||h.type==='pendulum'){const a=Math.sin(t)")
# Share drawing of a coherent mounted launcher for regular and pursuit rockets.
start=s.index('function drawMachine(m){');end=s.index('function drawRocket',start)
s=s[:start]+(root/'source/launcher165.js').read_text()+'\n'+s[end:]
start=s.index(" if(c.type==='rocket'){const launch=");end=s.index('\n if(c.finished)',start)
s=s[:start]+" if(c.type==='rocket'){const launch=state.level.platforms[c.launchPlatform];if(launch){const x=launch.x+launch.w*.55,y=launch.y;line(x-camX,y-camY,x-camX,y-38-camY,'#526b79',7);drawMachine({type:'launcher',x,y:y-58,dir:1,warning:c.triggered&&!c.finished});}}"+s[end:]
# Separate synthesized menu music and click cues from gameplay ambience.
swap("const name=(mode==='play'||mode==='ending')", "if(mode!=='play'&&mode!=='ending'){for(const player of backgroundMusicPlayers.values())if(!player.paused)player.pause();activeBackgroundMusic=null;return false;}\n const name=(mode==='play'||mode==='ending')")
swap("if(mode!=='play'){musicTime=now;return;}", "if(mode!=='play'&&mode!=='ending'){menuMusic(now);musicTime=now;return;}")
s=s.replace('</script></body>',(root/'source/audio165.js').read_text()+'\n</script></body>',1)
swap('O som começa após tocar em Jogar.', 'O som começa após seu primeiro toque. O menu tem música própria.')
# Rectangle demo and topic buttons below, including saw timing and longer jumps.
swap('const TUTORIAL_STEPS=8;', 'const TUTORIAL_STEPS=10;')
swap("'Checkpoints','Chaves e porta'];", "'Checkpoints','Chaves e porta','Serras penduradas','Saltos longos'];")
swap("'Pegue as chaves e alcance a porta.'];", "'Pegue as chaves e alcance a porta.','Espere a serra subir ou se afastar antes de atravessar.','Chegue à beirada, pule e mantenha a direção. Para vãos enormes, use a plataforma móvel.'];")
swap('n<8):[];', 'n<10):[];')
swap("['Olho atento','Assista aos 8 exemplos animados do tutorial.','tutorialWatched',8]", "['Olho atento','Assista aos 10 exemplos animados do tutorial.','tutorialWatched',10]")
start=s.index('<div class="tutorialChoose">');end=s.index('<canvas',start)
s=s[:start]+'<div class="tutorialChoose"><strong id="tutorialStepLabel">1 / 10 · Andar</strong></div>'+s[end:]
swap("if($('tutorialTopic'))$('tutorialTopic').value=String(tutorialStep);",'')
swap("if($('tutorialTopic'))$('tutorialTopic').onchange=()=>setTutorialStep(Number($('tutorialTopic').value));",'')
start=s.index('<div class="tutorialDots"');end=s.index('</div>',start)+6
names=['Andar','Pular','Móveis','Frágeis','Inimigos','Barreiras','Checkpoints','Chaves','Serras','Saltos longos']
topics='<div class="tutorialDots" aria-label="Escolha o que aprender">'+''.join(f'<button id="tutorialDot{i}" aria-label="{name}"'+(' aria-current="true"' if i==0 else '')+f'>{name}</button>' for i,name in enumerate(names))+'</div>'
# Topics belong below navigation, rather than squashing the rectangle horizontally.
s=s[:start]+s[end:]
marker='<button id="tutorialNext"'
pos=s.index('</div>',s.index(marker))+6
s=s[:pos]+topics+s[pos:]
swap(' return s;\n}\nconst TUTORIAL_CAPTIONS', " if(step===8){s.p.x=330;l.hazards=[{type:'pendulum',platform:0,anchorX:520,anchorY:105,x:520,y:260,r:23,motion:'yo-yo',length:180,speed:1.2,phase:0,solidAnchor:false}];}\n if(step===9){l.platforms=[demoBlock(40,310,270),demoBlock(470,295,390)];s.p.x=100;}\n return s;\n}\nconst TUTORIAL_CAPTIONS")
swap('[1,3,6].includes(tutorialStep)', '[1,3,6,9].includes(tutorialStep)')
swap("if(tutorialStep===7)right=p.x<825;", "if(tutorialStep===7)right=p.x<825;\n if(tutorialStep===8){const saw=l.hazards[0];right=p.x<810&&(p.x>550||saw.y<180);}")
swap('paintBackdrop(g,polishedBackgrounds.village,6,960,400,time*60,time);',"const demoBiome=step%2?1:3;paintBackdrop(g,backgrounds[demoBiome],demoBiome,960,400,time*20,time); ")
swap('s.level.platforms[i],i,6,detail,time','s.level.platforms[i],i,demoBiome,detail,time')
swap(' for(const e of s.level.enemies)paintCreature', " for(const h of s.level.hazards)paintTutorialSaw(g,h,time);\n for(const e of s.level.enemies)paintCreature")
start=s.index('function paintDemoButton(');end=s.index('function paintDemoWorld',start)
s=s[:start]+(root/'source/tutorial165.js').read_text()+'\n'+s[end:]
# Achievement list has explicit states and actual progress for every locked target.
swap("(unlocked?'Concluída':measured?Math.min(achievementValue(a),a[4])+' / '+a[4]:'Bloqueada')", "(unlocked?'✓ Concluída':'🔒 Bloqueada · '+Math.min(achievementValue(a),['phase','arrive','cleanPhase'].includes(a[3])?1:a[4])+' / '+(['phase','arrive','cleanPhase'].includes(a[3])?1:a[4]))")
swap("if(show)notifyGame('Conquista: '+a[1]);", "if(show)notifyAchievement(a);")
s=s.replace('<p id="versionLabel"','<aside id="achievementToast" hidden role="status"><span aria-hidden="true">🏆</span><div><small>CONQUISTA DESBLOQUEADA</small><strong id="achievementToastTitle"></strong><p id="achievementToastDescription"></p></div></aside><p id="versionLabel"',1)
s=s.replace('</style>',(root/'source/ui165.css').read_text()+'\n</style>',1)
s=s.replace('</script></body>',(root/'source/achievements165.js').read_text()+'\n</script></body>',1)
s=s.replace('1.6.4','1.6.5')
s=s.replace('Nova tela de carregamento, controles maiores e transparentes, foguetes detalhados, fogo mais baixo e plataformas móveis com viagens longas. Seu progresso foi mantido.','Alta qualidade fixa, abertura com barra, novos sons de menu, controles mais visíveis, serras ioiô e tutorial ampliado. Seu progresso foi mantido.')
p.write_text(s)
print('Version 1.6.5: high quality, direct menu, yo-yo saws, launcher, tutorial and audio applied')
