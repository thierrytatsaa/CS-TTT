const V='scp-v1';
const CORE=['./','index.html','manifest.json','icon-192.png','icon-512.png','apple-touch-icon.png'];
const XLSX='https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js';
self.addEventListener('install',e=>{
 self.skipWaiting();
 e.waitUntil((async()=>{
  const c=await caches.open(V);await c.addAll(CORE);
  try{await c.put(XLSX,await fetch(new Request(XLSX,{mode:'no-cors'})))}catch(_){}
 })());
});
self.addEventListener('activate',e=>{
 e.waitUntil((async()=>{
  for(const k of await caches.keys())if(k.startsWith('scp-')&&k!==V)await caches.delete(k);
  await self.clients.claim();
 })());
});
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;
 const u=new URL(r.url);
 if(u.href===XLSX){e.respondWith(caches.match(XLSX).then(m=>m||fetch(r)));return}
 if(u.origin!==location.origin||u.pathname.endsWith('/status.json'))return;
 e.respondWith(fetch(r).then(res=>{
  if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}
  return res;
 }).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('index.html'))));
});
