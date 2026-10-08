from pathlib import Path
root=Path(__file__).resolve().parents[1]
p=root/'web/index.html';s=p.read_text()
assert 'id="entryScreen"' not in s
entry='''<section id="entryScreen" aria-label="Boas-vindas ao Thronepath"><img id="entryArtwork" alt="" draggable="false"><div class="entryContent"><p>Da vila ao castelo. Seu caminho até o trono.</p><button id="enterGame">Toque para começar</button></div><small>v1.6.1 · Alpha</small></section>'''
s=s.replace('<body class="homeScreen">','<body class="homeScreen">'+entry,1)
chooser='''<div class="tutorialChoose"><strong id="tutorialStepLabel">1 / 8 · Andar</strong><select id="tutorialTopic" aria-label="Escolher demonstração">'''+''.join(f'<option value="{i}">{i+1}. {name}</option>' for i,name in enumerate(['Andar','Pular','Plataformas móveis','Plataformas frágeis','Inimigos','Barreiras','Checkpoints','Chaves e porta']))+'</select></div>'
s=s.replace('<canvas id="tutorialCanvas"',chooser+'<canvas id="tutorialCanvas"',1)
s=s.replace('aria-label="Exemplo anterior">◀','aria-label="Exemplo anterior">← Anterior').replace('aria-label="Próximo exemplo">▶','aria-label="Próximo exemplo">Próximo →')
s=s.replace('</style>',(root/'source/revision161.css').read_text()+'\n</style>',1)
s=s.replace('</body>','<script>'+ (root/'source/revision161.js').read_text()+'</script></body>',1)
s=s.replace("GAME_VERSION='1.6.0'","GAME_VERSION='1.6.1'").replace('v1.6.0','v1.6.1')
p.write_text(s)
print('Thronepath 1.6.1 opening and tutorial assembled')
