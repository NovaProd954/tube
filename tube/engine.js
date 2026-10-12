const U={
fmtDur:s=>{s=Math.floor(s);if(!(s>0))return'';const h=Math.floor(s/3600),m=Math.floor(s%3600/60),r=s%60;return(h?h+':'+String(m).padStart(2,'0'):m)+':'+String(r).padStart(2,'0')},
compact:n=>{if(n==null||n<0)return'';const f=(x,u)=>(x>=100?Math.round(x):x.toFixed(1).replace(/\.0$/,''))+u;return n>=1e9?f(n/1e9,'B'):n>=1e6?f(n/1e6,'M'):n>=1e3?f(n/1e3,'K'):String(n)},
ago:ms=>{if(!ms||ms<0)return'';const s=(Date.now()-ms)/1000,u=[[31536000,'year'],[2592000,'month'],[604800,'week'],[86400,'day'],[3600,'hour'],[60,'minute']];for(const[k,n]of u)if(s>=k){const v=Math.floor(s/k);return v+' '+n+(v>1?'s':'')+' ago'}return'just now'},
esc:s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
vid:u=>((u||'').match(/[?&]v=([\w-]{11})/)||(u||'').match(/\/shorts\/([\w-]{11})/)||[])[1]||'',
cid:u=>((u||'').match(/\/channel\/(UC[\w-]{22})/)||[])[1]||'',
text:h=>{if(!h)return'';const d=new DOMParser().parseFromString(String(h).replace(/<br\s*\/?>/gi,'\n'),'text/html');return d.body.textContent||''},
safeUrl:u=>{if(!u)return'';try{const x=new URL(u,location.href);return/^https?:$/.test(x.protocol)?x.href:''}catch{return''}}
};
const Engine=(()=>{
const LS=localStorage,cache=new Map(),TO=ms=>AbortSignal.timeout?AbortSignal.timeout(ms):undefined;
const SBC=['sponsor','selfpromo','interaction'];
let st={kind:'demo',base:'',name:'Demo mode',ms:0},pool=[],TL=null;
const isNative=()=>{const c=window.Capacitor;return!!(c&&c.isNativePlatform&&c.isNativePlatform())};
const loadScript=src=>new Promise((res,rej)=>{if(window.TubeLocal)return res();const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=()=>rej(new Error('engine script'));document.head.appendChild(s)});
const abs=u=>!u?u:u.startsWith('/')?st.base+u:u;
async function probe(base,t=4000){const t0=performance.now();try{const r=await fetch(base+'/healthcheck',{signal:TO(t)});if(!r.ok)return null;const x=await r.text();let j=null;try{j=JSON.parse(x)}catch{}return{base,kind:j&&j.engine==='tube-engine'?'local':'piped',name:new URL(base).host,ms:Math.round(performance.now()-t0)}}catch{return null}}
async function instances(){try{const r=await fetch('https://piped-instances.kavin.rocks/',{signal:TO(5000)});const j=await r.json();return j.filter(x=>x.api_url).sort((a,b)=>(b.uptime_24h||0)-(a.uptime_24h||0)).map(x=>x.api_url.replace(/\/$/,'')).slice(0,8)}catch{return['https://pipedapi.kavin.rocks']}}
const set=p=>{st=p?{kind:p.kind,base:p.base,name:p.name,ms:p.ms}:{kind:'demo',base:'',name:'Demo mode',ms:0};return st};
async function initNative(){const t0=performance.now();try{await loadScript('engine-local.js');if(!window.TubeLocal||!TubeLocal.native())return null;await TubeLocal.init();TL=TubeLocal;return{kind:'native',base:'',name:'On-device engine',ms:Math.round(performance.now()-t0)}}catch(e){TL=null;return null}}
async function init(){
const mode=LS.getItem('eng')||'auto',url=(LS.getItem('engUrl')||'').replace(/\/$/,'');
TL=null;if(mode==='demo')return set(null);
if(mode==='custom'&&url){const p=await probe(url);return set(p&&{...p,kind:p.kind==='local'?'local':'custom'})}
if(isNative()){const n=await initNative();if(n)return set(n)}
let p=null;pool=await instances();for(const b of pool){p=await probe(b,4000);if(p)return set(p)}
return set(null)}
async function rotate(){if(st.kind!=='piped'||!pool.length)return false;const i=pool.indexOf(st.base);for(let k=1;k<pool.length;k++){const b=pool[(i+k)%pool.length],p=await probe(b,3500);if(p){set(p);return true}}return false}
async function req(path,o={}){
if(st.kind==='demo')throw new Error('demo');
const c=cache.get(path);if(c&&Date.now()-c.t<(o.ttl||60000))return c.v;
if(st.kind==='native'){const v=await Promise.race([TL.handle(path),new Promise((_,j)=>setTimeout(()=>j(new Error('timeout')),o.timeout||30000))]);cache.set(path,{t:Date.now(),v});if(cache.size>200)cache.delete(cache.keys().next().value);return v}
let err;for(let i=0;i<3;i++){try{const r=await fetch(st.base+path,{signal:TO(o.timeout||20000)});if(!r.ok)throw new Error('HTTP '+r.status);const v=await r.json();if(v&&v.error)throw new Error(v.error);cache.set(path,{t:Date.now(),v});if(cache.size>200)cache.delete(cache.keys().next().value);return v}catch(e){err=e;if(!(await rotate()))break}}
throw err}
function nv(it){if(!it||(it.type&&it.type!=='stream')||it.isAd||it.ad)return null;const id=U.vid(it.url);if(!id)return null;const live=it.duration===-1||!!it.livestream,sec=Math.max(0,it.duration||0);
return{id,title:it.title||'',chn:it.uploaderName||'',chId:U.cid(it.uploaderUrl),av:U.safeUrl(it.uploaderAvatar)||null,vw:U.compact(it.views),age:it.uploadedDate||U.ago(it.uploaded),dur:live?'':U.fmtDur(sec),sec,th:U.safeUrl(it.thumbnail)||`https://i.ytimg.com/vi/${id}/mqdefault.jpg`,live,short:!!it.isShort||(sec>0&&sec<=60&&!live),ver:!!it.uploaderVerified}}
function nc(it){const id=U.cid(it.url);return id?{type:'channel',id,name:it.name||'',av:U.safeUrl(it.thumbnail)||null,subs:it.subscribers,desc:it.description||'',ver:!!it.verified}:null}
const list=a=>(a||[]).map(nv).filter(Boolean);
const home=async(region='US')=>list(await req('/trending?region='+region,{ttl:300000}));
async function search(q,filter='all'){const j=await req('/search?q='+encodeURIComponent(q)+'&filter='+filter,{ttl:300000});return(j.items||[]).map(it=>it.type==='channel'?nc(it):it.type==='stream'||!it.type?nv(it):null).filter(Boolean)}
const suggest=async q=>{try{const j=await req('/suggestions?query='+encodeURIComponent(q),{ttl:600000,timeout:5000});return Array.isArray(j)?j.filter(s=>typeof s==='string').slice(0,10):[]}catch{return[]}};
const feed=async ids=>{ids=ids.filter(i=>/^UC[\w-]{22}$/.test(i)).slice(0,60);if(!ids.length)return[];return list(await req('/feed/unauthenticated?channels='+ids.join(','),{ttl:300000}))};
async function channel(id){const j=await req('/channel/'+id,{ttl:300000});return{id,name:j.name||'',av:U.safeUrl(j.avatarUrl)||null,banner:U.safeUrl(j.bannerUrl)||null,desc:j.description||'',subs:j.subscriberCount,ver:!!j.verified,items:list(j.relatedStreams).map(v=>({...v,chn:v.chn||j.name,chId:v.chId||id}))}}
async function comments(id){try{const j=await req('/comments/'+id,{ttl:300000});return{disabled:!!j.disabled,count:j.commentCount,items:(j.comments||[]).map(c=>({a:c.author||'',id:U.cid(c.commentorUrl),t:U.text(c.commentText),when:c.commentedTime||'',likes:c.likeCount||0,av:U.safeUrl(c.thumbnail)||null,pin:!!c.pinned,heart:!!c.hearted}))}}catch{return{disabled:false,count:0,items:[],failed:true}}}
function pstream(u,px){if(!px||!u)return u;try{const x=new URL(u),p=new URL(px);if(!/googlevideo\.com$/.test(x.hostname))return u;x.searchParams.set('host',x.host);x.host=p.host;x.protocol=p.protocol;return x.href}catch{return u}}
async function video(id){
const j=await req('/streams/'+id,{ttl:900000}),px=LS.getItem('t.proxyOff')==='1'?'':j.proxyUrl,m=s=>({url:abs(pstream(s.url,px)),mime:s.mimeType||'',codec:s.codec||'',h:s.height||parseInt(s.quality)||0,fps:s.fps||0,br:s.bitrate||0,label:s.quality||''});
const vs=(j.videoStreams||[]).filter(s=>s.url);
return{id,title:j.title||'',desc:U.text(j.description),chn:j.uploader||'',chId:U.cid(j.uploaderUrl),av:U.safeUrl(j.uploaderAvatar)||null,subs:j.uploaderSubscriberCount,ver:!!j.uploaderVerified,views:j.views,likes:j.likes,when:j.uploadDate||'',age:U.ago(j.uploaded),sec:Math.max(0,j.duration||0),live:!!j.livestream,hls:abs(j.hls)||'',th:U.safeUrl(j.thumbnailUrl)||`https://i.ytimg.com/vi/${id}/mqdefault.jpg`,tags:j.tags||[],chapters:(j.chapters||[]).map(c=>({t:c.title||'',s:c.start||0})),
combined:vs.filter(s=>!s.videoOnly).map(m),video:vs.filter(s=>s.videoOnly).map(m),audio:(j.audioStreams||[]).filter(s=>s.url).map(m),
subs_:(j.subtitles||[]).filter(s=>s.url).map(s=>({url:abs(s.url),name:s.name||s.code,code:s.code||'',auto:!!s.autoGenerated})),related:list(j.relatedStreams)}}
async function hash(s){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
async function sponsor(id){try{const h=(await hash(id)).slice(0,4),r=await fetch(`https://sponsor.ajay.app/api/skipSegments/${h}?categories=${encodeURIComponent(JSON.stringify(SBC))}&actionTypes=${encodeURIComponent('["skip"]')}`,{signal:TO(6000)});if(!r.ok)return[];const e=(await r.json()).find(x=>x.videoID===id);return e?e.segments.filter(s=>s.actionType==='skip').map(s=>({c:s.category,a:s.segment[0],b:s.segment[1]})):[]}catch{return[]}}
async function dislikes(id){try{const r=await fetch('https://returnyoutubedislikeapi.com/votes?videoId='+id,{signal:TO(5000)});if(!r.ok)return null;const j=await r.json();return{likes:j.likes,dislikes:j.dislikes}}catch{return null}}
return{init,state:()=>st,native:isNative,video,home,search,suggest,feed,channel,comments,sponsor,dislikes,abs,pstream,nv,probe,set:(m,u)=>{LS.setItem('eng',m);if(u!=null)LS.setItem('engUrl',u)},clear:()=>cache.clear()}
})();
