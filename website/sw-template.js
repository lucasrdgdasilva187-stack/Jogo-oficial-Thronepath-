const FILES=__PRECACHE__;
const PREFIX='thronepath-'+new URL(self.registration.scope).pathname+'-';
const CACHE=PREFIX+'__REVISION__';
const urls=FILES.map(path=>new URL(path,self.registration.scope).href);
async function complete(cache){
  for(const url of urls)if(!(await cache.match(url)))return false;
  return true;
}
async function broadcast(data){
  for(const client of await self.clients.matchAll({includeUncontrolled:true}))client.postMessage(data);
}
self.addEventListener('install',event=>event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  let done=0;
  try{
    for(let i=0;i<urls.length;i+=4){
      await Promise.all(urls.slice(i,i+4).map(async url=>{
        const response=await fetch(new Request(url,{cache:'reload'}));
        if(!response.ok)throw new Error('Offline download failed: '+response.status);
        await cache.put(url,response);
        await broadcast({type:'CACHE_PROGRESS',percent:Math.round(++done/urls.length*100)});
      }));
    }
    if(!(await complete(cache)))throw new Error('Incomplete offline cache');
    await self.skipWaiting();
  }catch(error){await caches.delete(CACHE);throw error;}
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  const old=(await caches.keys()).filter(name=>name.startsWith(PREFIX)&&name!==CACHE);
  for(const name of old.slice(0,-1))await caches.delete(name);
  await self.clients.claim();
  if(await complete(await caches.open(CACHE)))await broadcast({type:'OFFLINE_READY'});
})()));
self.addEventListener('message',event=>{
  if(event.data?.type==='CHECK_OFFLINE')event.waitUntil((async()=>{
    if(await complete(await caches.open(CACHE)))event.source?.postMessage({type:'OFFLINE_READY'});
  })());
});
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope)||event.request.method!=='GET')return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    const key=event.request.mode==='navigate'&&['','index.html'].includes(url.pathname.slice(new URL(self.registration.scope).pathname.length))?new URL('./index.html',self.registration.scope).href:event.request;
    return await cache.match(key)||fetch(event.request);
  })());
});
