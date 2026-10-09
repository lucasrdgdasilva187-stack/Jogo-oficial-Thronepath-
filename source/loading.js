// Load local artwork before handing control to the welcome screen.
function startLoadingScreen(){
 const screen=$('loadingScreen'), artwork=$('loadingArtwork');
 if(!screen||!artwork||typeof artwork.addEventListener!=='function'||!document.images)return;
 artwork.src=polishedBackgrounds.castle_outside.src;
 const images=[...new Set([...backgrounds,...scenicSheets,worldAtlas,...Object.values(polishedBackgrounds),...document.images])];
 let completed=0,finished=false;
 function progress(){completed++;const percent=Math.round(completed/images.length*100);$('loadingBar').style.width=percent+'%';$('loadingProgress').setAttribute('aria-valuenow',String(percent));$('loadingStatus').textContent='Preparando seu caminho… '+percent+'%';}
 function finish(){if(finished)return;finished=true;clearTimeout(fallback);$('loadingBar').style.width='100%';$('loadingProgress').setAttribute('aria-valuenow','100');$('loadingStatus').textContent='Pronto para começar';screen.setAttribute('aria-busy','false');screen.classList.add('done');setTimeout(()=>{screen.hidden=true;},matchMedia('(prefers-reduced-motion:reduce)').matches?0:280);}
 const fallback=setTimeout(finish,8000);
 const pending=images.map(image=>new Promise(resolve=>{
  if(image.complete){progress();resolve();return;}
  const settled=()=>{image.removeEventListener('load',settled);image.removeEventListener('error',settled);progress();resolve();};
  image.addEventListener('load',settled,{once:true});image.addEventListener('error',settled,{once:true});
 }));
 window.ThronepathReady=Promise.all(pending).then(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))).then(finish);
}
startLoadingScreen();
