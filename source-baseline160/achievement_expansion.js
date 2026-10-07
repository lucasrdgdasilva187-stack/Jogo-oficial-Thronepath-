// IDs 1–30 remain stable so existing awards survive this update.
const milestonePhases=new Set(ACHIEVEMENTS.filter(a=>a[3]==='phase').map(a=>a[4]));
for(let phase=1;phase<=51;phase++)if(!milestonePhases.has(phase))ACHIEVEMENTS.push([ACHIEVEMENTS.length+1,'Porta '+phase,'Complete a fase '+phase+'.','phase',phase]);
for(let phase=1;phase<=51;phase++)ACHIEVEMENTS.push([ACHIEVEMENTS.length+1,phase===51?'Coroação perfeita':'Precisão '+phase,'Complete a fase '+phase+' sem morrer e sem reiniciar a tentativa.','cleanPhase',phase]);
const mechanicAwards=[
 ['Primeiro impulso','Use uma mola.','springUses',1],['Impulso em série','Use molas 10 vezes.','springUses',10],['Ritmo elástico','Use molas 30 vezes.','springUses',30],['Cem impulsos','Use molas 100 vezes.','springUses',100],
 ['Salto leve','Use molas fracas 10 vezes.','softSprings',10],['Leveza dominada','Use molas fracas 50 vezes.','softSprings',50],
 ['Mais altura','Use molas médias 10 vezes.','mediumSprings',10],['Altura dominada','Use molas médias 50 vezes.','mediumSprings',50],
 ['Decolagem','Use molas fortes 5 vezes.','strongSprings',5],['Além das nuvens','Use molas fortes 25 vezes.','strongSprings',25],
 ['Pegando carona','Pouse em uma plataforma móvel.','movingRides',1],['Passageiro','Pouse em 10 plataformas móveis.','movingRides',10],['Viajante','Pouse em 50 plataformas móveis.','movingRides',50],['Cem travessias','Pouse em 100 plataformas móveis.','movingRides',100],
 ['Saída rápida','Saia de uma plataforma temporária antes que caia.','crumbleEscapes',1],['Pés ligeiros','Saia a tempo de 10 plataformas temporárias.','crumbleEscapes',10],['Não pare','Saia a tempo de 50 plataformas temporárias.','crumbleEscapes',50],
 ['De cabeça para baixo','Ative um inversor de gravidade.','gravityFlips',1],['Outro ponto de vista','Ative 5 inversores de gravidade.','gravityFlips',5],['Mestre da inversão','Ative 20 inversores de gravidade.','gravityFlips',20],
 ['Primeira chave','Colete uma chave.','keysCollected',1],['Chaveiro','Colete 10 chaves.','keysCollected',10],['Todas as fechaduras','Colete 50 chaves.','keysCollected',50],
 ['Lendo o perigo','Ultrapasse 10 armadilhas sem tocar nelas.','hazardsPassed',10],['Entre engrenagens','Ultrapasse 50 armadilhas.','hazardsPassed',50],['Caminho seguro','Ultrapasse 150 armadilhas.','hazardsPassed',150],
 ['Escapou','Sobreviva a uma perseguição ativada.','pursuitEscapes',1],['Fuga calculada','Sobreviva a 5 perseguições ativadas.','pursuitEscapes',5],['Não me alcança','Sobreviva a 15 perseguições ativadas.','pursuitEscapes',15],
 ['Dez impecáveis','Conclua 10 fases seguidas sem morrer ou reiniciar.','maxStreak',10],['Olho atento','Assista aos 8 exemplos animados do tutorial.','tutorialWatched',8]
];
for(const a of mechanicAwards)ACHIEVEMENTS.push([ACHIEVEMENTS.length+1,...a]);
function recordCourseActions(s,previousSupport){
 if(s.dead)return;
 const seen=s.progressSeen||(s.progressSeen={rides:new Set(),crumbles:new Set(),hazards:new Set(),pursuits:new Set()});let changed=false;
 const add=(key)=>{metrics[key]=(metrics[key]||0)+1;changed=true;};
 if(s.sprung){add('springUses');add(['softSprings','mediumSprings','strongSprings'][s.springTier||0]);}
 if(s.flipped)add('gravityFlips');if(s.picked)add('keysCollected');
 if(s.p.ground&&s.p.on>=0){const b=s.level.platforms[s.p.on];if(['move','lift','diagonal','reactive'].includes(b.type)&&!seen.rides.has(s.p.on)){seen.rides.add(s.p.on);add('movingRides');}}
 if(previousSupport>=0&&s.p.on!==previousSupport){const b=s.level.platforms[previousSupport];if(b?.type==='crumble'&&b.active&&!seen.crumbles.has(previousSupport)){seen.crumbles.add(previousSupport);add('crumbleEscapes');}}
 s.level.hazards.forEach((h,i)=>{const b=s.level.platforms[h.platform];if(!h.false&&!seen.hazards.has(i)&&s.p.x>h.x+(h.w||h.r||0)+26&&s.p.x<b.x+b.w+140&&Math.abs(s.p.y+s.p.h-b.y)<400){seen.hazards.add(i);add('hazardsPassed');}});
 s.pursuits.forEach((c,i)=>{if(c.triggered&&c.finished&&!seen.pursuits.has(i)){seen.pursuits.add(i);add('pursuitEscapes');}});
 if(changed)checkAchievements();
}
