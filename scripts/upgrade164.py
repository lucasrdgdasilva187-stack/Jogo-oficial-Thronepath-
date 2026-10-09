from pathlib import Path
root=Path(__file__).resolve().parents[1]
p=root/'web/index.html';s=p.read_text()
assert 'id="loadingScreen"' not in s
markup='''<section id="loadingScreen" aria-label="Carregando Thronepath" aria-busy="true"><img id="loadingArtwork" alt="Vila, montanhas e castelo de Thronepath" draggable="false"><div class="loadingContent"><div class="loadingCrown" aria-hidden="true">♛</div><h1>THRONEPATH</h1><p class="loadingTranslation">Caminho do Trono</p><p class="loadingJourney">Da vila ao castelo. Uma jornada até o trono.</p><div id="loadingProgress" class="loadingTrack" role="progressbar" aria-label="Carregamento" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span id="loadingBar"></span></div><p id="loadingStatus">Preparando seu caminho…</p></div></section>'''
s=s.replace('<section id="updateNotice"',markup+'<section id="updateNotice"',1)
s=s.replace('</style>',(root/'source/loading.css').read_text()+'\n</style>',1)
s=s.replace('</script></body>',(root/'source/loading.js').read_text()+'\n</script></body>',1)
s=s.replace('1.6.3','1.6.4')
s=s.replace('Plataformas mais baixas, serras penduradas com ponto fixo e novos efeitos na qualidade Alta. Seu progresso foi mantido.','Nova tela de carregamento e controles transparentes para enxergar melhor o caminho. Seu progresso foi mantido.')
p.write_text(s)
print('Loading screen, transparent controls and version 1.6.4 applied')
