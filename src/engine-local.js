import {Innertube,UniversalCache,Constants} from 'youtubei.js/web';
const str=t=>t==null?'':typeof t==='string'?t:String(t.text!==undefined?t.text:t),ID=/^[\w-]{11}$/,UC=/^UC[\w-]{22}$/;
const count=s=>{const m=String(s||'').replace(/,/g,'').match(/([\d.]+)\s*([KMB])?/i);if(!m)return -1;const n=parseFloat(m[1]),u=(m[2]||'').toUpperCase();return Math.round(n*(u==='K'?1e3:u==='M'?1e6:u==='B'?1e9:1))};
const dur=s=>{const p=String(s||'').split(':').map(Number);if(!p.length||p.some(isNaN))return 0;return p.reduce((a,b)=>a*60+b,0)};
const https=u=>!u?'':u.startsWith('//')?'https:'+u:u;
const thumbOf=(n,id)=>https((n.best_thumbnail&&n.best_thumbnail.url)||(n.thumbnails&&n.thumbnails[0]&&n.thumbnails[0].url)||(n.thumbnail&&n.thumbnail[0]&&n.thumbnail[0].url))||`https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
const live=n=>!!(n.is_live||(n.badges||[]).some&&(n.badges||[]).some(b=>/live/i.test(str(b.label||b.style||''))&&!/upcoming/i.test(str(b.label||''))));
const parts=r=>((r&&r.metadata_parts)||[]).map(p=>({t:str(p.text),id:(((p.text&&p.text.endpoint)||(p.text&&p.text.runs&&p.text.runs[0]&&p.text.runs[0].endpoint)||{}).payload||{}).browseId||''}));
function item(n){
if(!n)return null;const t=n.type;
if(['Video','CompactVideo','GridVideo','PlaylistVideo','WatchCardCompactVideo','PlaylistPanelVideo'].includes(t)){
const id=n.video_id||n.id;if(!ID.test(id||''))return null;const lv=live(n);let d=n.duration;const sec=lv?-1:d&&typeof d==='object'&&typeof d.seconds==='number'?d.seconds:dur(str(d)||str(n.length_text));
const a=n.author||{},vc=n.view_count||n.views||n.short_view_count||n.video_info;
return{url:'/watch?v='+id,type:'stream',title:str(n.title),thumbnail:thumbOf(n,id),uploaderName:a.name||str(n.short_byline_text)||'',uploaderUrl:UC.test(a.id||'')?'/channel/'+a.id:'',uploaderAvatar:https(a.best_thumbnail&&a.best_thumbnail.url)||null,uploadedDate:str(n.published),uploaded:-1,duration:sec,views:count(str(vc)),uploaderVerified:!!a.is_verified,isShort:!lv&&sec>0&&sec<=60,livestream:lv}}
if(t==='LockupView'){
if(!['VIDEO','SHORT'].includes(n.content_type)||!ID.test(n.content_id||''))return null;
const id=n.content_id,rows=((n.metadata&&n.metadata.metadata&&n.metadata.metadata.metadata_rows)||[]),r0=parts(rows[0]),r1=parts(rows[1]).map(x=>x.t),pubs=r1.find(s=>/ago|Streamed|Premiered|Scheduled/i.test(s))||'',vw=r1.find(s=>/view|watching/i.test(s))||'';
const img=n.content_image,imgs=(img&&(img.image||(img.primary_thumbnail&&img.primary_thumbnail.image)))||[];
let sec=0;try{(img&&img.overlays||[]).forEach(o=>(o.badges||[o]).forEach(b=>{const x=str(b.text);if(/^\d+(:\d{2})+$/.test(x))sec=dur(x)}))}catch{}
const lv=/watching/i.test(vw)||/LIVE/i.test(JSON.stringify((img&&img.overlays||[]).map(o=>o.badges&&o.badges.map(b=>b.text)||[])));
return{url:'/watch?v='+id,type:'stream',title:str(n.metadata&&n.metadata.title),thumbnail:https(imgs[0]&&imgs[0].url)||`https://i.ytimg.com/vi/${id}/mqdefault.jpg`,uploaderName:(r0[0]&&r0[0].t)||'',uploaderUrl:UC.test((r0[0]&&r0[0].id)||'')?'/channel/'+r0[0].id:'',uploaderAvatar:null,uploadedDate:pubs,uploaded:-1,duration:lv?-1:sec,views:count(vw),uploaderVerified:false,isShort:n.content_type==='SHORT',livestream:lv}}
if(t==='ShortsLockupView'||t==='ReelItem'){
const id=(n.on_tap_endpoint&&n.on_tap_endpoint.payload&&n.on_tap_endpoint.payload.videoId)||n.id||'';if(!ID.test(id))return null;
const ov=n.overlay_metadata||{};return{url:'/shorts/'+id,type:'stream',title:str(ov.primary_text||n.title),thumbnail:https((n.thumbnail&&n.thumbnail[0]&&n.thumbnail[0].url)||(n.thumbnails&&n.thumbnails[0]&&n.thumbnails[0].url))||`https://i.ytimg.com/vi/${id}/mqdefault.jpg`,uploaderName:'',uploaderUrl:'',uploaderAvatar:null,uploadedDate:'',uploaded:-1,duration:30,views:count(str(ov.secondary_text||n.views)),uploaderVerified:false,isShort:true,livestream:false}}
return null}
function channelItem(c){const id=c.id||(c.author&&c.author.id)||'';if(!UC.test(id))return null;const a=c.author||{};return{url:'/channel/'+id,type:'channel',name:a.name||str(c.title)||'',thumbnail:https((a.best_thumbnail&&a.best_thumbnail.url)||(a.thumbnails&&a.thumbnails[0]&&a.thumbnails[0].url)),description:str(c.description_snippet),subscribers:count(str(c.subscriber_count||c.subscribers)),verified:!!a.is_verified}}
const feedItems=f=>{const o=[],seen=new Set();for(const n of(f.videos||[])){const x=item(n);if(x&&!seen.has(x.url)){seen.add(x.url);o.push(x)}}return o};
let yt=null,ytFull=null,booting=null,fetchFn=null;
export function setFetch(f){fetchFn=f}
async function boot(){if(yt)return yt;if(!booting)booting=Innertube.create({fetch:fetchFn||undefined,retrieve_player:false,cache:new UniversalCache(false),lang:'en',location:'US'}).then(x=>(yt=x)).catch(e=>{booting=null;throw e});return booting}
async function full(){if(ytFull)return ytFull;ytFull=await Innertube.create({fetch:fetchFn||undefined,retrieve_player:true,cache:new UniversalCache(false),lang:'en',location:'US'});return ytFull}
const CLIENTS=['VISIONOS','IOS','ANDROID_VR','TV','WEB'];
async function info(id){const errs=[];
for(const c of CLIENTS){try{const y=(c==='TV'||c==='WEB')?await full():await boot();const i=await y.getInfo(id,{client:c});const s=i.streaming_data;if(s&&((s.formats&&s.formats.length)||(s.adaptive_formats&&s.adaptive_formats.length)||s.hls_manifest_url))return{i,y,c};errs.push(c+': '+((i.playability_status&&i.playability_status.reason)||'no streams'))}catch(e){errs.push(c+': '+String((e&&e.message)||e))}}
throw new Error(errs.join(' | ')||'No playable streams')}
const mime=m=>{const x=String(m||'').match(/^([^;]+)(?:;\s*codecs="?([^"]*)"?)?/);return{m:(x&&x[1]||'').trim(),c:(x&&x[2]||'').split(',')[0].trim()}};
async function furl(f,y){if(f.url&&!f.signature_cipher&&!f.cipher)return f.url;try{return await f.decipher(y.session.player)}catch{return f.url||''}}
async function streams(i,y){const s=i.streaming_data||{},vs=[],au=[];
for(const f of[...(s.formats||[]),...(s.adaptive_formats||[])]){
if(f.is_drc||f.is_type_otf||(f.drm_families&&f.drm_families.length)||f.is_dubbed||f.is_auto_dubbed||f.is_descriptive||(f.audio_track&&f.audio_track.audio_is_default===false))continue;
const u=await furl(f,y);if(!u)continue;const {m,c}=mime(f.mime_type);
if(f.has_video)vs.push({url:u,format:(m.split('/')[1]||'').toUpperCase(),quality:f.quality_label||(f.height?f.height+'p':''),mimeType:m,codec:c,videoOnly:!f.has_audio,bitrate:f.bitrate||0,width:f.width||0,height:f.height||0,fps:f.fps||0,contentLength:f.content_length||0});
else if(f.has_audio)au.push({url:u,format:(m.split('/')[1]||'').toUpperCase(),quality:Math.round((f.average_bitrate||f.bitrate||0)/1000)+' kbps',mimeType:m,codec:c,bitrate:f.average_bitrate||f.bitrate||0})}
return{vs,au}}
async function video(id){
const {i,y,c}=await info(id),b=i.basic_info||{},st=await streams(i,y),own=(i.secondary_info&&i.secondary_info.owner)||{},oa=own.author||{},pm=((i.page&&i.page[0]&&i.page[0].microformat)||{}),pd=Date.parse(pm.publish_date||pm.upload_date||'');
const caps=((i.captions&&i.captions.caption_tracks)||[]).map(t=>({url:https(t.base_url)+(/[?&]fmt=/.test(t.base_url)?'':'&fmt=vtt'),mimeType:'text/vtt',name:str(t.name)||t.language_code,code:t.language_code,autoGenerated:t.kind==='asr'}));
const rel=[];for(const n of(i.watch_next_feed||[])){const x=item(n);if(x)rel.push(x)}
const cid=(b.channel&&b.channel.id)||b.channel_id||'';
return{title:b.title||'',description:b.short_description||'',uploadDate:isNaN(pd)?'':new Date(pd).toISOString().slice(0,10),uploaded:isNaN(pd)?-1:pd,uploader:(b.channel&&b.channel.name)||b.author||'',uploaderUrl:cid?'/channel/'+cid:'',uploaderAvatar:https(oa.best_thumbnail&&oa.best_thumbnail.url)||null,uploaderSubscriberCount:count(str(own.subscriber_count)),uploaderVerified:!!oa.is_verified,thumbnailUrl:https(b.thumbnail&&b.thumbnail[0]&&b.thumbnail[0].url)||`https://i.ytimg.com/vi/${id}/mqdefault.jpg`,hls:(b.is_live||b.is_live_content)&&i.streaming_data&&i.streaming_data.hls_manifest_url||null,dash:null,livestream:!!b.is_live,duration:b.is_live?-1:b.duration||0,views:b.view_count==null?-1:b.view_count,likes:b.like_count==null?-1:b.like_count,dislikes:-1,category:b.category||'',tags:(b.tags||b.keywords||[]).slice(0,12),chapters:[],audioStreams:st.au,videoStreams:st.vs,subtitles:caps,relatedStreams:rel,proxyUrl:'',client:c}}
async function search(q,filter){const y=await boot();if(filter==='shorts'){const r=await y.search(q+' shorts',{type:'video',duration:'short'});return{items:feedItems(r).filter(x=>x.duration>0&&x.duration<=60),nextpage:null,suggestion:null,corrected:false}}const r=await y.search(q,{type:filter==='channels'?'channel':filter==='videos'?'video':'all'});const items=feedItems(r);if(filter!=='videos'){for(const c of(r.channels||[])){const x=channelItem(c);if(x)items.unshift(x)}}return{items,nextpage:null,suggestion:null,corrected:false}}
async function home(){const y=await boot();let l=[];try{l=feedItems(await y.getHomeFeed())}catch{}if(l.length<6){try{l=feedItems(await y.search('trending now',{type:'video'}))}catch{}}return l}
async function suggest(q){const y=await boot();return(await y.getSearchSuggestions(q)).slice(0,10)}
async function comments(id){const y=await boot(),c=await y.getComments(id,'TOP_COMMENTS'),out=[];
for(const t of(c.contents||[])){const v=t.comment;if(!v)continue;const a=v.author||{};out.push({author:a.name||'',commentId:v.comment_id,commentText:str(v.content),commentedTime:v.published_time||'',commentorUrl:UC.test(a.id||'')?'/channel/'+a.id:'',repliedCount:count(v.reply_count),thumbnail:https(v.creator_thumbnail_url||(a.best_thumbnail&&a.best_thumbnail.url)),likeCount:Math.max(0,count(v.like_count)),pinned:!!v.is_pinned,verified:!!a.is_verified,hearted:false})}
return{comments:out,nextpage:null,disabled:false,commentCount:count(str(c.header&&c.header.count))||out.length}}
async function channel(id){const y=await boot();let ch=await y.getChannel(id);const meta=ch.metadata||{};let v=ch;try{if(ch.has_videos)v=await ch.getVideos()}catch{}
const hd=ch.header&&ch.header.content,rows=((hd&&hd.metadata&&hd.metadata.metadata_rows)||[]).flatMap(r=>parts(r)).map(p=>p.t),subs=count(rows.find(s=>/subscriber/i.test(s))||'');
const items=feedItems(v).map(x=>({...x,uploaderName:x.uploaderName||meta.title||'',uploaderUrl:x.uploaderUrl||'/channel/'+id}));
return{id,name:meta.title||'',avatarUrl:https(meta.avatar&&meta.avatar[0]&&meta.avatar[0].url)||null,bannerUrl:https(hd&&hd.banner&&hd.banner.image&&hd.banner.image[0]&&hd.banner.image[0].url)||null,description:meta.description||'',subscriberCount:subs,verified:false,nextpage:null,relatedStreams:items}}
async function rss(cid){const r=await (fetchFn||fetch)('https://www.youtube.com/feeds/videos.xml?channel_id='+cid);if(!r.ok)return[];const d=new DOMParser().parseFromString(await r.text(),'application/xml'),out=[];
d.querySelectorAll('entry').forEach(e=>{const g=s=>{const x=e.getElementsByTagName(s)[0];return x?x.textContent:''},vid=g('yt:videoId');if(!ID.test(vid))return;const l=e.getElementsByTagName('link')[0],st=e.getElementsByTagName('media:statistics')[0],au=e.getElementsByTagName('author')[0],t=Date.parse(g('published'));
out.push({url:'/watch?v='+vid,type:'stream',title:g('title'),thumbnail:`https://i.ytimg.com/vi/${vid}/mqdefault.jpg`,uploaderName:au?au.getElementsByTagName('name')[0].textContent:'',uploaderUrl:'/channel/'+cid,uploaderAvatar:null,uploadedDate:'',uploaded:isNaN(t)?-1:t,duration:0,views:st?parseInt(st.getAttribute('views')||'-1',10):-1,uploaderVerified:false,isShort:!!(l&&/\/shorts\//.test(l.getAttribute('href')||'')),livestream:false})});return out}
async function feed(ids){const l=ids.filter(i=>UC.test(i)).slice(0,60),res=await Promise.all(l.map(c=>rss(c).catch(()=>[])));return res.flat().sort((a,b)=>b.uploaded-a.uploaded).slice(0,150)}
export async function handle(path){const u=new URL(path,'http://x'),p=u.pathname,q=u.searchParams;let m;
if(p==='/trending')return home();
if(p==='/search')return search(q.get('q')||'',q.get('filter')||'all');
if(p==='/suggestions')return suggest(q.get('query')||'');
if((m=p.match(/^\/streams\/([\w-]{11})$/)))return video(m[1]);
if((m=p.match(/^\/comments\/([\w-]{11})$/)))return comments(m[1]);
if((m=p.match(/^\/channel\/(UC[\w-]{22})$/)))return channel(m[1]);
if(p==='/feed/unauthenticated')return feed((q.get('channels')||'').split(','));
throw new Error('Unknown route '+p)}
export async function nativeFetch(input,init){
const cap=globalThis.Capacitor,http=cap&&cap.Plugins&&cap.Plugins.CapacitorHttp;if(!http)return fetch(input,init);
init=init||{};const url=typeof input==='string'?input:String((input&&input.url)||input),method=(init.method||(typeof input!=='string'&&input.method)||'GET').toUpperCase(),h={};
const H=init.headers||(typeof input!=='string'?input.headers:null);if(H)new Headers(H).forEach((v,k)=>{h[k]=v});
if(/youtube\.com|googleapis\.com/.test(url)&&!h.cookie)h.cookie='SOCS=CAI; CONSENT=YES+';
let data=init.body;if(data!=null&&typeof data!=='string')data=await new Response(data).text();
if(data!=null&&/json/.test(h['content-type']||'')){try{data=JSON.parse(data)}catch{}}
const r=await http.request({url,method,headers:h,data:method==='GET'||method==='HEAD'?undefined:data,responseType:'text'});
const body=typeof r.data==='string'?r.data:JSON.stringify(r.data);
return new Response([204,205,304].includes(r.status)?null:body,{status:r.status,headers:r.headers||{}})}
export const native=()=>{const c=globalThis.Capacitor;return!!(c&&c.isNativePlatform&&c.isNativePlatform()&&c.Plugins&&c.Plugins.CapacitorHttp)};
export async function init(){setFetch(nativeFetch);await boot();return true}
export const _t={item,channelItem,feedItems,count,dur,mime};

export const clientUA=c=>(Constants&&Constants.CLIENTS&&Constants.CLIENTS[c]&&Constants.CLIENTS[c].USER_AGENT)||'';
export async function diagnose(log){
const L=x=>log&&log(x),cap=globalThis.Capacitor,t0=performance.now();
L('WebView UA: '+navigator.userAgent);
L('Capacitor: '+(cap&&cap.getPlatform?cap.getPlatform():'none')+', native='+native());
const ua=clientUA('VISIONOS');L('UA matches VISIONOS client: '+(navigator.userAgent===ua?'yes':'NO'));
const T=async(name,fn)=>{const a=performance.now();try{const r=await fn();L('OK   '+name+' ('+Math.round(performance.now()-a)+' ms)'+(r?' - '+r:''));return true}catch(e){L('FAIL '+name+': '+String((e&&e.message)||e).slice(0,500));return false}};
if(!await T('network via native HTTP',async()=>{const r=await nativeFetch('https://www.youtube.com/generate_204');return 'HTTP '+r.status}))return;
if(!await T('engine start',async()=>{await init()}))return;
await T('search',async()=>{const r=await search('music','videos');return r.items.length+' results'});
await T('home feed',async()=>{const r=await home();return r.length+' items'});
let v=null;
await T('player info (jNQXAC9IJRE)',async()=>{v=await video('jNQXAC9IJRE');return 'client '+v.client+', '+v.videoStreams.length+' video, '+v.audioStreams.length+' audio streams, '+v.subtitles.length+' captions'});
if(v){const s=v.videoStreams.find(x=>!x.videoOnly)||v.videoStreams[0]||v.audioStreams[0];
if(s){L('stream: '+s.mimeType+' '+s.codec+' '+(s.quality||''));
await T('stream request via native HTTP',async()=>{const r=await nativeFetch(s.url,{headers:{range:'bytes=0-1023','user-agent':clientUA(v.client)||navigator.userAgent}});return 'HTTP '+r.status});
await T('stream request via WebView <video>',()=>new Promise((res,rej)=>{const e=document.createElement('video');e.muted=true;e.preload='metadata';const to=setTimeout(()=>{e.removeAttribute('src');e.load();rej(new Error('timeout after 12 s'))},12000);e.onloadedmetadata=()=>{clearTimeout(to);res('loaded, '+Math.round(e.duration)+' s, '+e.videoWidth+'x'+e.videoHeight);e.removeAttribute('src');e.load()};e.onerror=()=>{clearTimeout(to);rej(new Error('media error code '+(e.error&&e.error.code)+(e.error&&e.error.message?' '+e.error.message:'')))};e.src=s.url}))}
else L('FAIL no streams returned')}
L('done in '+Math.round((performance.now()-t0)/1000)+' s')}
