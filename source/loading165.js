function startLoadingScreen(){
 const screen=$('loadingScreen'),artwork=$('loadingArtwork');
 if(!screen||!artwork||typeof artwork.addEventListener!=='function')return;
 artwork.src=polishedBackgrounds.castle_outside.src;
 let elapsed=0;const duration=3000;
 $('loadingStatus').textContent='Uma jornada até o trono';
 window.ThronepathReady=new Promise(resolve=>{
  function advance(){elapsed+=50;const percent=Math.min(100,Math.round(elapsed/duration*100));$('loadingBar').style.width=percent+'%';$('loadingProgress').setAttribute('aria-valuenow',String(percent));
   if(elapsed<duration){setTimeout(advance,50);return;}
   screen.setAttribute('aria-busy','false');$('loadingStatus').textContent='Sua jornada começa aqui';screen.classList.add('done');
   setTimeout(()=>{screen.hidden=true;resolve();},280);
  }setTimeout(advance,50);
 });
}
startLoadingScreen();
