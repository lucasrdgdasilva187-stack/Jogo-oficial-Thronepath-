(() => {
  const status = document.getElementById('offlineStatus');
  const help = document.getElementById('installHelp');
  const install = document.getElementById('installSite');
  let prompt = null;
  window.addEventListener('beforeinstallprompt', e => {e.preventDefault();prompt=e;});
  install.addEventListener('click', async () => {
    if(prompt){await prompt.prompt();prompt=null;return;}
    help.hidden=false;document.getElementById('closeInstallHelp').focus();
  });
  document.getElementById('closeInstallHelp').addEventListener('click',()=>{help.hidden=true;install.focus();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!help.hidden){help.hidden=true;install.focus();}});
  if(!('serviceWorker' in navigator)||!window.isSecureContext){status.textContent='';return;}
  let ready=false;
  navigator.serviceWorker.addEventListener('message',e=>{
    if(e.data?.type==='OFFLINE_READY'){ready=true;status.textContent='Disponível offline';}
    if(e.data?.type==='CACHE_PROGRESS'&&!ready)status.textContent='Preparando offline · '+e.data.percent+'%';
  });
  const check=()=>navigator.serviceWorker.controller?.postMessage({type:'CHECK_OFFLINE'});
  navigator.serviceWorker.addEventListener('controllerchange',check);
  navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'}).then(reg=>{
    check();reg.update().catch(()=>{});
  }).catch(()=>{if(!ready)status.textContent='';});
})();
